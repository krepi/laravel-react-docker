import React, {useState} from "react";
import {Head, Link} from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import NavLink from "@/Components/common/NavLink.jsx";
import styled from "styled-components";
import {Splide, SplideSlide} from '@splidejs/react-splide'
import '@splidejs/splide/dist/css/splide.min.css'
import ApiRecipes from "@/Components/Recipes/ApiRecipes.jsx";
import Search from "@/Components/Recipes/Search.jsx";
import UserRecipes from "@/Components/Recipes/UserRecipes.jsx";


export default function Index({auth, recipes, apiRecipes, }) {
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
                <Search/>
                <ApiRecipes apiRecipes={apiRecipes}/>
                <UserRecipes recipes={recipes} auth={auth} />
                </div>

            </div>
        </AuthenticatedLayout>
    );


}


