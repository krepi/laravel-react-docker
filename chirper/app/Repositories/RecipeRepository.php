<?php

namespace App\Repositories;

use App\Models\Recipe;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
class RecipeRepository
{
    public function getAllRecipes(): Collection
    {
        return Recipe::all();
    }

    public function getPaginatedRecipes($perPage = 10): LengthAwarePaginator
    {
        return Recipe::paginate($perPage);
    }

    public function getUserRecipes($userId, $perPage = 10): LengthAwarePaginator
    {
        return Recipe::where('user_id', $userId)->paginate($perPage);
    }
    public function findById($id): Recipe
    {
        return Recipe::findOrFail($id);
    }

    public function existsForUser($userId, $idFromApi): bool
    {
        return Recipe::where('user_id', $userId)
            ->where('id_from_api', $idFromApi)
            ->exists();
    }
    public function createRecipe(array $data): Recipe
    {
        $recipe = new Recipe($data);
        $recipe->save();
        return $recipe;
    }
    public function save(Recipe $recipe): Recipe
    {
        $recipe->save();
        return $recipe;
    }
    public function update(Recipe $recipe, array $data): Recipe
    {
        $recipe->fill($data);
        $recipe->save();
        return $recipe;
    }

    public function delete(Recipe $recipe): void
    {
        $recipe->delete();
    }
}
