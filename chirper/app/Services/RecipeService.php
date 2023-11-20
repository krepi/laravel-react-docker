<?php

namespace App\Services;

use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class RecipeService {

    public function getAllRecipes() {
        return Recipe::all();
    }

    public function storeRecipe(Request $request) {
        $rules = $this->getValidationRules($request);

        try {
            $validatedData = $request->validate($rules);
            $recipe = $this->createRecipe($validatedData, $request);

            return ['status' => 'success', 'recipe' => $recipe, 'message' => 'Przepis został pomyślnie zapisany.'];

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Zwróć błędy walidacji
            return ['status' => 'validation_error', 'errors' => $e->errors()];

        }
    }
    public function updateRecipe(Recipe $recipe, Request $request) {
        $validatedData = $request->validate([
            'title' => ['required', 'max:250'],
            'body' => ['required']
        ]);

        $recipe->update($validatedData);
        return $recipe;
    }

    public function deleteRecipe(Recipe $recipe) {
        $recipe->delete();
        return ['status' => 'deleted'];
    }

    protected function getValidationRules(Request $request) {
        $rules = [
            'title' => 'required|max:250',
            'ingredients' => 'required|json',
            'instructions' => 'required|string',
            'ready_in_minutes' => 'nullable|integer',
            'servings' => 'nullable|integer',
            'source' => 'required|in:spoon,user',
            'id_from_api' => [
                'nullable',
                'integer',
                Rule::unique('recipes')->where(function ($query) use ($request) {
                    return $query->where('user_id', Auth::id());
                })
            ],
        ];

        if ($request->input('source') === 'user') {
            $rules['image'] = 'nullable|image|max:2048';
        } elseif ($request->input('source') === 'spoon') {
            $rules['image'] = 'nullable|string';
        }

        return $rules;
    }

    protected function recipeExists($validatedData) {
        return Recipe::where('id_from_api', $validatedData['id_from_api'])
            ->where('user_id', Auth::id())
            ->exists();
    }

    protected function createRecipe($validatedData, $request) {
        $recipe = new Recipe($validatedData);
        $recipe->user_id = Auth::id();

        if ($validatedData['source'] === 'spoon') {
            $recipe->id_from_api = $validatedData['id_from_api']; // Dodaj pole id_from_api do obiektu Recipe
        }

        if ($request->hasFile('image')) {
            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('images/recipes'), $imageName);
            $recipe->image = '/images/recipes/' . $imageName;
        }

        $recipe->save();
        return $recipe;
    }

    // Dodatkowe metody do zarządzania przepisami z zewnętrznego API, tłumaczenia itp.
}

