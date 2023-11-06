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
            'number' => 5
        ]);

        if ($response->successful()) {
            return $response->json();
        }

        throw new \Exception('Nie udało się pobrać danych z API Spoonacular.' .  $response->body());
    }

    public function fetchRecipe($id)
    {
        $response = Http::get("https://api.spoonacular.com/recipes/{$id}/information", [
            'apiKey' => $this->apiKey,
        ]);
//dump($response);
        if ($response->successful()) {
            return $response->json();
        }

        throw new \Exception('Nie udało się pobrać danych z API Spoonacular.' . $response->body());
    }


}

