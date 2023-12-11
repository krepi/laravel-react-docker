import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head} from '@inertiajs/react';
import NavLink from "@/Components/common/NavLink.jsx";
import Search from "@/Components/Recipes/Search.jsx";
import React from "react";


export default function Dashboard({auth, recipes, apiRecipes}) {
    console.log(auth.user)
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard"/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {auth.user.role_id === 4 &&
                        <NavLink href={route('admin.dashboard')} active={route().current('admin.dashboard')}>
                            Admin daszboard
                        </NavLink>
                        }
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
