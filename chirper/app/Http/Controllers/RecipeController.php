<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use App\Services\TranslationService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Http;
use App\Services\RecipeApiService;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Closure;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class RecipeController extends Controller
{

    private RecipeApiService $recipeApiService;
    private TranslationService $translationService;

    public function __construct(RecipeApiService $recipeApiService, TranslationService $translationService)
    {
        $this->recipeApiService = $recipeApiService;
        $this->translationService = $translationService;
    }


    /**
     * Display a listing of the resource.
     */


    public function index(): Response
    {
        return Inertia::render('Recipe/Index', [
            'recipes' => $this->getLocalRecipes(),
            'apiRecipes' => $this->getApiRecipes()
        ]);

    }

    protected function getLocalRecipes()
    {
        return Recipe::all();
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Recipe/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
//    public function store(Request $request): \Illuminate\Http\RedirectResponse
//    {
//        $recipe = new Recipe($request->validate([
//            'title' => ['required', 'max:250'],
//            'body' => ['required']
//        ]));
//        $recipe->user_id = auth()->id();
//        $recipe->save();
//
//        return Redirect::route('recipes.index');
//    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validatedData = $request->validate([
            'title' => 'required|max:250',
            'ingredients' => 'required|json',
            'instructions' => 'required|string',
            'ready_in_minutes' => 'nullable|integer',
            'servings' => 'nullable|integer',
            'image' => 'nullable|image|max:2048', // Dodane pole dla obrazu
            'source' => 'required|in:spoon,user', // Dodaj walidację dla 'source'
        ]);

        $recipe = new Recipe($validatedData);
        $recipe->user_id = auth()->id();

        if ($request->hasFile('image')) {
            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('images/recipes'), $imageName);
            $recipe->image = '/images/recipes/' . $imageName;
        }

        $recipe->save();

        return Redirect::route('recipes.index');
    }


    /**
     * Display the specified resource.
     */
    public function show(Recipe $recipe): Response
    {
        return Inertia::render('Recipe/Show', ['recipe' => $recipe]);
    }

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     * @throws Exception
     */

    protected function cacheData($cacheKey, $durationInMinutes, Closure $callback)
    {
        return cache()->remember($cacheKey, now()->addMinutes($durationInMinutes), $callback);
    }


    protected function translateRecipeFields($recipe, $translationMap)
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

    protected function translateNestedFields($item, $fieldsToTranslate)
    {
        foreach ($fieldsToTranslate as $nestedField => $nestedMethod) {
            if (isset($item[$nestedField])) {
                if ($nestedMethod === 'translate') {
                    $item[$nestedField] = $this->translationService->translate($item[$nestedField]);
                } elseif ($nestedMethod === 'translateOne') {
                    $item[$nestedField] = $this->translationService->translateOne($item[$nestedField]);
                }
            }
        }
        return $item;
    }


    protected function getApiRecipes()
    {
        $cacheKey = 'apiRecipes';
        return $this->cacheData($cacheKey, 30, function () {
            $recipesFromApi = $this->recipeApiService->fetchRecipes();
            $translationMap = [
                'title' => 'translateOne', // Tłumaczenie pojedynczego pola
                // Możesz dodać więcej pól do tłumaczenia, jeśli będzie taka potrzeba
            ];

            foreach ($recipesFromApi['recipes'] as $key => $recipe) {
                // Używamy mapy translacji dla każdego przepisu
                $recipesFromApi['recipes'][$key] = $this->translateRecipeFields($recipe, $translationMap);
            }

            return $recipesFromApi['recipes'];
        });
    }


    public function showRecipeFromApi($recipeId): Response
    {
        $cacheKey = "apiRecipeDetails_{$recipeId}";
        $recipe = $this->cacheData($cacheKey, 30, function () use ($recipeId) {
            $recipe = $this->recipeApiService->fetchRecipe($recipeId);
            $translationMap = [
                'title' => 'translateOne', // Tłumaczenie pojedynczego pola
                'instructions' => 'translateOne',
                'extendedIngredients' => [
                    'original' => 'translateOne' // Tłumaczenie zagnieżdżonych pól
                ]
            ];
            return $this->translateRecipeFields($recipe, $translationMap);
        });

        return Inertia::render('Recipe/RecipeApiDetails', ['recipe' => $recipe]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Recipe $recipe): Response
    {
        return Inertia::render('Recipe/Edit', ['recipe' => $recipe]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Recipe $recipe): \Illuminate\Http\RedirectResponse
    {
        $recipe->update(
            $request->validate([
                'title' => ['required', 'max:250'],
                'body' => ['required']
            ])
        );

        return Redirect::back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Recipe $recipe): \Illuminate\Http\RedirectResponse
    {
        $recipe->delete();
        return Redirect::back();
    }

    public function handleSearch(Request $request)
    {
        $searchTerm = $request->input('term');
        $cacheKey = 'search_results_' . Str::random(10); // Tworzenie unikalnego klucza dla cache

        try {
            $searchResults = $this->recipeApiService->searchRecipes($searchTerm);
            Cache::put($cacheKey, $searchResults, now()->addMinutes(5)); // Zapis do cache na 5 minut
        } catch (Exception $e) {
            // Obsługa błędu może zostać wykonana zgodnie z wymaganiami aplikacji
            abort(500, 'Wystąpił błąd podczas wyszukiwania przepisów.');
        }

        // Przekierowanie do metody wyświetlającej wyniki wyszukiwania z kluczem cache
        return redirect()->route('searched.recipes', ['cacheKey' => $cacheKey]);
    }

    public function showSearchedRecipes(Request $request, $cacheKey)
    {
        // Pobranie wyników wyszukiwania z cache
        $searchResults = Cache::get($cacheKey, []);

        // Przekazanie wyników wyszukiwania do widoku
        return Inertia::render('Recipe/SearchedRecipes', ['searchResults' => $searchResults]);
    }


}
