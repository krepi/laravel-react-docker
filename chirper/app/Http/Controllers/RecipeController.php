<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use App\Services\TranslationService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\RecipeApiService;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Closure;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use App\Services\RecipeService;

class RecipeController extends Controller
{

    private RecipeApiService $recipeApiService;
    private TranslationService $translationService;
    private RecipeService $recipeService;

    public function __construct(
        RecipeApiService $recipeApiService,
        TranslationService $translationService,
        RecipeService $recipeService
    ){
        $this->recipeApiService = $recipeApiService;
        $this->translationService = $translationService;
        $this->recipeService = $recipeService;
    }


    /**
     * Display a listing of the resource.
     */


    public function index(): Response
    {
        return Inertia::render('Recipe/Index', [
            'recipes' => $this->recipeService->getAllRecipes(),
            'apiRecipes' => $this->getApiRecipes(),
            'message' => session('message')

        ]);

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


    public function store(Request $request)
    {
        $result = $this->recipeService->storeRecipe($request);

        if ($result['status'] === 'validation_error') {

            return redirect()->back()->with('message', 'Ten przepis już istnieje w Twojej kolekcji.');
        }
        return redirect()->back()->with('message', 'Przepis został pomyślnie zapisany.');
    }


    /**
     * Display the specified resource.
     */
    public function show(Recipe $recipe): Response
    {
        return Inertia::render('Recipe/UserRecipeDetails', ['recipe' => $recipe]);
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
                    'originalName' => 'translateOne',
                    'measures' => [
                        'metric' => [
                            'unitLong' => 'translateOne'
                        ]
                    ]                   // Tłumaczenie zagnieżdżonych pól
                ]
            ];
            return $this->translateRecipeFields($recipe, $translationMap);
        });

        return Inertia::render('Recipe/RecipeApiDetails', [
            'recipe' => $recipe,
            'message' => session('message')
        ]);
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
        if ($recipe->image) {
            $imagePath = public_path() . $recipe->image;
            if (file_exists($imagePath)) {
                unlink($imagePath); // Usunięcie obrazu z dysku
            }
        }
        $recipe->delete();
        return redirect()->route('recipes.index');
    }


    public function handleSearch(Request $request)
    {
        $termFromSearch = strtolower($request->input('term'));
        $cacheKey = 'search_results_' . $termFromSearch; // Klucz cache oparty na oryginalnym terminie

        // Sprawdzenie, czy wyniki są już w cache
        $cachedResults = Cache::get($cacheKey);
        if ($cachedResults) {
            return redirect()->route('searched.recipes', ['cacheKey' => $cacheKey]);
        }

        // Tłumaczenie terminu wyszukiwania, jeśli wyniki nie są w cache
        $searchTerm = $this->translationService->translateOne($termFromSearch, 'en');

        try {
            $searchResults = $this->recipeApiService->searchRecipes($searchTerm);

            $translationMap = ['title' => 'translateOne'];

            foreach ($searchResults as $key => $recipe) {
                $searchResults[$key] = $this->translateRecipeFields($recipe, $translationMap);
            }

            // Zapis do cache
            Cache::put($cacheKey, $searchResults, now()->addMinutes(15));
        } catch (Exception $e) {
            abort(500, 'Wystąpił błąd podczas wyszukiwania przepisów.');
        }

        return redirect()->route('searched.recipes', ['cacheKey' => $cacheKey]);
    }


    public function showSearchedRecipes(Request $request, $cacheKey)
    {
        $searchResults = Cache::get($cacheKey, []);



        return Inertia::render('Recipe/SearchedRecipes', ['searchResults' => $searchResults]);
    }


}
