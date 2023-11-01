<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class RecipeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $recipes = Recipe::all();

        return Inertia::render('Recipe/Index', [
            'recipes' => $recipes
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

        return Redirect::route('recipe.index');
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
