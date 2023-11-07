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

//    public function index(): Response
//    {
//        $recipes = Recipe::all();
//
//        $cacheKey = 'apiRecipes';
//        if (cache()->has($cacheKey)) {
//            $apiRecipes = cache()->get($cacheKey);
//        } else {
//            $apiRecipes = $this->recipeApiService->fetchRecipes();
//            $titles_to_translate = array_column($apiRecipes['recipes'], 'title');
//
//            $translatedTitles = $this->translationService->translate($titles_to_translate);
//
//            foreach ($apiRecipes['recipes'] as $index => $recipe) {
//                if (isset($translatedTitles[$index])) {
//                    $apiRecipes['recipes'][$index]['title'] = $translatedTitles[$index];
//                }
//            }
//
//            cache()->put($cacheKey, $apiRecipes, now()->addMinutes(30));
//        }
//
//        return Inertia::render('Recipe/Index', [
//            'recipes' => $recipes,
//            'apiRecipes' => $apiRecipes
//        ]);
//
//    }
    public function index(): Response
    {
//        $cacheKey = 'apiRecipes';
//        $apiRecipes = cache()->remember($cacheKey, now()->addMinutes(30), function () {
//            $recipesFromApi = $this->recipeApiService->fetchRecipes();
//            $titles = array_column($recipesFromApi['recipes'], 'title');
//            $translatedTitles = $this->translationService->translate($titles);
//
//            array_walk($recipesFromApi['recipes'], function (&$recipe, $index) use ($translatedTitles) {
//                $recipe['title'] = $translatedTitles[$index] ?? $recipe['title'];
//            });
//
//            return $recipesFromApi;
//        });
//
//        return Inertia::render('Recipe/Index', [
//            'recipes' => Recipe::all(),
//            'apiRecipes' => $apiRecipes
//        ]);
        return Inertia::render('Recipe/Index', [
            'recipes' => $this->getLocalRecipes(),
            'apiRecipes' => $this->getApiRecipes()
        ]);

    }

    protected function getLocalRecipes()
    {
        return Recipe::all();
    }

    protected function getApiRecipes()
    {
        $cacheKey = 'apiRecipes';
        return cache()->remember($cacheKey, now()->addMinutes(30), function () {
            $recipesFromApi = $this->recipeApiService->fetchRecipes();
            $titles = array_column($recipesFromApi['recipes'], 'title');
            $translatedTitles = $this->translationService->translate($titles);

            array_walk($recipesFromApi['recipes'], function (&$recipe, $index) use ($translatedTitles) {
                $recipe['title'] = $translatedTitles[$index] ?? $recipe['title'];
            });

            return $recipesFromApi['recipes'];
        });
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
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $recipe = new Recipe($request->validate([
            'title' => ['required', 'max:250'],
            'body' => ['required']
        ]));
        $recipe->user_id = auth()->id();
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

    public function showRecipeFromApi($recipeId): Response
    {
        $cacheKey = "apiRecipeDetails_{$recipeId}";

        // Pobierz przepis z cache lub, jeśli nie istnieje, pobierz z API i zapisz w cache.
        $recipe = cache()->remember($cacheKey, now()->addMinutes(30), function () use ($recipeId) {
            $recipe = $this->recipeApiService->fetchRecipe($recipeId);
            $translatedTitle = $this->translationService->translateOne($recipe['title']);
            $recipe['title'] = $translatedTitle;
            return $recipe;
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
}
