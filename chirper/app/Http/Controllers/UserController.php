<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\RecipeService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use App\Services\UserService;
use Inertia\Inertia;

class UserController extends Controller
{
    protected UserService $userService;
    protected RecipeService $recipeService;

    public function __construct(UserService $userService, RecipeService $recipeService)
    {
        $this->userService = $userService;
        $this->recipeService = $recipeService;
    }


    public function showUserProfile($userId): \Inertia\Response
    {
        $currentUser = auth()->user();

        if (!$this->userService->isAuthorizedToViewProfile($currentUser, $userId)) {
            abort(403, 'Brak dostępu');
        }

        try {
            $userData = $this->userService->getUserWithRoleById($userId);
        } catch (ModelNotFoundException $e) {
            abort(404, $e->getMessage());
        }

        $recipes = $this->recipeService->getUserRecipes($userId);

        return Inertia::render('User/UserProfilePage', [
            'userProfile' => $userData,
            'roleName' => $userData->role ? $userData->role->name : null,
            'recipes' => $recipes,
        ]);
    }


}
