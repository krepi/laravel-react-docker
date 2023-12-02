<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        // Tutaj możesz umieścić logikę do pobrania danych dla dashboardu admina
        return Inertia::render('AdminDashboard');
    }
}
