import React, {useState} from "react";
import {Head, Link, usePage} from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import NavLink from "@/Components/common/NavLink.jsx";
import styled from "styled-components";
import {Splide, SplideSlide} from '@splidejs/react-splide'
import '@splidejs/splide/dist/css/splide.min.css'
import ApiRecipes from "@/Components/Recipes/ApiRecipes.jsx";
import Search from "@/Components/Recipes/Search.jsx";
import UserRecipes from "@/Components/Recipes/UserRecipes.jsx";


export default function Index({auth, recipes, apiRecipes, message,error }) {

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Recipes"/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {message && (
                        <div className="alert alert-info">
                            {message}
                        </div>
                    )}


                </div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Search/>
                    <ApiRecipes apiRecipes={apiRecipes} error={error}/>
                    <ApiRecipes apiRecipes={apiRecipes} externalMessage="Początkowy komunikat"/>
                    {/*<UserRecipes recipes={recipes} auth={auth} />*/}
                </div>

            </div>
        </AuthenticatedLayout>
    );


}


