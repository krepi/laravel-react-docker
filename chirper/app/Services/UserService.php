<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Exception;

class UserService
{


    public function getAllUsers(){

        return User::all();
    }
    public function getPaginatedUsers($perPage=10)
    {
        return User::paginate($perPage); // Przykładowa liczba użytkowników na stronę
    }




    public function deleteUserAndRecipes($userId) {
        try {
            DB::beginTransaction();

            $user = User::findOrFail($userId);
            if ($user->hasRole('admin')) {
                return ['status' => 'error', 'message' => 'Nie można usunąć konta administratora.'];
            }
            // Usuń przepisy użytkownika
            $user->recipes()->delete();

            // Usuń użytkownika
            $user->delete();

            DB::commit();
            return ['status' => 'success', 'message' => 'Użytkownik i jego przepisy zostały usunięte.'];
        } catch (Exception $e) {
            DB::rollBack();
            return ['status' => 'error', 'message' => 'Wystąpił błąd podczas usuwania użytkownika i jego przepisów.'];
        }
    }


    public function isAuthorizedToViewProfile($currentUser, $profileUserId): bool
    {
        return $currentUser->id == $profileUserId || $currentUser->isAdmin();
    }

    public function getUserWithRoleById($userId) {
        $user = User::with('role')->find($userId);
        if (!$user) {
            throw new ModelNotFoundException('Użytkownik nie został znaleziony.');
        }
        return $user;
    }



}
