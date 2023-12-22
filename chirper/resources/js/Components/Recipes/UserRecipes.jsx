import {Link} from "@inertiajs/react";
import React from "react";
import {Splide, SplideSlide} from "@splidejs/react-splide";
import styled from "styled-components";
import {InertiaLink} from "@inertiajs/inertia-react";


export default function UserRecipes({recipes, auth}) {

console.log(recipes)

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow rounded-lg p-4">
                <h2 className="text-2xl font-semibold">Twoje Przepisy</h2>
                <div className="mt-8">
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
                        gap: '20px',
                    }}>
                        {recipes &&
                            recipes.map(recipe => (
                                <SplideSlide key={recipe.id} className="mb-4">
                                    <Link key={recipe.id} href={route('recipes.show', recipe.id)}>
                                        <div className="relative h-64 rounded-xl overflow-hidden">
                                            <img src={recipe.image || '/images/recipes/placeholder.jpg'} alt="Recipe Image" className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black opacity-50"></div>
                                            <p className="relative z-10 text-white text-lg font-semibold text-center my-auto inset-0 flex items-center justify-center">{recipe.title}</p>
                                        </div>
                                    </Link>
                                </SplideSlide>
                            ))}
                    </Splide>
                </div>
            </div>
        </div>

        // <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        //
        //     <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg px-4 py-4">
        //         <h2>Twoje Przepisy</h2>
        //         <Wrapper>
        //             <Splide options={{
        //                 perPage: 3,
        //                 breakpoints: {
        //                     980: {
        //                         perPage: 2,
        //                     },
        //                     640: {
        //                         perPage: 1,
        //                     },
        //
        //                 },
        //                 arrows: false,
        //                 pagination: true,
        //                 drag: 'free',
        //                 gap: '5rem',
        //             }}>
        //
        //                 {recipes &&
        //                     recipes.map(recipe => (
        //
        //                         <SplideSlide key={recipe.id} className='mb-4 '>
        //                             <Link className=' '
        //                                   key={recipe.id}
        //                                   href={route('recipes.show', recipe.id)}
        //                             >
        //                             <Card>
        //                                 <p className='text-xxl'> {recipe.title}</p>
        //
        //                                 <img src={recipe.image || '/images/recipes/placeholder.jpg'}
        //                                      alt="Recipe Image"/>
        //                                 <Gradient/>
        //                             </Card>
        //                             </Link>
        //                         </SplideSlide>
        //                     ))}
        //             </Splide>
        //         </Wrapper>
        //     </div>
        // </div>
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
