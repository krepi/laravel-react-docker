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
                                                // <InertiaLink className='text-red-600 hover:text-red-800'
                                                //       href={route('admin.users.delete', user.id)}
                                                //       method="delete">Delete</InertiaLink>
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
                                        // <AllUsersRecipes recipes={localRecipes} handlePagination={handlePagination} />
                                        // <AllUsersRecipes initialRecipes={recipes} />

                                    ))}
                                </div>)}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

{/*// <div className="mt-4">*/
}
{/*// <h1 className="text-xl font-semibold text-gray-700">Wyniki wyszukiwania:</h1>*/
}
{/*// <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">*/
}
{/*// {recipes.data.map((recipe) => (*/
}
// <div key={recipe.id} className="bg-white shadow-lg p-2 rounded-lg overflow-hidden">
// <Link href={`/recipe/${recipe.id}`}>
// <img src={recipe.image} alt={recipe.title}
// className = "w-full h-64 object-cover rounded-t-lg" / >
// <h4 className="text-center py-2">{recipe.title}</h4>
// </Link>
// </div>
// ))}
//

// </div>


// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// import {Head, Link} from '@inertiajs/react';
// import NavLink from "@/Components/common/NavLink.jsx";
// import Search from "@/Components/Recipes/Search.jsx";
// import {InertiaLink} from "@inertiajs/inertia-react";
// import React from "react";
// import styled from "styled-components";
//
//
// export default function Dashboard({auth, recipes, users}) {
//     console.log(users);
//     console.log(recipes);
//     return (
//         <AuthenticatedLayout user={auth.user}>
//             <Head title="Admin Dashboard"/>
//             <div className="py-12">
//                 <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//                     <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
//                         {/*<Search/>*/}
//                         <div>
//                             <h1>Dashboard Administratora</h1>
//                             <h2>Lista Użytkowników</h2>
//                             <table>
//                                 <thead>
//                                 <tr>
//                                     <th>ID</th>
//                                     <th>Nazwa</th>
//                                     <th>Email</th>
//                                     {/* Możesz dodać więcej kolumn, jeśli jest taka potrzeba */}
//                                 </tr>
//                                 </thead>
//                                 <tbody>
//                                 {users.data.map(user => (
//                                     <tr key={user.id}>
//                                         <td>{user.id}</td>
//                                         <td>{user.name}</td>
//                                         <td>{user.email}</td>
//                                         <td>{user.role_id}</td>
//                                         <td>
//                                             {user.role_id !== 4 &&
//                                                 <Link className=' text-white m-4 bg-red-600 py-2 px-6 rounded'
//                                                       as='button'
//                                                       href={route('admin.users.delete', user.id)}
//                                                       method="delete">Delete User</Link>
//                                             }
//                                             {/* Wyświetl dodatkowe informacje o użytkowniku, jeśli są dostępne */}
//                                         </td>
//                                         <td><InertiaLink className='text-white m-4 bg-blue-600 py-2 px-6 rounded'
//                                                          as='button'
//                                                          href={route('user.profile', user.id)}>Profile</InertiaLink>
//                                         </td>
//                                     </tr>
//                                 ))}
//                                 </tbody>
//                             </table>
//                             <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//                                 <h1>Wyniki wyszukiwania:</h1>
//                                 <InertiaLink className='text-white m-4 bg-blue-600 py-2 px-6 rounded' as='button'
//                                              href="/recipes">Back</InertiaLink>
//                                 <Grid>
//
//                                     {recipes.data.map((recipe, index) => (
//                                         <Card key={recipe.id}>
//                                             <Link className=' '
//                                                   key={recipe.id}
//                                                   href={route('recipes.show', recipe.id)}
//                                             >
//                                                 <img src={recipe.image} alt=""/>
//                                                 <h4>{recipe.title}</h4>
//                                             </Link>
//                                         </Card>
//                                     ))}
//                                     <div className="pagination flex justify-center items-center space-x-2">
//                                         {recipes.links.map((link, index) => (
//                                             <InertiaLink
//                                                 key={index}
//                                                 href={link.url}
//                                                 preserveScroll
//                                                 only={['recipes']}
//                                                 className={`px-4 py-2 border rounded ${link.active ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
//                                             >
//
//                                                     {link.label.replace(/&laquo;|&raquo;/g, '')} {/* Usuwa &laquo; i &raquo; */}
//
//                                             </InertiaLink>
//                                         ))}
//                                     </div>
//                                 </Grid>
//
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </AuthenticatedLayout>
//     );
// }
//
// const Grid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
//   grid-gap: 3rem;
// `;
//
// const Card = styled.div`
//   img {
//     width: 100%;
//     border-radius: 2rem;
//   }
//
//   a {
//     text-decoration: none;
//   }
//
//   h4 {
//     text-align: center;
//     padding: 1rem;
//   }
// `;
