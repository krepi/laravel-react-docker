<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\RecipeService;

/**
 *
 */
class RecipeController extends Controller
{

    /**
     * @var RecipeService
     */
    private RecipeService $recipeService;

    /**
     * @param RecipeService $recipeService
     */
    public function __construct(
        RecipeService $recipeService
    )
    {

        $this->recipeService = $recipeService;
    }


    /**
     * Display a listing of the resource.
     */


    public function index(): Response
    {
        return Inertia::render('Recipe/Index', [
            'recipes' => $this->recipeService->getAllRecipes(),
            'apiRecipes' => $this->recipeService->cacheApiRecipes('apiRecipes'),
            'message' => session('message')

        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Recipe/Create');
    }

    /**
     * Store a newly created resource in storage.
     */


    public function store(Request $request): RedirectResponse
    {
        $result = $this->recipeService->storeRecipe($request);
        if ($result['status'] === 'validation_error') {

            return redirect()->back()->with('message', 'Ten przepis już istnieje w Twojej kolekcji.');
        }
        return redirect()->route('recipes.show', ['recipe' => $result['recipe']->id])
            ->with('message', 'Przepis został pomyślnie zapisany.');
    }


    /**
     * Display the specified resource.
     */
    public function show(Recipe $recipe): Response
    {
        return Inertia::render('Recipe/UserRecipeDetails', ['recipe' => $recipe]);
    }

    /**
     * @param $recipeId
     * @return Response
     */
    public function showRecipeFromApi($recipeId): Response
    {
        $cacheKey = "apiRecipeDetails_{$recipeId}";
        $recipe = $this->recipeService->cacheRecipeDetails($recipeId, $cacheKey);
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
    public function update(Request $request, Recipe $recipe): RedirectResponse
    {
        $result = $this->recipeService->updateRecipe($recipe, $request);

        if ($result['status'] === 'validation_error') {
            return Redirect::back()->withErrors($result['errors']);
        } elseif ($result['status'] === 'error') {
            return Redirect::back()->with('error', $result['message']);
        }
        return redirect()->route('recipes.show', $recipe->id)->with('message', $result['message']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Recipe $recipe): RedirectResponse
    {
        $this->recipeService->deleteRecipe($recipe);
        return redirect()->route('recipes.index');
    }


    /**
     * @param Request $request
     * @return RedirectResponse
     */
    public function handleSearch(Request $request): RedirectResponse
    {
        $termFromSearch = strtolower($request->input('term'));
        $cacheKey = 'search_results_' . $termFromSearch;
        $this->recipeService->handleRecipeSearch($termFromSearch, $cacheKey);
        return redirect()->route('searched.recipes', ['cacheKey' => $cacheKey]);
    }

    /**
     * @param $cacheKey
     * @return Response
     */
    public function showSearchedRecipes($cacheKey): Response
    {
        $searchResults = $this->recipeService->showSearchedRecipes($cacheKey);
        return Inertia::render('Recipe/SearchedRecipes', ['searchResults' => $searchResults]);
    }


}
