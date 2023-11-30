<?php


namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\RecipeService;

class RecipeController extends Controller
{

    private RecipeService $recipeService;

    public function __construct(
        RecipeService $recipeService
    ){

        $this->recipeService = $recipeService;
    }


    /**
     * Display a listing of the resource.
     */


    public function index(): Response
    {
        return Inertia::render('Recipe/Index', [
            'recipes' => $this->recipeService->getAllRecipes(),
//            'apiRecipes' => $this->getApiRecipes(),
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
        return redirect()->back()->with('message', 'Przepis został pomyślnie zapisany.');
    }


    /**
     * Display the specified resource.
     */
    public function show(Recipe $recipe): Response
    {
        return Inertia::render('Recipe/UserRecipeDetails', ['recipe' => $recipe]);
    }


//    protected function cacheData($cacheKey, $durationInMinutes, Closure $callback)
//    {
//        return cache()->remember($cacheKey, now()->addMinutes($durationInMinutes), $callback);
//    }


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
    public function update(Request $request, Recipe $recipe)
    {
        Log::info('Updating recipe', ['request' => $request->all(), 'recipeId' => $recipe->id]);

        $result = $this->recipeService->updateRecipe($recipe, $request);

        if ($result['status'] === 'validation_error') {
            // Obsługa błędów walidacji
            return Redirect::back()->withErrors($result['errors']);
        } elseif ($result['status'] === 'error') {
            // Obsługa innych błędów (np. brak uprawnień)
            return Redirect::back()->with('error', $result['message']);
        }

//        return Redirect::back()->with('message', $result['message']);
//        return Redirect::back();
        return redirect()->route('recipes.show', $recipe->id)->with('message', $result['message']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Recipe $recipe): RedirectResponse
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


    public function handleSearch(Request $request): RedirectResponse
    {
        $termFromSearch = strtolower($request->input('term'));
        $cacheKey = 'search_results_' . $termFromSearch;
        $this->recipeService->handleRecipeSearch($termFromSearch, $cacheKey);
        return redirect()->route('searched.recipes', ['cacheKey' => $cacheKey]);
    }

    public function showSearchedRecipes($cacheKey): Response
    {
        $searchResults = $this->recipeService->showSearchedRecipes($cacheKey);
        return Inertia::render('Recipe/SearchedRecipes', ['searchResults' => $searchResults]);
    }




}
