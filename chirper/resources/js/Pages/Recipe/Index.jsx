import React, {useState} from "react";
import {Head, Link} from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import NavLink from "@/Components/NavLink.jsx";
import styled from "styled-components";
import {Splide, SplideSlide} from '@splidejs/react-splide'
import '@splidejs/splide/dist/css/splide.min.css'


export default function Index({auth, recipes, apiRecipes}) {
    console.log(apiRecipes);
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Recipes"/>
            <div className="py-12">

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <NavLink href={route('recipes.create')} active={route().current('recipes.create')}>
                        Create Recipes
                    </NavLink>
                </div>
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
                        <Wrapper>
                            <Splide options={{
                                perPage: 3,
                                    breakpoints: {
                                        980: {
                                            perPage: 2,
                                        },
                                    640: {
                                            perPage: 1,
                                        },

                                    },
                                arrows: true,
                                pagination: true,
                                drag: 'free',
                                gap: '5rem',
                            }}>
                                {apiRecipes &&
                                    apiRecipes.recipes.map(apiRecipe => (
                                        <SplideSlide key={apiRecipe.id} className='mb-4 '>
                                            <Card>
                                                <Link href={`/recipe/${apiRecipe.id}`}>
                                                    <p className='text-xl'>
                                                        {apiRecipe.title}
                                                    </p>
                                                    <img src={apiRecipe.image} alt=""/>
                                                    <Gradient/>
                                                </Link>
                                            </Card>
                                        </SplideSlide>
                                    ))}
                            </Splide>
                        </Wrapper>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );


}

const Wrapper = styled.div`
    margin: 4rem 0rem;
`;
const Card = styled.div`
    min-height: 25rem;
    border-radius: 2rem;
    overflow: hidden;
    position: relative;

    img {
        border-radius: 2rem;
        position: absolute;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    p {
        position: absolute;
        z-index: 10;
        left: 50%;
        bottom: 0%;
        transform: translate(-50%, 0%);
        color: #fff;
        width: 100%;
        text-align: center;
        font-weight: 600;
        font-size: 1.5rem;
        height: 40%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;
const Gradient = styled.div`
    z-index: 3;
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));

`;
