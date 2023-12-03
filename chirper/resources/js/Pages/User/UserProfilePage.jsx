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


export default function UserProfilePage({auth, recipes, userProfile, roleName}) {
    console.log(recipes);
    console.log(userProfile);
    console.log(roleName);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Profile"/>
            <div className="py-12">
              <h1>user profile</h1>


            </div>
        </AuthenticatedLayout>
    );


}


