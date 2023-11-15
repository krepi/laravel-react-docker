import React from 'react';
import {InertiaLink} from '@inertiajs/inertia-react';
import {motion} from "framer-motion";
import {Head, Link} from "@inertiajs/react";
import styled from "styled-components";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const SearchedRecipes = ({auth,searchResults}) => {
    console.log(searchResults);
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Searched"/>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <h1>Wyniki wyszukiwania:</h1>
                <InertiaLink className='text-white m-4 bg-blue-600 py-2 px-6 rounded' as='button' href="/recipes">Back</InertiaLink>
                <Grid>

                    {searchResults.map((result, index) => (
                        <Card key={result.id}>
                            <Link href={`/recipe/${result.id}`}>
                                <img src={result.image} alt=""/>
                                <h4>{result.title}</h4>
                            </Link>
                        </Card>
                    ))}


                </Grid>
            </div>
        </AuthenticatedLayout>
    );
};

export default SearchedRecipes;


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

