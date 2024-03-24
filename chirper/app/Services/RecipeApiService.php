<?php

namespace App\Services;

use App\Services\RecipeService;
use Illuminate\Support\Facades\Http;

class RecipeApiService
{
    private $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.spoonacular.api_key');
    }


    public function fetchRecipes(): array
    {
        $response = Http::get("https://api.spoonacular.com/recipes/random", [
            'apiKey' => $this->apiKey,
            'number' => 12
        ]);

        if ($response->successful()) {
            return ['success' => true, 'data' => $response->json()];
        } else {
            // Zapewnienie, że klucz 'error' zawsze istnieje
            return ['success' => false, 'error' => $response->json()['message'] ?? 'Wystąpił błąd'];
        }

    }

    public function fetchRecipe($id)
    {

        $url = "https://api.spoonacular.com/recipes/{$id}/information?includeNutrition=true&apiKey=". $this->apiKey;
        $response= Http::get($url);
        if ($response->successful()) {
            return $response->json();
        }

        throw new \Exception('Nie udało się pobrać danych z API Spoonacular.' . $response->body());
    }


    public function searchRecipes(string $query): array
    {


        $url = "https://api.spoonacular.com/recipes/complexSearch?" . $query . "&number=12&addRecipeInformation=true&addRecipeNutrition=true&apiKey=" . $this->apiKey;

        // Wykonanie zapytania HTTP GET
        $response = Http::get($url);
        if ($response->successful()) {
            return $response->json()['results'];
        }

        throw new \Exception('Nie udało się pobrać danych z API Spoonacular.' .  $response->body());
    }



}

