// import React from 'react';
import {Head, usePage} from "@inertiajs/react";
import styled from "styled-components";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DOMPurify from 'dompurify';
import React, {useState, useEffect} from 'react';
import {Link} from "@inertiajs/react";
import {InertiaLink} from "@inertiajs/inertia-react";
import IngredientListItem from "@/Components/Recipes/IngredientListItem.jsx";
import {Inertia} from "@inertiajs/inertia";


const RecipeApiDetails = ({recipe, auth}) => {
    const { flash } = usePage().props;
    console.log(flash)
    console.log(recipe)
    const ingredients = JSON.parse(recipe.ingredients);
    const cleanInstructions = DOMPurify.sanitize(recipe.instructions);
    const saveRecipeAsUser = () => {
        Inertia.post(route('recipes.storeUserRecipe'), {recipeId: recipe.id});

    };
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Recipe"/>
            {flash?.success && <div className="alert alert-success">{flash.success}</div>}
            {flash?.error && <div className="alert alert-danger">{flash.error}</div>}

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow mt-4">
                    <InertiaLink className='text-white bg-blue-600 hover:bg-blue-700 py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                                 as='button'
                                 href="/recipes">Back</InertiaLink>

                    {(recipe.user_id === auth.user.id || auth.user.role_id === 4) ? (
                        <div className="flex space-x-4">
                            <Link className='text-white bg-red-600 hover:bg-red-700 py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
                                  as='button'
                                  href={route('recipes.destroy', recipe.id)}
                                  method="delete">Delete</Link>

                            <Link className='text-white bg-blue-300 hover:bg-blue-400 py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50'
                                  as='button'
                                  href={route('recipes.edit', recipe.id)}>Update</Link>
                        </div>
                    ) : (
                        <button className='text-white bg-green-300 hover:bg-green-400 py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50' onClick={saveRecipeAsUser}>
                            Zapisz jako mój przepis
                        </button>
                    )}
                </div>

                <div className="my-8">
                    <h2 className="text-2xl font-bold mb-4">{recipe.title}</h2>
                    <img src={recipe.image} alt={recipe.title} className="rounded-lg shadow-md"/>
                    <p className="mt-2 text-lg">Porcji: {recipe.servings}</p>
                    <p className="text-lg">Gotowe w: {recipe.ready_in_minutes} minut</p>
                </div>

                <div className="mb-8 p-4 bg-white rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-3">Instrukcje:</h3>
                    <p dangerouslySetInnerHTML={{__html: cleanInstructions}} className="text-gray-700"></p>
                </div>

                {/* Sekcja składników */}
                <div className="mb-8 p-4 bg-white rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-3">Składniki:</h3>
                    <ul className="list-disc list-inside">
                        {ingredients.map((ingredient, index) => (
                            <IngredientListItem key={ingredient.id + '_' + index} ingredient={ingredient} source={'user'}/>
                        ))}
                    </ul>
                </div>
            </div>
        </AuthenticatedLayout>


        // <AuthenticatedLayout user={auth.user}>
        //     <Head title="Recipe"/>
        //     {flash?.success && <div className="alert alert-success">{flash.success}</div>}
        //     {flash?.error && <div className="alert alert-danger">{flash.error}</div>}
        //
        //     {/*<DetailWrapper className='max-w-7xl mx-auto sm:px-6 lg:px-8'>*/}
        //         <div>
        //
        //             <InertiaLink className='text-white m-4 bg-blue-600 py-2 px-6 rounded' as='button'
        //                          href="/recipes">Back</InertiaLink>
        //         </div>
        //         {(recipe.user_id === auth.user.id || auth.user.role_id === 4) ?
        //             <div>
        //                 <Link className=' text-white m-4 bg-red-600 py-2 px-6 rounded'
        //                       as='button'
        //                       href={route('recipes.destroy', recipe.id)}
        //                       method="delete">Delete</Link>
        //
        //                 <Link className=' text-white m-4 bg-blue-300 py-2 px-6 rounded'
        //                       as='button'
        //                       href={route('recipes.edit', recipe.id)}
        //
        //                 >Update</Link>
        //             </div>
        //             : <div>
        //                 <button className=' text-white m-4 bg-green-300 py-2 px-6 rounded' onClick={saveRecipeAsUser}>Zapisz jako mój przepis</button>
        //             </div>
        //         }
        //         <div>
        //             <h2>{recipe.title}</h2>
        //             <img src={recipe.image} alt={recipe.title}/>
        //             <p>porcji: {recipe.servings}</p>
        //             <p>gotowe w: {recipe.ready_in_minutes} minut</p>
        //         </div>
        //         <div>
        //             <p dangerouslySetInnerHTML={{__html: cleanInstructions}}/>
        //             <ul>
        //                 {ingredients.map((ingredient, index) => (
        //                     // <li key={ingredient.name + '_' + index}>{ingredient.name} {ingredient.quantity} {ingredient.unit}</li>
        //                     <IngredientListItem key={ingredient.id + '_' + index} ingredient={ingredient}
        //                                         source={'user'}/>
        //                 ))}
        //             </ul>
        //         </div>
        //     {/*</DetailWrapper>)*/}
        // </AuthenticatedLayout>
    );
};




export default RecipeApiDetails;
