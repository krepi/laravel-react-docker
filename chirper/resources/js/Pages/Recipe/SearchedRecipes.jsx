
import React from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FaSave  } from "react-icons/fa";
import { LuVegan } from "react-icons/lu";

const SearchedRecipes = ({ auth, searchResults }) => {
    console.log(searchResults)
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Searched" />
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold my-4">Wyniki wyszukiwania:</h1>
                <InertiaLink className='text-white m-4 bg-blue-600 py-2 px-6 rounded hover:bg-blue-700' as='button' href="/recipes">Back</InertiaLink>
                {/*<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">*/}
                {/*    {searchResults.map((result) => (*/}
                {/*        <div key={result.id} className="bg-white shadow-lg p-2 rounded-lg overflow-hidden relative">*/}
                {/*            <Link href={`/recipe/${result.id}`}>*/}
                {/*                <img src={result.image} alt={result.title} className="w-full h-64 object-cover"/>*/}
                {/*                <h4 className="text-center py-4">{result.title}</h4>*/}
                {/*            </Link>*/}
                {/*            {result.is_saved && (*/}
                {/*                <div className="absolute  top-2 right-2 ">*/}
                {/*                    <FaSave size={36} className="text-yellow-500" />*/}
                {/*                </div>*/}
                {/*            )}*/}
                {/*        </div>*/}
                {/*    ))}*/}
                {/*</div>*/}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((result) => (
                        <div key={result.id} className="bg-white shadow-lg rounded-lg overflow-hidden relative min-h-64">
                            <Link href={`/recipe/${result.id}`}>
                                <div className="relative h-64 rounded-lg overflow-hidden">
                                    <p className="absolute z-10 text-white text-lg font-semibold text-center w-full bottom-0 pb-4">{result.title}</p>
                                    <img src={result.image} alt={result.title} className="absolute  inset-0 w-full h-full object-cover "/>
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
                                </div>
                            </Link>
                            <div className="absolute top-2 right-2 flex ">
                            {!result.is_saved && (

                                <div >
                                    <FaSave size={36} className="text-green-400" />
                                </div>
                            )}
                            {!result.is_vegan && (
                                <div >
                                    <LuVegan size={36} className="text-green-400" />
                                </div>
                            )}
                        </div>
                                </div>
                    ))}
                </div>

            </div>
        </AuthenticatedLayout>
    );
};

export default SearchedRecipes;






// import React from 'react';
// import {InertiaLink} from '@inertiajs/inertia-react';
// import {motion} from "framer-motion";
// import {Head, Link} from "@inertiajs/react";
// import styled from "styled-components";
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
//
// const SearchedRecipes = ({auth,searchResults}) => {
//     console.log(searchResults);
//     return (
//         <AuthenticatedLayout user={auth.user}>
//             <Head title="Searched"/>
//             <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//                 <h1>Wyniki wyszukiwania:</h1>
//                 <InertiaLink className='text-white m-4 bg-blue-600 py-2 px-6 rounded' as='button' href="/recipes">Back</InertiaLink>
//                 <Grid>
//
//                     {searchResults.map((result, index) => (
//                         <Card key={result.id}>
//                             <Link href={`/recipe/${result.id}`}>
//                                 <img src={result.image} alt=""/>
//                                 <h4>{result.title}</h4>
//                             </Link>
//                         </Card>
//                     ))}
//
//
//                 </Grid>
//             </div>
//         </AuthenticatedLayout>
//     );
// };
//
// export default SearchedRecipes;
//
//
// const Grid = styled.div`
//     display: grid;
//     grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
//     grid-gap: 3rem;
// `;
//
// const Card = styled.div`
//     img {
//         width: 100%;
//         border-radius: 2rem;
//     }
//
//     a {
//         text-decoration: none;
//     }
//
//     h4 {
//         text-align: center;
//         padding: 1rem;
//     }
// `;
//
