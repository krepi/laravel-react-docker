import {Link} from "@inertiajs/react";
import React from "react";


export default function UserRecipes(recipes){

    return (
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
    );


}
