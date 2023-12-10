<?php

namespace App\Services;

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
            'number' => 8
        ]);

        if ($response->successful()) {
            return $response->json();
        }

        throw new \Exception('Nie udało się pobrać danych z API Spoonacular.' .  $response->body());
    }

//    public function fetchRecipe($id)
//    {
//        $response = Http::get("https://api.spoonacular.com/recipes/{$id}/information", [
//            'apiKey' => $this->apiKey,
//        ]);
//        if ($response->successful()) {
//            return $response->json();
//        }
//
//        throw new \Exception('Nie udało się pobrać danych z API Spoonacular.' . $response->body());
//    }
    public function fetchRecipe($id)
    {
        $response = Http::get("https://api.spoonacular.com/recipes/{$id}/information", [
            'apiKey' => $this->apiKey,
        ]);

        if ($response->successful()) {
            return ['success' => true, 'data' => $response->json()];
        } else {
            // Zwróć informację o błędzie zamiast rzucać wyjątek
            return ['success' => false, 'error' => $response->json()['message']];
        }
    }

    public function searchRecipes(string $query): array
    {

//        $response = Http::get("https://api.spoonacular.com/recipes/complexSearch", [
//            'apiKey' => $this->apiKey,
//            'query' => $query,
//            'number' => 6
//
//        ]);
        $url = "https://api.spoonacular.com/recipes/complexSearch?" . $query . "&number=8&apiKey=" . $this->apiKey;

        // Wykonanie zapytania HTTP GET
        $response = Http::get($url);
        if ($response->successful()) {
            return $response->json()['results'];
        }

        throw new \Exception('Nie udało się pobrać danych z API Spoonacular.' .  $response->body());
    }



}

