<?php
//
//namespace App\Http\Controllers;
//
//use App\Models\Recipe;
//use App\Services\TranslationService;
//use Exception;
//use Illuminate\Http\Request;
//use Illuminate\Support\Facades\Redirect;
//use Inertia\Inertia;
//use Inertia\Response;
//use App\Services\RecipeApiService;
//use Psr\Container\ContainerExceptionInterface;
//use Psr\Container\NotFoundExceptionInterface;
//use Closure;
//use Illuminate\Support\Str;
//use Illuminate\Support\Facades\Cache;
//use App\Services\RecipeService;
//
//class RecipeController extends Controller
//{
//
//    private RecipeService $recipeService;
//
//    public function __construct(
//        RecipeService $recipeService
//    ){
//
//        $this->recipeService = $recipeService;
//    }
//
//
//    /**
//     * Display a listing of the resource.
//     */
//
//
//    public function index(): Response
//    {
//        return Inertia::render('Recipe/Index', [
//            'recipes' => $this->recipeService->getAllRecipes(),
////            'apiRecipes' => $this->getApiRecipes(),
//            'apiRecipes' => $this->recipeService->cacheApiRecipes('apiRecipes'),
//            'message' => session('message')
//
//        ]);
//
//    }
//
//    /**
//     * Show the form for creating a new resource.
//     */
//    public function create()
//    {
//        return Inertia::render('Recipe/Create');
//    }
//
//    /**
//     * Store a newly created resource in storage.
//     */
//
//
//    public function store(Request $request)
//    {
//        $result = $this->recipeService->storeRecipe($request);
//
//        if ($result['status'] === 'validation_error') {
//
//            return redirect()->back()->with('message', 'Ten przepis już istnieje w Twojej kolekcji.');
//        }
//        return redirect()->back()->with('message', 'Przepis został pomyślnie zapisany.');
//    }
//
//
//    /**
//     * Display the specified resource.
//     */
//    public function show(Recipe $recipe): Response
//    {
//        return Inertia::render('Recipe/UserRecipeDetails', ['recipe' => $recipe]);
//    }
//
//    /**
//     * @throws ContainerExceptionInterface
//     * @throws NotFoundExceptionInterface
//     * @throws Exception
//     */
//
////    protected function cacheData($cacheKey, $durationInMinutes, Closure $callback)
////    {
////        return cache()->remember($cacheKey, now()->addMinutes($durationInMinutes), $callback);
////    }
//
//
//
//
//
//    public function showRecipeFromApi($recipeId): Response
//    {
//        $cacheKey = "apiRecipeDetails_{$recipeId}";
//        $recipe = $this->recipeService->cacheRecipeDetails($recipeId, $cacheKey);
//        return Inertia::render('Recipe/RecipeApiDetails', [
//            'recipe' => $recipe,
//            'message' => session('message')
//        ]);
//    }
//
//
//    /**
//     * Show the form for editing the specified resource.
//     */
//    public function edit(Recipe $recipe): Response
//    {
//        return Inertia::render('Recipe/Edit', ['recipe' => $recipe]);
//    }
//
//    /**
//     * Update the specified resource in storage.
//     */
//    public function update(Request $request, Recipe $recipe): \Illuminate\Http\RedirectResponse
//    {
//        $recipe->update(
//            $request->validate([
//                'title' => ['required', 'max:250'],
//                'body' => ['required']

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
        $cacheKey = 'search_results_' . $termFromSearch;
        $this->recipeService->handleRecipeSearch($termFromSearch, $cacheKey);
        return redirect()->route('searched.recipes', ['cacheKey' => $cacheKey]);
    }

    public function showSearchedRecipes($cacheKey)
    {
        $searchResults = $this->recipeService->showSearchedRecipes($cacheKey);
        return Inertia::render('Recipe/SearchedRecipes', ['searchResults' => $searchResults]);
    }


    /**
     * Remove the specified resource from storage.
     */
//    public function destroy(Recipe $recipe): \Illuminate\Http\RedirectResponse
//    {
//        if ($recipe->image) {
//            $imagePath = public_path() . $recipe->image;
//            if (file_exists($imagePath)) {
//                unlink($imagePath); // Usunięcie obrazu z dysku
//            }
//        }
//        $recipe->delete();
//        return redirect()->route('recipes.index');
//    }
//
//
//    public function handleSearch(Request $request)
//    {
//        $termFromSearch = strtolower($request->input('term'));
//        $cacheKey = 'search_results_' . $termFromSearch;
//        $this->recipeService->handleRecipeSearch($termFromSearch, $cacheKey);
//        return redirect()->route('searched.recipes', ['cacheKey' => $cacheKey]);
//    }
//
//    public function showSearchedRecipes($cacheKey)
//    {
//        $searchResults = $this->recipeService->showSearchedRecipes($cacheKey);
//        return Inertia::render('Recipe/SearchedRecipes', ['searchResults' => $searchResults]);
//    }

}
