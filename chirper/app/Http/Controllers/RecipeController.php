<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use App\Services\TranslationService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
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
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use App\Services\RecipeService;
class RecipeController extends Controller
{

    private RecipeApiService $recipeApiService;
    private TranslationService $translationService;

    public function __construct(RecipeApiService $recipeApiService, TranslationService $translationService, RecipeService $recipeService)
    {
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
//            'recipes' => $this->getLocalRecipes(),
            'recipes' => $this->recipeService->getAllRecipes(),
            'apiRecipes' => $this->getApiRecipes(),
            'message'=> session('message')

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


//    public function store(Request $request)
//    {
//        Log::info('Store method called with request: ', $request->all());
//
//        $rules = [
//            'title' => 'required|max:250',
//            'ingredients' => 'required|json',
//            'instructions' => 'required|string',
//            'ready_in_minutes' => 'nullable|integer',
//            'servings' => 'nullable|integer',
//            'source' => 'required|in:spoon,user',
//            'id_from_api' => [
//                'nullable',
//                'integer',
//                Rule::unique('recipes')->where(function ($query) use ($request) {
//                    return $query->where('user_id', $request->user()->id);
//                })
//            ],
//        ];
//
//        // Dodaj warunkową walidację dla pola "image" w zależności od źródła
//        if ($request->input('source') === 'user') {
//            $rules['image'] = 'nullable|image|max:2048';
//        } elseif ($request->input('source') === 'spoon') {
//            $rules['image'] = 'nullable|string'; // Przyjmujemy, że URL jest wystarczający dla API
//        }
//
//        try {
//            $validatedData = $request->validate($rules);
//
//            if ($validatedData['source'] === 'user') {
//                unset($validatedData['id_from_api']); // Usuń, jeśli źródło to użytkownik
//            } elseif ($validatedData['source'] === 'spoon') {
//                $existingRecipe = Recipe::where('id_from_api', $validatedData['id_from_api'])
//                    ->where('user_id', auth()->id())
//                    ->first();
//
//                if ($existingRecipe) {
//                    // Przepis już istnieje w kolekcji użytkownika, możesz wyświetlić odpowiednią informację
//                    return redirect()->route('recipes.index')->with('message', 'Ten przepis już istnieje w Twojej kolekcji.');
//                }
//            }
//
//            $recipe = new Recipe($validatedData);
//            $recipe->user_id = auth()->id();
//
//            if ($validatedData['source'] === 'spoon') {
//                $recipe->id_from_api = $validatedData['id_from_api']; // Dodaj to pole do obiektu Recipe
//            }
//
//            Log::info('Recipe object before save: ', $recipe->toArray());
//
//            if ($request->hasFile('image')) {
//                $imageName = time() . '.' . $request->image->extension();
//                $request->image->move(public_path('images/recipes'), $imageName);
//                $recipe->image = '/images/recipes/' . $imageName;
//            }
//
//            $recipe->save();
//            Log::info('Recipe saved successfully with ID: ', ['id' => $recipe->id]);
//            return redirect()->route('recipes.index')->with('message', 'Przepis został pomyślnie zapisany.');
//        } catch (ValidationException $e) {
//            // Obsługa wyjątku ValidationException (np. zasada unique zostanie naruszona)
//
//            // Tutaj możesz ustawić odpowiednią wiadomość błędu, np.
//            $errorMessage = 'Ten przepis juz istnieje w Twojej kolekcji.';
//
//            // Możesz również zalogować szczegóły błędu
//            Log::error($e->getMessage());
//
//            // Następnie możesz przekierować użytkownika z odpowiednią wiadomością błędu
//            return redirect()->back()->with('message', $errorMessage);
//        }
//    }

    public function store(Request $request)
    {
        $result = $this->recipeService->storeRecipe($request);
//        dd($result['errors']);
//        if ($result['status'] === 'exists') {
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
                    'measures'=>[
                        'metric'=>[
                            'unitLong'=>'translateOne'
                        ]
                    ]                   // Tłumaczenie zagnieżdżonych pól
                ]
            ];
            return $this->translateRecipeFields($recipe, $translationMap);
        });

        return Inertia::render('Recipe/RecipeApiDetails', [
            'recipe' => $recipe,
            'message'=> session('message')
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
