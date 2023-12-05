<?php

namespace App\Services;

use App\Models\Recipe;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Cache;

class RecipeService
{


    private $translationService;
    private $recipeApiService;

    public function __construct(TranslationService $translationService, RecipeApiService $recipeApiService)
    {
        $this->translationService = $translationService;
        $this->recipeApiService = $recipeApiService;
    }

    /**
     * @return Collection
     */
    public function getAllRecipes(): Collection
{
    return Recipe::all();
}
    public function getPaginatedRecipes($perPage = 10) {
        return Recipe::paginate($perPage);

    }


    public function getUserRecipes($userId,$perPage = 10) {
        return Recipe::where('user_id', $userId)->paginate($perPage);
    }



    public function storeRecipe(Request $request)
    {
        $rules = $this->getValidationRules($request);

        try {
            $validatedData = $request->validate($rules);
            $recipe = $this->createRecipe($validatedData, $request);

            return ['status' => 'success', 'recipe' => $recipe, 'message' => 'Przepis został pomyślnie zapisany.'];

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Zwróć błędy walidacji
            return ['status' => 'validation_error', 'errors' => $e->errors()];

        }
    }


    public function updateRecipe(Recipe $recipe, Request $request)
    {
//        Log::info('Aktualizacja przepisu w serwisie:', ['request' => $request->all(), 'recipeId' => $recipe->id]);
        $oldImagePath = $recipe->image ? public_path() . $recipe->image : null;
        if ($recipe->user_id !== Auth::id()) {
            return ['status' => 'error', 'message' => 'Nie masz uprawnień do edycji tego przepisu.'];
        }
        // Zasady walidacji
        $rules = [
            'title' => 'required|max:250',
            'ingredients' => 'required|json',
            'instructions' => 'required|string',
            'ready_in_minutes' => 'nullable|integer',
            'servings' => 'nullable|integer',
            'image' => $request->hasFile('image') ? 'image|max:2048' : '',
        ];

        $validatedData = $request->validate($rules);

//        // Aktualizacja przepisu
        $recipe->fill($validatedData);

        if ($request->hasFile('image')) {

            if ($recipe->image) {
//                Log::info('Ścieżka do starego obrazka:', ['oldImagePath' => $oldImagePath]);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }

            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('images/recipes'), $imageName);
            $recipe->image = '/images/recipes/' . $imageName;
            Log::info('Ścieżka do starego obrazka:', ['newImagePath' => $recipe->image]);
        }
        $recipe->save();

        return ['status' => 'success', 'recipe' => $recipe, 'message' => 'Przepis został pomyślnie zaktualizowany.'];
    }

    public function deleteRecipe(Recipe $recipe)
    {
        if ($recipe->image) {
            $imagePath = public_path() . $recipe->image;
            if (file_exists($imagePath)) {
                unlink($imagePath); // Usunięcie obrazu z dysku
            }
        }
        $recipe->delete();

    }

    protected function getValidationRules(Request $request)
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
        ];

        if ($request->input('source') === 'user') {
            $rules['image'] = 'nullable|image|max:2048';
        } elseif ($request->input('source') === 'spoon') {
            $rules['image'] = 'nullable|string';
        }

        return $rules;
    }

    protected function recipeExists($validatedData)
    {
        return Recipe::where('id_from_api', $validatedData['id_from_api'])
            ->where('user_id', Auth::id())
            ->exists();
    }

    protected function createRecipe($validatedData, $request)
    {
        $recipe = new Recipe($validatedData);
        $recipe->user_id = Auth::id();
        if ($validatedData['source'] === 'spoon') {
            $recipe->id_from_api = $validatedData['id_from_api']; // Dodaj pole id_from_api do obiektu Recipe
        }
        if ($request->hasFile('image')) {
            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('images/recipes'), $imageName);
            $recipe->image = '/images/recipes/' . $imageName;
        }

        $recipe->save();
        return $recipe;
    }

    // Dodatkowe metody do zarządzania przepisami z zewnętrznego API, tłumaczenia itp.

    public function cacheApiRecipes(string $cacheKey)
    {

        return Cache::remember($cacheKey, now()->addMinutes(30), function () {
            $recipesFromApi = $this->recipeApiService->fetchRecipes();

            return $this->translateRecipes($recipesFromApi);
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



    // Metody tłumaczenia przeniesione z RecipeController
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

    public function handleRecipeSearch(string $term, string $cacheKey)
    {
        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($term) {
            try {
                $searchTerm = $this->translationService->translateOne($term, 'en');
                $searchResults = $this->recipeApiService->searchRecipes($searchTerm);
                foreach ($searchResults as $key => $recipe) {
                    $searchResults[$key] = $this->translateRecipeFields($recipe, ['title' => 'translateOne']);
                }
                return $searchResults;
            } catch (Exception $e) {
                // Obsługa wyjątku
                return [];
            }
        });
    }

    public function showSearchedRecipes(string $cacheKey)
    {
        return Cache::get($cacheKey, []);
    }

//    public function storeUserRecipe($recipeId, $userId)
//    {
//        $originalRecipe = Recipe::findOrFail($recipeId);
//        if (Recipe::where('user_id', $userId)->where('id_from_api', $originalRecipe->id_from_api)->exists()) {
//            // Obsługa sytuacji, gdy przepis już istnieje
//            return response()->json(['message' => 'Posiadasz już ten przepis.'], 409); // Przykładowy komunikat błędu
//        }
//        $userRecipe = $originalRecipe->replicate();
//        $userRecipe->user_id = $userId;
//        $userRecipe->save();
//
//        return $userRecipe;
//    }


    public function storeUserRecipe($recipeId, $userId)
    {
        $originalRecipe = Recipe::findOrFail($recipeId);

        if (Recipe::where('user_id', $userId)->where('id_from_api', $originalRecipe->id_from_api)->exists()) {
            return response()->json(['message' => 'Posiadasz już ten przepis.'], 409);
        }

        $userRecipe = $originalRecipe->replicate();
        $userRecipe->user_id = $userId;

        if ($this->isLocalImage($originalRecipe->image)) {
            $newImagePath = $this->copyImage($originalRecipe->image);
            $userRecipe->image = $newImagePath;
        } else {
            // Jeśli to zewnętrzny URL, po prostu przypisz ten sam URL
            $userRecipe->image = $originalRecipe->image;
        }

        $userRecipe->save();

        return $userRecipe;
    }

    protected function isLocalImage($imagePath)
    {
        // Sprawdź, czy ścieżka obrazka wskazuje na zasób lokalny
        return !filter_var($imagePath, FILTER_VALIDATE_URL) && file_exists(public_path($imagePath));
    }

    protected function copyImage($imagePath)
    {
        // Pobranie tylko nazwy pliku z oryginalnej ścieżki
        $originalFileName = basename($imagePath);

        // Utworzenie nowej nazwy pliku z unikalnym prefiksem
        $newImageName = time() . '-' . $originalFileName;
        $newImagePath = public_path('images/recipes') . '/' . $newImageName;

        // Skopiowanie pliku, jeśli istnieje
        if (file_exists(public_path($imagePath))) {
            copy(public_path($imagePath), $newImagePath);
        }

        return '/images/recipes/' . $newImageName;
    }





}
