<?php

namespace App\Http\Controllers;

use App\Services\RecipeService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class AdminController extends Controller
{

    private UserService $userService;
    private RecipeService $recipeService;

    /**
     * @param UserService $userService
     */
    public function __construct(UserService $userService, RecipeService $recipeService)
    {
        $this->userService = $userService;
        $this->recipeService = $recipeService;
    }


    public function dashboard(Request $request) {
        $data = [
            'users' => $this->userService->getPaginatedUsers(),
            'recipes' => $this->recipeService->getPaginatedRecipes(),
        ];

        if ($request->has('only')) {
            return Inertia::render('AdminDashboard', $data)->only($request->input('only'));
        }

        return Inertia::render('AdminDashboard', $data);
    }



    public function deleteUser($userId)
    {
        $result = $this->userService->deleteUserAndRecipes($userId);

        if ($result['status'] === 'success') {
            return Redirect::back()->with('message', $result['message']);
        } else {
            return Redirect::back()->withErrors(['error' => $result['message']]);
        }
    }

}
