import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head} from '@inertiajs/react';
import NavLink from "@/Components/common/NavLink.jsx";
import Search from "@/Components/Recipes/Search.jsx";
import React, {useState} from "react";
import UserRecipes from "@/Components/Recipes/UserRecipes.jsx";
import {InertiaLink} from "@inertiajs/inertia-react";


export default function Dashboard({auth, recipes, apiRecipes}) {
    console.log(auth.user)
    const [showSearch, setShowSearch] = useState(false);
    const [showUserRecipes, setShowUserRecipes] = useState(false);

    const handleSearchClick = () => {
        setShowSearch((prevSearch=> !prevSearch)); // Toggle visibility of the search component
    };
    const handleSearchUserRecipesClick = () => {
        setShowUserRecipes((prevUserRecipes=> !prevUserRecipes)); // Toggle visibility of the search component
    };

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
                    <div className="flex">
                        {/* Main content */}


                        {/* Right-side menu */}
                        <div className="w-1/4 bg-gray-200 h-screen p-4 flex flex-col gap-4">
                            {/* Add more menu items as needed */}
                            <button onClick={handleSearchClick} className="bg-blue-500 text-white p-2 rounded">Search Recipe</button>
                            <button onClick={handleSearchUserRecipesClick} className="bg-blue-500 text-white p-2 rounded">User Recipes</button>
                            <InertiaLink className='text-white m-4 bg-blue-500 py-2 px-6 rounded' as='button'
                                         href={route('user.profile',auth.user.id)}>Twój profil</InertiaLink>
                        </div>
                        <div className="flex-grow">
                            {showSearch && <Search />}
                            {showUserRecipes && <UserRecipes recipes={recipes}/>}
                        </div>
                    </div>
                    {/* Conditionally render the Search component */}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
