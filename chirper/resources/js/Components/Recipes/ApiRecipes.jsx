import {Splide, SplideSlide} from "@splidejs/react-splide";
import {Link} from "@inertiajs/react";
import React from "react";
import styled from "styled-components";


export default function ApiRecipes({apiRecipes}) {
    return (
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
                        arrows: false,
                        pagination: true,
                        drag: 'free',
                        gap: '5rem',
                    }}>
                        {apiRecipes &&
                            apiRecipes.map(apiRecipe => (
                                <SplideSlide key={apiRecipe.id} className='mb-4 '>
                                    <Card>
                                        <Link href={`/recipe/${apiRecipe.id}`}>
                                            <p className='text-xl'>
                                                {apiRecipe.title}
                                            </p>
                                            <img src={apiRecipe.image || '/images/recipes/placeholder.jpg'} alt=""/>
                                            <Gradient/>
                                        </Link>
                                    </Card>
                                </SplideSlide>
                            ))}
                    </Splide>
                </Wrapper>
            </div>
        </div>
    )
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
