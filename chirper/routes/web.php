<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RecipeController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});




Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');



//Route::inertia('/recipes', 'Recipe/Index')->name('recipes.index');


//Route::get('/dashboard', [RecipeController::class, 'index'])
//    ->middleware(['auth', 'verified'])
//    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('recipes',RecipeController::class)
    ->only(['index','create','destroy', 'store', 'show']);

    Route::get('/recipe/{id}', [RecipeController::class, 'showRecipeFromApi'])->name('recipe.showRecipeFromApi');



    // Trasa dla wyszukiwania przepisów
    Route::post('/search', [RecipeController::class, 'handleSearch'])->name('recipes.handleSearch');

// Trasa wyświetlająca wyniki wyszukiwania
    Route::get('/search-results/{cacheKey}', [RecipeController::class, 'showSearchedRecipes'])->name('searched.recipes');

});

require __DIR__.'/auth.php';
