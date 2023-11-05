import React, {useState} from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link} from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {useForm, usePage} from '@inertiajs/react';

export default function Index({auth, recipes, apiRecipes}) {
    console.log(apiRecipes);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Recipes</h2>}
        >
            <Head title="Recipes"/>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h2>Twoje Przepisy</h2>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg px-4 py-4">
                        {recipes &&
                            recipes.map(recipe => (
                                <div key={recipe.id} className='mb-4 '>
                                    <h3 className='text-xl'> Recipe: {recipe.title}</h3>
                                    <p>{recipe.body}</p>
                                    <p>{recipe.user_id}</p>
                                    {recipe.user_id === auth.user.id &&
                                        <Link className=' text-white m-4 bg-red-600 py-2 px-6 rounded'
                                              as='button'
                                              href={route('recipes.destroy', recipe.id)}
                                              method="delete">Delete</Link>
                                    }
                                </div>
                            ))}
                    </div>
                </div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h2>Przepisy z API</h2>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg px-4 py-4">
                        {apiRecipes &&
                            apiRecipes.recipes.map(apiRecipe => (
                                <div key={apiRecipe.id} className='mb-4 '>
                                    <h3 className='text-xl'> Recipe: {apiRecipe.title}</h3>
                                    <img src={apiRecipe.image} alt=""/>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
