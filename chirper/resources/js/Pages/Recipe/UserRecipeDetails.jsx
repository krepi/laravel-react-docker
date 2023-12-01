// import React from 'react';
import {Head} from "@inertiajs/react";
import styled from "styled-components";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DOMPurify from 'dompurify';
import React, {useState, useEffect} from 'react';
import {Link} from "@inertiajs/react";
import {InertiaLink} from "@inertiajs/inertia-react";
import IngredientListItem from "@/Components/Recipes/IngredientListItem.jsx";


const RecipeApiDetails = ({recipe, auth}) => {
    console.log(recipe)
    const ingredients = JSON.parse(recipe.ingredients);
    const cleanInstructions = DOMPurify.sanitize(recipe.instructions);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Recipe"/>

                <DetailWrapper className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
                    <div>

                        <InertiaLink className='text-white m-4 bg-blue-600 py-2 px-6 rounded' as='button' href="/recipes">Back</InertiaLink>
                    </div>
                    {recipe.user_id === auth.user.id &&
                        <div>
                            <Link className=' text-white m-4 bg-red-600 py-2 px-6 rounded'
                                  as='button'
                                  href={route('recipes.destroy', recipe.id)}
                                  method="delete">Delete</Link>

                            <Link className=' text-white m-4 bg-blue-300 py-2 px-6 rounded'
                                  as='button'
                                href={route('recipes.edit', recipe.id)}
                                  // method="update"
                            >Update</Link>
                        </div>
                    }
                    <div>
                        <h2>{recipe.title}</h2>
                        <img src={recipe.image} alt={recipe.title}/>
                        <p>porcji: {recipe.servings}</p>
                        <p>gotowe w: {recipe.ready_in_minutes} minut</p>
                    </div>
                    <Info>
                        <p dangerouslySetInnerHTML={{__html: cleanInstructions}}/>
                        <ul>
                            {ingredients.map((ingredient, index) => (
                                // <li key={ingredient.name + '_' + index}>{ingredient.name} {ingredient.quantity} {ingredient.unit}</li>
                                <IngredientListItem key={ingredient.id + '_' + index} ingredient={ingredient} source={'user'} />
                            ))}
                        </ul>
                    </Info>
                </DetailWrapper>)
        </AuthenticatedLayout>
    );
};


export const DetailWrapper = styled.div`
    margin: 0 auto;
    margin-top: 10rem;
    margin-bottom: 5rem;
    display: flex;
    flex-direction: column;

    .active {
        background: linear-gradient(35deg, #494949, #313131);
        color: #fff;
    }

    h2 {
        margin-bottom: 2rem;
    }

    li {
        font-size: 1.2rem;
        line-height: 2.5rem;
    }

    ul {
        margin-top: 2rem;
    }
`;
export const Info = styled.div`
    margin-left: 10rem;
`;
const SpinnerContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; // 100% wysokości widoku, aby centrować na środku ekranu
`;
const Spinner = styled.div`
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: #09f;
    animation: spin 1s ease infinite;


    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;
export default RecipeApiDetails;
