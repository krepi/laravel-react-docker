<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class RecipeApiService
{
    private $apiKey;

    public function __construct(string $apiKey)
    {
        $this->apiKey = $apiKey;
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

        throw new \Exception('Nie udało się pobrać danych z API Spoonacular.');
    }
}

