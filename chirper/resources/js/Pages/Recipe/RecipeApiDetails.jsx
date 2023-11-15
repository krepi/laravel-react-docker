// import React from 'react';
import {Head, Link} from "@inertiajs/react";
import styled from "styled-components";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DOMPurify from 'dompurify';
import React, {useState, useEffect} from 'react';
import IngredientListItem from "@/Components/Recipes/IngredientListItem.jsx";


const RecipeApiDetails = ({recipe, auth}) => {
    console.log(recipe)
    const [isLoading, setIsLoading] = useState(true);

    const formatRecipeForSaving = () => {
        return {
            title: recipe.title,
            ingredients: recipe.extendedIngredients.map(ingredient => ({
                name: ingredient.nameClean,
                quantity: ingredient.measures.metric.amount,
                unit: ingredient.measures.metric.unitLong
            })),
            instructions: recipe.instructions,
            ready_in_minutes: recipe.readyInMinutes,
            servings: recipe.servings,
            source: 'api'
        };
    };
    const repcia = formatRecipeForSaving();
    console.log(repcia)


    useEffect(() => {
        // Symulacja pobierania danych, ustaw isLoading na false, gdy dane są gotowe
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // Załóżmy, że ładowanie trwa 2 sekundy

        return () => clearTimeout(timer);
    }, []);

    const cleanInstructions = DOMPurify.sanitize(recipe.instructions);
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Recipe"/>
            {isLoading ? (
                <SpinnerContainer>

                    <Spinner>Loading...</Spinner>
                </SpinnerContainer>
            ) : (
                <DetailWrapper className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
                    <div>
                    <Link className=' text-white m-4 bg-green-500 py-2 px-6 rounded'
                          as='button'
                          // href={route('recipes.destroy', recipe.id)}
                          method="delete">Save</Link>
                    <Link className=' text-white m-4 bg-yellow-500 py-2 px-6 rounded'
                          as='button'
                          // href={route('recipes.destroy', recipe.id)}
                          method="delete">Like</Link>
                    </div>
                    <div>
                        <h2>{recipe.title}</h2>
                        <img src={recipe.image} alt={recipe.title}/>
                        <p>porcji: {recipe.servings}</p>
                        <p>gotowe w: {recipe.readyInMinutes} minut</p>
                    </div>
                    <Info>
                        <p dangerouslySetInnerHTML={{__html: cleanInstructions}}/>
                        <ul>
                            {/*{recipe.extendedIngredients.map((ingredient, index) => (*/}
                            {/*    // <li key={ingredient.id + '_' + index}>{ingredient.originalName}  {ingredient.measures.metric.amount} {  ingredient.measures.metric.unitLong === '' ? 'szt': ingredient.measures.metric.unitLong }</li>*/}
                            {/*    <li key={ingredient.id + '_' + index}>*/}
                            {/*        {ingredient.originalName.charAt(0).toUpperCase() + ingredient.originalName.slice(1)}*/}
                            {/*         {ingredient.measures.metric.amount}*/}
                            {/*        {ingredient.measures.metric.unitLong === ''*/}
                            {/*            ? 'szt'*/}
                            {/*            : ingredient.measures.metric.unitLong.toLowerCase()}*/}
                            {/*    </li>*/}

                            {/*))}*/}
                            <ul>
                                {recipe.extendedIngredients.map((ingredient, index) => (
                                    <IngredientListItem key={ingredient.id + '_' + index} ingredient={ingredient} />
                                ))}
                            </ul>
                        </ul>
                        {/* Wyświetl inne szczegóły przepisu */}
                    </Info>
                </DetailWrapper>)}
        </AuthenticatedLayout>
    );
};


const DetailWrapper = styled.div`
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
const Info = styled.div`
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
