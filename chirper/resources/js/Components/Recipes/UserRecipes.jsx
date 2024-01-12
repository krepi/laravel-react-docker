import {Link} from "@inertiajs/react";
import React from "react";
import {Splide, SplideSlide} from "@splidejs/react-splide";
import styled from "styled-components";
import {InertiaLink} from "@inertiajs/inertia-react";
import {LuVegan, LuWheatOff} from "react-icons/lu";
import {FaSave} from "react-icons/fa";


export default function UserRecipes({recipes, auth}) {

    console.log(recipes)


    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow rounded-lg p-4">
                <h2 className="text-2xl font-semibold">Twoja osobista księga smaków</h2>
                <p>Tutaj znajdziesz wszystkie przepisy, które zapisałeś, stworzyłeś, lub które chcesz wypróbować. Twoje
                    przepisy to kolekcja Twoich ulubionych smaków i kulinarnych osiągnięć. Organizuj, edytuj i dziel się
                    swoimi kulinarnymi odkryciami!</p>
                <div className="mt-8">
                    <Splide options={{
                        perPage: 4,
                        breakpoints: {
                            1536: {
                                perPage: 4,
                            },
                            1280: { // XLarge
                                perPage: 3,
                            },

                            768: { // Medium
                                perPage: 2,
                            },
                            640: { // Small
                                perPage: 1, // Jeden slajd na małych ekranach
                            },
                            // Dla XSmall nie trzeba dodawać, ponieważ 'perPage: 1' już to obsługuje
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
                                            <img src={recipe.image || '/images/recipes/placeholder.jpg'}
                                                 alt="Recipe Image"
                                                 className="absolute inset-0 w-full h-full object-cover"/>
                                            <div className="absolute inset-0 bg-black opacity-50"></div>
                                            <p className="absolute z-10 text-white text-lg font-semibold text-center w-full bottom-0 pb-4">{recipe.title}</p>
                                            {/*<p className="relative z-10 text-white text-lg font-semibold text-center my-auto inset-0 flex items-center justify-center">{recipe.title}</p>*/}
                                            <div className="absolute top-2 right-2 flex ">
                                                {recipe.diets && recipe.diets.includes('vegan') &&
                                                    <LuVegan size={36} className="text-green-500"/>}
                                                {recipe.diets && recipe.diets.includes('gluten free') &&
                                                    <LuWheatOff size={36} className="text-yellow-500"/>}
                                            </div>
                                        </div>
                                    </Link>
                                </SplideSlide>
                            ))}
                    </Splide>
                </div>
            </div>
        </div>
    )
};

