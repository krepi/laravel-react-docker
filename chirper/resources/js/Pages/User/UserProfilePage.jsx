import React, {useState} from "react";
import {Head, Link, usePage} from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import styled from "styled-components";
import '@splidejs/splide/dist/css/splide.min.css'


export default function UserProfilePage({auth, recipes, userProfile, roleName}) {
    console.log(recipes);
    console.log(userProfile);
    console.log(roleName);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Profile"/>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="py-12">
                    <h1>user profile</h1>
                    <h2>Hello {userProfile.name}</h2>

                </div>
                <Grid>

                    {recipes.map((recipe, index) => (
                        <Card key={recipe.id}>
                            <Link className=' '
                                  key={recipe.id}
                                  href={route('recipes.show', recipe.id)}
                            >
                                <img src={recipe.image} alt=""/>
                                <h4>{recipe.title}</h4>
                            </Link>
                        </Card>
                    ))}

                </Grid>
            </div>
        </AuthenticatedLayout>
    );


}

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
    grid-gap: 3rem;
`;

const Card = styled.div`
    img {
        width: 100%;
        border-radius: 2rem;
    }

    a {
        text-decoration: none;
    }

    h4 {
        text-align: center;
        padding: 1rem;
    }
`;
