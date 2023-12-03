import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link} from '@inertiajs/react';
import NavLink from "@/Components/common/NavLink.jsx";
import Search from "@/Components/Recipes/Search.jsx";
import {InertiaLink} from "@inertiajs/inertia-react";
import React from "react";
import styled from "styled-components";


export default function Dashboard({auth, recipes, users}) {
    console.log(users);
    console.log(recipes);
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Admin Dashboard"/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <Search/>
                        <div>
                            <h1>Dashboard Administratora</h1>
                            <h2>Lista Użytkowników</h2>
                            <table>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nazwa</th>
                                    <th>Email</th>
                                    {/* Możesz dodać więcej kolumn, jeśli jest taka potrzeba */}
                                </tr>
                                </thead>
                                <tbody>
                                {users.data.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role_id}</td>
                                        <td>
                                            {user.role_id !== 4 &&
                                                <Link className=' text-white m-4 bg-red-600 py-2 px-6 rounded'
                                                      as='button'
                                                      href={route('admin.users.delete', user.id)}
                                                      method="delete">Delete User</Link>
                                            }
                                            {/* Wyświetl dodatkowe informacje o użytkowniku, jeśli są dostępne */}
                                        </td>
                                        <td> <InertiaLink className='text-white m-4 bg-blue-600 py-2 px-6 rounded' as='button'
                                                          href={route('user.profile',user.id)}>Profile</InertiaLink></td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                                <h1>Wyniki wyszukiwania:</h1>
                                <InertiaLink className='text-white m-4 bg-blue-600 py-2 px-6 rounded' as='button'
                                             href="/recipes">Back</InertiaLink>
                                <Grid>

                                    {recipes.data.map((recipe, index) => (
                                        <Card key={recipe.id}>
                                            <Link className=' '
                                                  key={recipe.id}
                                                  href={route('recipes.show', recipe.id)}
                                            >
                                                <img src={recipe.image} alt=""/>
                                                <h4>{recipe.title}</h4>
                                            </Link>
                                        </Card>
                                    ))}
                                    <div className="pagination flex justify-center items-center space-x-2">
                                        {recipes.links.map((link, index) => (
                                            <InertiaLink
                                                key={index}
                                                href={link.url}
                                                preserveScroll
                                                only={['recipes']}
                                                className={`px-4 py-2 border rounded ${link.active ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                                            >
                                                {link.label.replace(/&laquo;|&raquo;/g, '')} {/* Usuwa &laquo; i &raquo; */}
                                            </InertiaLink>
                                        ))}
                                    </div>
                                </Grid>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
    grid-gap: 3rem;
`;

const Card = styled.div`
    img {
        width: 100%;
        border-radius: 2rem;
    }

    a {
        text-decoration: none;
    }

    h4 {
        text-align: center;
        padding: 1rem;
    }
`;
