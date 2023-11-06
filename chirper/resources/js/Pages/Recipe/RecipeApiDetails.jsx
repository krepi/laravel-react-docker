import React from 'react';
import {Head} from "@inertiajs/react";
import styled from "styled-components";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DOMPurify from 'dompurify';


const RecipeApiDetails = ({recipe, auth}) => {
    console.log(recipe)

    const cleanInstructions = DOMPurify.sanitize(recipe.instructions);
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Recipe"/>
            <DetailWrapper className= 'max-w-7xl mx-auto sm:px-6 lg:px-8'>
                    <div>
                        <h2>{recipe.title}</h2>
                        <img src={recipe.image} alt={recipe.title}/>
                    </div>
                <Info>
                    <p dangerouslySetInnerHTML={{__html: cleanInstructions}}/>
                    <ul>
                        {recipe.extendedIngredients.map((ingredient) => (
                            <li key={ingredient.id}>{ingredient.original}</li>
                        ))}
                    </ul>
                    {/* Wyświetl inne szczegóły przepisu */}
                </Info>
            </DetailWrapper>
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
export default RecipeApiDetails;
