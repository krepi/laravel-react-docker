import React from 'react';
import {InertiaLink} from '@inertiajs/inertia-react';
import {Head, Link} from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BackButton from "@/Components/custom/BackButtons.jsx";
import {FaSave} from "react-icons/fa";
import {LuVegan} from "react-icons/lu";
import {LuWheatOff} from "react-icons/lu";

const SearchedRecipes = ({auth, searchResults}) => {
    console.log(searchResults)
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Searched"/>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold my-4">Odkrywaj Świat Smaków na Wyciągnięcie Ręki</h1>
                <p>Poznaj Szczegóły: Kliknij w przepis, aby zobaczyć szczegółowe informacje, składniki, instrukcje i
                    zdjęcia. Odkrywaj porady, triki i opinie innych użytkowników.</p>
                {/*<InertiaLink className='text-white m-4 bg-blue-600 py-2 px-6 rounded hover:bg-blue-700' as='button'*/}
                {/*             href="/recipes">Back</InertiaLink>*/}
                <BackButton/>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((result) => (
                        <div key={result.id}
                             className="bg-white shadow-lg rounded-lg overflow-hidden relative min-h-64">
                            <Link href={`/recipe/${result.id}`}>
                                <div className="relative h-64 rounded-lg overflow-hidden">
                                    <p className="absolute z-10 text-white text-lg font-semibold text-center w-full bottom-0 pb-4">{result.title}</p>
                                    <img src={result.image} alt={result.title}
                                         className="absolute  inset-0 w-full h-full object-cover "/>
                                    <div
                                        className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
                                </div>
                            </Link>
                            <div className="absolute top-2 right-2 flex ">

                                {result.vegan && (
                                    <div>
                                        <LuVegan size={36} className="text-green-400"/>
                                    </div>
                                )}
                                {result.glutenFree && (
                                    <div>
                                        <LuWheatOff size={36} className="text-yellow-500 font-bold"/>
                                    </div>
                                )}
                                {result.is_saved && (

                                    <div>
                                        <FaSave size={36} className="text-gray-500"/>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <p className="m-2 ">Pamiętaj że to dopiero poczatek przygody. Mozesz szukac ponownie z nowymi wskazowkami jesli cos Cie zainspiruje albo puść wodze fantazji i szukaj w ciemno - na pewno na koncu szlaku czeka Ciebie kulinarne odkrycie ! </p>
            </div>
        </AuthenticatedLayout>
    );
};

export default SearchedRecipes;


