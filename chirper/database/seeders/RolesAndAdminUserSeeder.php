<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;

class RolesAndAdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::create(['name' => 'admin']);
        $userRole = Role::create(['name' => 'user']);

        User::create([
            'name' => 'Admin Krepi',
            'email' => 'admin@krepi.com',
            'password' => bcrypt('adminkrepi'),
            'role_id' => $adminRole->id
        ]);
    }
}
