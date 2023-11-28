<?php

namespace App\Services;

use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Cache;

class RecipeService {


    private $translationService;
    private $recipeApiService;

    public function __construct(TranslationService $translationService, RecipeApiService $recipeApiService)
    {
        $this->translationService = $translationService;
        $this->recipeApiService = $recipeApiService;
    }

    public function getAllRecipes() {
        return Recipe::all();
    }

    public function storeRecipe(Request $request) {
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
    public function updateRecipe(Recipe $recipe, Request $request) {
        $validatedData = $request->validate([
            'title' => ['required', 'max:250'],
            'body' => ['required']
        ]);

        $recipe->update($validatedData);
        return $recipe;
    }

    public function deleteRecipe(Recipe $recipe) {
        $recipe->delete();
        return ['status' => 'deleted'];
    }

    protected function getValidationRules(Request $request) {
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

    protected function recipeExists($validatedData) {
        return Recipe::where('id_from_api', $validatedData['id_from_api'])
            ->where('user_id', Auth::id())
            ->exists();
    }

    protected function createRecipe($validatedData, $request) {
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
//        return Cache::remember($cacheKey, now()->addMinutes(30), function () {
//            $recipesFromApi = $this->recipeApiService->fetchRecipes();
//            return $this->translateRecipes($recipesFromApi);
//        });
//        $cacheKey = 'apiRecipes';
        return Cache::remember($cacheKey, now()->addMinutes(30), function () {
            $recipesFromApi = $this->recipeApiService->fetchRecipes();
//            $translationMap = [
//                'title' => 'translateOne', // Tłumaczenie tytułu przepisu
//                // Możliwe inne pola do tłumaczenia, jeśli to konieczne
//            ];
//
//            foreach ($recipesFromApi['recipes'] as $key => $recipe) {
//                $recipesFromApi['recipes'][$key] = $this->translateRecipeFields($recipe, $translationMap);
//            }
//
//            return $recipesFromApi['recipes'];
            return $this->translateRecipes($recipesFromApi);
        });
    }

    protected function translateRecipes($recipesFromApi){
        $translationMap = [
            'title' => 'translateOne', // Tłumaczenie tytułu przepisu
            // Możliwe inne pola do tłumaczenia, jeśli to konieczne
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
            return $this->translateRecipeFields($recipe,$this->getDetailedTranslationMap());
        });


    }
private function getDetailedTranslationMap(){
        return [
            'title' => 'translateOne', // Tłumaczenie pojedynczego pola
            'instructions' => 'translateOne',
            'extendedIngredients' => [
                'originalName' => 'translateOne',
                'measures' => [
                    'metric' => [
                        'unitLong' => 'translateOne'
                    ]
                ]                   // Tłumaczenie zagnieżdżonych pól
            ]

        ];
}

    //public function showRecipeFromApi($recipeId): Response
//{
//    $cacheKey = "apiRecipeDetails_{$recipeId}";
//    $recipe = $this->cacheData($cacheKey, 30, function () use ($recipeId) {
//        $recipe = $this->recipeApiService->fetchRecipe($recipeId);
//        $translationMap = [
//            'title' => 'translateOne', // Tłumaczenie pojedynczego pola
//            'instructions' => 'translateOne',
//            'extendedIngredients' => [
//                'originalName' => 'translateOne',
//                'measures' => [
//                    'metric' => [
//                        'unitLong' => 'translateOne'
//                    ]
//                ]                   // Tłumaczenie zagnieżdżonych pól
//            ]
//        ];
//        return $this->translateRecipeFields($recipe, $translationMap);
//    });
//
//    return Inertia::render('Recipe/RecipeApiDetails', [
//        'recipe' => $recipe,
//        'message' => session('message')
//    ]);
//}

    // Metody tłumaczenia przeniesione z RecipeController
    public function translateRecipeFields(array $recipe, array $translationMap): array
    {
        // ... Implementacja metody translateRecipeFields
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
        // ... Implementacja metody translateNestedFields
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

//    protected function translateRecipes(array $recipes): array
//    {
//        return array_map(function ($recipe) {
//            return $this->translateRecipeFields($recipe, $this->getTranslationMap());
//        }, $recipes);
//    }

}

//public function showRecipeFromApi($recipeId): Response
//{
//    $cacheKey = "apiRecipeDetails_{$recipeId}";
//    $recipe = $this->cacheData($cacheKey, 30, function () use ($recipeId) {
//        $recipe = $this->recipeApiService->fetchRecipe($recipeId);
//        $translationMap = [
//            'title' => 'translateOne', // Tłumaczenie pojedynczego pola
//            'instructions' => 'translateOne',
//            'extendedIngredients' => [
//                'originalName' => 'translateOne',
//                'measures' => [
//                    'metric' => [
//                        'unitLong' => 'translateOne'
//                    ]
//                ]                   // Tłumaczenie zagnieżdżonych pól
//            ]
//        ];
//        return $this->translateRecipeFields($recipe, $translationMap);
//    });
//
//    return Inertia::render('Recipe/RecipeApiDetails', [
//        'recipe' => $recipe,
//        'message' => session('message')
//    ]);
//}
