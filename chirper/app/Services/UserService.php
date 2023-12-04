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


// UserService.php

    public function deleteUserAndRecipes($userId) {
        try {
            DB::beginTransaction();

            $user = User::findOrFail($userId);

            // Sprawdź, czy użytkownik jest administratorem
            if ($user->isAdmin()) {
                throw new \Exception('Nie można usunąć konta administratora.');
            }

            // Usuń przepisy użytkownika
            $user->recipes()->delete();

            // Usuń użytkownika
            $user->delete();

            DB::commit();
            return ['status' => 'success', 'message' => 'Użytkownik i jego przepisy zostały usunięte.'];
        } catch (Exception $e) {
            DB::rollBack();
            // Rzuć wyjątek, aby kontroler mógł go obsłużyć
            throw $e;
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
