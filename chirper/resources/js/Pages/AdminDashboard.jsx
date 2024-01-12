import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link} from '@inertiajs/react';
import {InertiaLink} from "@inertiajs/inertia-react";
import React, {useState} from "react";
import AllUsersRecipes from "@/Components/Recipes/AllUsersRecipes.jsx";

export default function Dashboard({auth, recipes, users}) {
    const [showRecipes, setShowRecipes] = useState(false); // stan do kontrolowania wyświetlania przepisów

    console.log(recipes)
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Admin Dashboard"/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h1 className="text-2xl font-semibold text-gray-800">Dashboard Administratora</h1>
                        <h2 className="text-xl font-semibold text-gray-700 mt-4 mb-2">Lista Użytkowników</h2>

                        {/* Tabela użytkowników */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nazwa</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcje</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {users.data.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {user.role_id !== 4 &&

                                                <InertiaLink as="button"
                                                             onClick={() => {
                                                                 if (confirm('Are you sure you want to delete this user?')) {
                                                                     Inertia.delete(route('admin.users.delete', user.id));
                                                                 }
                                                             }}
                                                             className="text-red-600 hover:text-red-800 px-4 py-2 rounded focus:outline-none focus:shadow-outline"
                                                >
                                                    Delete
                                                </InertiaLink>


                                            }
                                            <InertiaLink className='text-blue-600 hover:text-blue-800 ml-4'
                                                         href={route('user.profile', user.id)}>Profile</InertiaLink>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div>
                            <button
                                onClick={() => setShowRecipes(!showRecipes)}
                                className="mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline"
                            >
                                {showRecipes ? 'Ukryj przepisy' : 'Pokaż wszystkie przepisy'}
                            </button>

                            {/* Sekcja wyników wyszukiwania */}
                            {showRecipes && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                    {recipes.data.map((recipe) => (
                                        <div key={recipe.id}
                                             className="bg-white shadow-lg p-2 rounded-lg overflow-hidden">
                                            <Link href={`/recipe/${recipe.id}`}>
                                                <img src={recipe.image} alt={recipe.title}
                                                     className="w-full h-64 object-cover rounded-t-lg"/>
                                                <h4 className="text-center py-2">{recipe.title}</h4>
                                            </Link>
                                        </div>

                                    ))}
                                </div>)}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


