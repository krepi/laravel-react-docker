<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
    public function __construct(RecipeService $recipeService)
    {
        $this->recipeService = $recipeService;
    }


    /**
     * Display a listing of the resource.
     */


//    public function index(): Response
//    {
//        return Inertia::render('Recipe/Index', [
//            'recipes' => $this->recipeService->getAllRecipes(),
//            'apiRecipes' => $this->recipeService->cacheApiRecipes('apiRecipes'),
//            'message' => session('message')
//
//        ]);
//
//    }
    public function index(): Response
    {
        $apiRecipesResponse = $this->recipeService->cacheApiRecipes('apiRecipes');

        // Jeśli wystąpił błąd podczas pobierania przepisów z API
        if (!$apiRecipesResponse['success']) {
            return Inertia::render('Recipe/Index', [
                'recipes' => $this->recipeService->getAllRecipes(),
                'apiRecipes' => [],
                'error' => $apiRecipesResponse['error'],
                'message' => session('message')
            ]);
        }

        // Jeśli wszystko przebiegło pomyślnie
        return Inertia::render('Recipe/Index', [
            'recipes' => $this->recipeService->getAllRecipes(),
            'apiRecipes' => $apiRecipesResponse,
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
        $this->authorize('update', $recipe);
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
        $this->authorize('delete', $recipe);

        try {
            $this->recipeService->deleteRecipe($recipe);
            return redirect()->route('recipes.index')->with('success', 'Przepis został usunięty.');
        } catch (\Exception $e) {
            // Logowanie błędu lub inna obsługa wyjątku
            return redirect()->back()->with('error', 'Wystąpił błąd podczas usuwania przepisu.');
        }
    }



    /**
     * @param Request $request
     * @return RedirectResponse
     */
    public function handleSearch(Request $request): RedirectResponse
    {

//        $termFromSearch = strtolower($request->input('term'));
        $termFromSearch = urldecode($request->input('term'));

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



    public function storeUserRecipe(Request $request): RedirectResponse
    {
        $recipeId = $request->input('recipeId');
        $response = $this->recipeService->storeUserRecipe($recipeId, Auth::id());

        // Sprawdzenie, czy odpowiedź jest instancją JsonResponse (co oznacza błąd)
        if ($response instanceof \Illuminate\Http\JsonResponse) {
            // Przekierowanie z powrotem na stronę oryginalnego przepisu z komunikatem błędu
            return redirect()->route('recipes.show', $recipeId)
                ->with('error', $response->getData()->message);
        }

        // W przypadku sukcesu przekieruj na stronę nowego przepisu
        return redirect()->route('recipes.show', $response->id)
            ->with('success', 'Przepis został pomyślnie zapisany');
    }


}

//    public function storeUserRecipe(Request $request)
//    {
//        $recipeId = $request->input('recipeId');
//        // Znajdź oryginalny przepis lub zwróć błąd 404, jeśli nie istnieje
//        $originalRecipe = Recipe::findOrFail($recipeId);
//
//        // Utwórz nową instancję przepisu i skopiuj dane
//        $userRecipe = $originalRecipe->replicate();
//
//        // Przypisz bieżącego użytkownika jako właściciela nowej kopii
//        $userRecipe->user_id = Auth::id();
//
//        // Zapisz nową kopię przepisu w bazie danych
//        $userRecipe->save();
//
//        // Zwróć odpowiedź, na przykład przekierowanie do nowo utworzonego przepisu
//        return redirect()->route('recipes.show', $userRecipe->id);
//    }
//    public function storeUserRecipe(Request $request): RedirectResponse
//    {
//        $recipeId = $request->input('recipeId');
//        $userRecipe = $this->recipeService->storeUserRecipe($recipeId, Auth::id());
//
//        return redirect()->route('recipes.show', $userRecipe->id);
//    }


//    public function storeUserRecipe(Request $request): RedirectResponse
//    {
//        $recipeId = $request->input('recipeId');
//        $response = $this->recipeService->storeUserRecipe($recipeId, Auth::id());
//
////        if (isset($response['status']) && $response['status'] === 'error') {
//        $data= $response->getData();
//        if (isset($data->status) && $data->status === 'error') {
//            // Przekierowanie z powrotem na stronę oryginalnego przepisu z komunikatem błędu
//            return redirect()->route('recipes.show', $recipeId)
//                ->with('error', $response['message']);
//        }
//
//        // W przypadku sukcesu przekieruj na stronę nowego przepisu
//        return redirect()->route('recipes.show', $response['recipe']->id);
//    }

//    public function showUserRecipes($userId) {
//        $currentUser = auth()->user();
//
//        // Sprawdź, czy zalogowany użytkownik jest administratorem lub właścicielem przepisów
//        if ($currentUser->id == $userId || $currentUser->isAdmin()) {
//            $recipes = $this->recipeService->getUserRecipes($userId);
//            return Inertia::render('UserRecipes', ['recipes' => $recipes]);
//        } else {
//            // Odpowiednia obsługa braku dostępu
//            abort(403, 'Brak dostępu');
//        }
//    }
