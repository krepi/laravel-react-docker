import {Link} from "@inertiajs/react";
import React from "react";
import {Splide, SplideSlide} from "@splidejs/react-splide";
import styled from "styled-components";


export default function UserRecipes({recipes, auth}) {
    // if( recipes){
    // const ingredientsArray = JSON.parse(recipes[0].ingredients);
    //
    // console.log(ingredientsArray[0].name+ ' ' + ingredientsArray[0].quantity + ingredientsArray[0].unit); // Powinno wyświetlić "kapusta"
    // }
console.log(recipes)

    return (
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <h2>Twoje Przepisy</h2>
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
                        arrows: false,
                        pagination: true,
                        drag: 'free',
                        gap: '5rem',
                    }}>
                        {recipes &&
                            recipes.map(recipe => (

                                <SplideSlide key={recipe.id} className='mb-4 '>
                                    <Card>
                                        <p className='text-xxl'> {recipe.title}</p>
                                        {/*<p>{recipe.user_id}</p>*/}
                                        <img src={recipe.image || '/images/recipes/placeholder.jpg'}
                                             alt="Recipe Image"/>
                                        {/*{recipe.user_id === auth.user.id &&*/}
                                        {/*    <Link className=' text-white m-4 bg-red-600 py-2 px-6 rounded'*/}
                                        {/*          as='button'*/}
                                        {/*          href={route('recipes.destroy', recipe.id)}*/}
                                        {/*          method="delete">Delete</Link>*/}
                                        {/*}*/}
                                        <Gradient/>
                                    </Card>
                                </SplideSlide>
                            ))}
                    </Splide>
                </Wrapper>
            </div>
        </div>
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
