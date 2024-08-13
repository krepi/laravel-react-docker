<?php

namespace App\Services;

use App\Http\Controllers\RecipeController;
use App\Models\Recipe;
use App\Repositories\RecipeRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class RecipeService
{

    private $recipeRepository;
    private $translationService;
    private $recipeApiService;
    private $imageService;

    public function __construct(
        TranslationService $translationService,
        RecipeApiService   $recipeApiService,
        RecipeRepository   $recipeRepository,
        ImageService       $imageService)
    {
        $this->recipeRepository = $recipeRepository;
        $this->translationService = $translationService;
        $this->recipeApiService = $recipeApiService;
        $this->imageService = $imageService;
    }

    /**
     * @return Collection
     */
    public function getAllRecipes()
    {
        return $this->recipeRepository->getAllRecipes();
    }

    public function getPaginatedRecipes($perPage = 10)
    {
        return $this->recipeRepository->getPaginatedRecipes();
    }


    public function getUserRecipes($userId, $perPage = 10)
    {
        return $this->recipeRepository->getUserRecipes($userId, $perPage);
    }


    public function storeRecipe(Request $request): array
    {
        try {
            $rules = $this->getValidationRules($request);
            $validatedData = $request->validate($rules);

            // Obsługa logiki biznesowej
            if ($request->hasFile('image')) {
                $imageName = time() . '.' . $request->image->extension();
                $request->image->move(public_path('images/recipes'), $imageName);
                $validatedData['image'] = '/images/recipes/' . $imageName;
            }
            // Dodanie ID użytkownika
            $validatedData['user_id'] = Auth::id();
            // Wywołanie repozytorium do zapisania przepisu
            $recipe = $this->recipeRepository->createRecipe($validatedData);

            return ['status' => 'success', 'recipe' => $recipe, 'message' => 'Przepis został pomyślnie zapisany.'];

        } catch (\Illuminate\Validation\ValidationException $e) {
            return ['status' => 'validation_error', 'errors' => $e->errors()];
        }
    }

    public function isRecipeSaved($apiRecipeId, $userId) {
        return Recipe::where('user_id', $userId)
            ->where('id_from_api', $apiRecipeId)
            ->exists();
    }

    /**
     * @param $recipeId
     * @param $userId
     * @return Recipe|JsonResponse|RedirectResponse
     */
    public function storeUserRecipeServiceMethod($recipeId, $userId)
    {
        $originalRecipe = $this->recipeRepository->findById($recipeId);
        if ($originalRecipe->id_from_api != null) {
            if ($this->recipeRepository->existsForUser($userId, $originalRecipe->id_from_api)) {
                return response()->json(['message' => 'Posiadasz już ten przepis.'], 409);
            }
        }
        $userRecipe = $originalRecipe->replicate();
        $userRecipe->user_id = $userId;

        if ($this->imageService->isLocalImage($originalRecipe->image)) {
            $newImagePath = $this->imageService->copyImage($originalRecipe->image);
            $userRecipe->image = $newImagePath;
        } else {
            $userRecipe->image = $originalRecipe->image; // Przypadek dla zewnętrznego URL
        }

        $this->recipeRepository->save($userRecipe);


        return $userRecipe;
    }


    public function updateRecipe(Recipe $recipe, Request $request): array
    {
        if ($recipe->user_id !== Auth::id()) {
            return ['status' => 'error', 'message' => 'Nie masz uprawnień do edycji tego przepisu.'];
        }

        // Walidacja
        $rules = $this->getValidationRulesForUpdate($request);
        $validatedData = $request->validate($rules);

        // Obsługa obrazka
        $oldImagePath = $recipe->image ? public_path() . $recipe->image : null;
        $this->imageService->updateImage($request, $validatedData, $oldImagePath);

        // Aktualizacja przepisu
        $updatedRecipe = $this->recipeRepository->update($recipe, $validatedData);

        return ['status' => 'success', 'recipe' => $updatedRecipe, 'message' => 'Przepis został pomyślnie zaktualizowany.'];
    }

    public function deleteRecipe(Recipe $recipe): void
    {
        $this->imageService->deleteImage($recipe->image);
        $this->recipeRepository->delete($recipe);
    }




    public function cacheApiRecipes(string $cacheKey): array
    {
        return Cache::remember($cacheKey, now()->addMinutes(30), function () {
            $response = $this->recipeApiService->fetchRecipes();

            if (!isset($response['success'])) {
                // Jeśli klucz 'success' nie istnieje, uznajemy to za błąd
                return ['success' => false, 'error' => 'Błąd odpowiedzi API'];
            }
            $userId = Auth::id();
            foreach ($response['data']['recipes'] as &$apiRecipe) {
                $apiRecipe['is_saved'] = $this->isRecipeSaved($apiRecipe['id'], $userId);
            }
            if ($response['success']) {
                return $this->translateRecipes($response['data']);
            } else {
                return ['success' => false, 'error' => $response['error']];
            }
        });
    }

    protected function translateRecipes($recipesFromApi)
    {
        $translationMap = [
            'title' => 'translateOne', // Tłumaczenie tytułu przepisu
        ];

        foreach ($recipesFromApi['recipes'] as $key => $recipe) {
            $recipesFromApi['recipes'][$key] = $this->translateRecipeFields($recipe, $translationMap);
        }
        return $recipesFromApi['recipes'];
    }


    public function cacheRecipeDetails($recipeId, string $cacheKey)
    {
        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($recipeId) {
            $recipe = $this->recipeApiService->fetchRecipe($recipeId);
            return $this->translateRecipeFields($recipe, $this->getDetailedTranslationMap());
        });


    }

    private function getDetailedTranslationMap(): array
    {
        return [
            'title' => 'translateOne', // Tłumaczenie pojedynczego pola
            'instructions' => 'translateOne',
            'extendedIngredients' => [
                'originalName' => 'translateOne',
                'measures' => [
                    'metric' => [
                        'unitLong' => 'translateOne'
                    ]
                ]
            ]

        ];
    }


    public function translateRecipeFields(array $recipe, array $translationMap): array
    {
        foreach ($translationMap as $field => $method) {
            if (!isset($recipe[$field])) {
                continue;
            }
            if ($method === 'translate') {
                $recipe[$field] = $this->translationService->translate($recipe[$field]);
            } elseif ($method === 'translateOne') {
                $recipe[$field] = $this->translationService->translateOne($recipe[$field]);
            } elseif (is_array($method)) {
                // Tłumaczenie zagnieżdżonych pól
                foreach ($recipe[$field] as $key => $item) {
                    $recipe[$field][$key] = $this->translateNestedFields($item, $method);
                }
            }
        }

        return $recipe;
    }

    public function translateNestedFields(array $item, array $fieldsToTranslate): array
    {
        foreach ($fieldsToTranslate as $nestedField => $nestedMethod) {
            if (isset($item[$nestedField])) {
                if ($nestedMethod === 'translate') {
                    $item[$nestedField] = $this->translationService->translate($item[$nestedField]);
                } elseif ($nestedMethod === 'translateOne') {
                    $item[$nestedField] = $this->translationService->translateOne($item[$nestedField]);
                } elseif (is_array($nestedMethod)) {
                    // Obsługa jeszcze głębszego poziomu zagnieżdżenia
                    foreach ($nestedMethod as $deepNestedField => $deepNestedMethod) {
                        if (isset($item[$nestedField][$deepNestedField])) {
                            $item[$nestedField][$deepNestedField] = $this->translateNestedFields($item[$nestedField][$deepNestedField], $deepNestedMethod);
                        }
                    }
                }
            }
        }
        return $item;
    }



    public function extractAndTranslateQuery($term): array
    {
        $original = '';
        $translated = '';

        $start = strpos($term, 'query=');
        if ($start !== false) {
            $start += strlen('query=');
            $end = strpos($term, '&', $start);
            $original = $end !== false ? substr($term, $start, $end - $start) : substr($term, $start);

            if (!empty($original)) {
                $translated = $this->translationService->translateOne($original, 'en');
            }
        }

        return ['original' => $original, 'translated' => $translated];
    }


    public function handleRecipeSearch(string $term, string $cacheKey)
    {
        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($term) {
            try {
                $queryParts = $this->extractAndTranslateQuery($term);
                $originalQuery = $queryParts['original'];
                $translatedQuery = $queryParts['translated'];

                if (!empty($originalQuery) && !empty($translatedQuery)) {$term = str_replace('query=' . $originalQuery, 'query=' . $translatedQuery, $term);
                }

                $searchResults = $this->recipeApiService->searchRecipes($term);
                $userId = Auth::id(); // Pobierz ID bieżącego użytkownika
                foreach ($searchResults as $key => $recipe) {
                    $searchResults[$key] = $this->translateRecipeFields($recipe, ['title' => 'translateOne']);
                    // Dodaj informację, czy przepis jest już zapisany
                    $searchResults[$key]['is_saved'] = $this->isRecipeSaved($recipe['id'], $userId);
                }

                return $searchResults;

            } catch (Exception $e) {
                // Obsługa wyjątku
                return [];
            }
        });
    }

    public function showSearchedRecipesFromService(string $cacheKey): array
    {
        return Cache::get($cacheKey, []);
    }


    protected function getValidationRules(Request $request): array
    {
        $rules = [
            'title' => 'required|max:250',
            'ingredients' => 'required|json',
            'instructions' => 'required|string',
            'ready_in_minutes' => 'nullable|integer',
            'servings' => 'nullable|integer',
            'source' => 'required|in:spoon,user',
            'id_from_api' => [
                'nullable',
                'integer',
                Rule::unique('recipes')->where(function ($query) use ($request) {
                    return $query->where('user_id', Auth::id());
                })
            ],

            'nutrition' => 'nullable|json',
            'diets' => 'nullable|json',
        ];

        if ($request->input('source') === 'user') {
            $rules['image'] = 'nullable|image|max:2048';
        } elseif ($request->input('source') === 'spoon') {
            $rules['image'] = 'nullable|string';
        }

        return $rules;
    }

    protected function getValidationRulesForUpdate(Request $request): array
    {
        return [
            'title' => 'sometimes|required|max:250',
            'ingredients' => 'sometimes|required|json',
            'instructions' => 'sometimes|required|string',
            'ready_in_minutes' => 'nullable|integer',
            'servings' => 'nullable|integer',
            'image' => $request->hasFile('image') ? 'image|max:2048' : 'nullable|string',
        ];
    }


}


