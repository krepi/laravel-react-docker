<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Http;

class RecipeController extends Controller
{

//    public function fetchRecipes()
//    {
////        $response = Http::get("https://api.spoonacular.com/recipes/random?number=8", [
////            'apiKey' => '822eeba2ab9b4315b3009deebe565d22'
////        ]);
//        $response = Http::get("https://api.spoonacular.com/recipes/random?apiKey=822eeba2ab9b4315b3009deebe565d22&number=8"
//        );
//
//        if ($response->successful()) {
//            return $response->json();
//        } else {
//            // Obsłuż błędy, np. rzucenie wyjątku
//            throw new \Exception('Nie udało się pobrać danych z API Spoonacular.');
//        }
//    }

    public function fetchRecipes()
    {
        // Your existing code to fetch recipes
        $response = Http::get("https://api.spoonacular.com/recipes/random?apiKey=822eeba2ab9b4315b3009deebe565d22&number=8");

        if ($response->successful()) {
            $recipes = $response->json();

            // Extract titles from the recipes
            $titles_to_translate = array_column($recipes['recipes'], 'title');

            // Call your translation method
            $translated_titles = $this->translateTitles($titles_to_translate);

            // Combine the translated titles back with the recipe data
            foreach ($recipes['recipes'] as $index => $recipe) {
                $recipes['recipes'][$index]['title'] = $translated_titles[$index] ?? $recipe['title'];
            }

            return $recipes;
        } else {
            // Handle errors
            throw new \Exception('Failed to fetch data from Spoonacular API.');
        }
    }

// You would add a new method in your controller for translation
    public function translateTitles($titles)
    {
        // Your Azure Translator API key and endpoint
        $translator_api_key = '49a77462d1294109bc4e2e4f450f2ff6';
        $translator_endpoint = 'https://api.cognitive.microsofttranslator.com/';

        // Prepare the text for translation
        $body = [];
        foreach ($titles as $title) {
            $body[] = ['Text' => $title];
        }

        // Make the POST request to the Microsoft Translator API
        $translator_response = Http::withHeaders([
            'Ocp-Apim-Subscription-Key' => $translator_api_key,
            'Content-Type' => 'application/json',
            'Ocp-Apim-Subscription-Region' => 'global', // e.g., 'westeurope'
        ])->post($translator_endpoint . '/translate?api-version=3.0&to=pl', $body);

        // Check for success and extract translated text
    {
        // ... (previous code for setting up the translation request)

        if ($translator_response->successful()) {
            $translationResults = $translator_response->json();
            $translated_titles = [];

            foreach ($translationResults as $translationResult) {
                // Check if the translations key exists and has at least one element
                if (isset($translationResult['translations']) && is_array($translationResult['translations']) && isset($translationResult['translations'][0])) {
                    $translated_titles[] = $translationResult['translations'][0]['text'];
                } else {
                    // If the translations key does not exist or does not have at least one element, use the original title
                    // Assuming you are keeping track of the original titles with $original_titles
                    $translated_titles[] = array_shift($titles); // or use a default placeholder text
                }
            }

            return $translated_titles;
        } else {
            // Handle errors
            throw new \Exception('Failed to translate titles.');
        }
    }

    }


    /**
     * Display a listing of the resource.
     */
    public function index() :Response
    {
        $recipes = Recipe::all();

        $apiRecipes = $this->fetchRecipes();

        return Inertia::render('Recipe/Index', [
            'recipes' => $recipes,
            'apiRecipes' => $apiRecipes
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
    public function show(Recipe $recipe)
    {
        return Inertia::render('Recipe/Show', ['recipe' => $recipe]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Recipe $recipe)
    {
        return Inertia::render('Recipe/Edit', ['recipe' => $recipe]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Recipe $recipe)
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
    public function destroy(Recipe $recipe)
    {
        $recipe->delete();
        return Redirect::back();
    }
}
