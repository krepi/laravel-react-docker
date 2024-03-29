import React from "react";
import {Head, Link} from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '@splidejs/splide/dist/css/splide.min.css'
import {LuVegan, LuWheatOff} from "react-icons/lu";


export default function UserProfilePage({auth, recipes, userProfile, roleName}) {
    console.log(recipes);
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Profile"/>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="max-w-7xl p-4 mx-auto sm:px-6 lg:px-8">
                <div className="py-10 px-2">
                    <h1 className="text-3xl font-bold text-center mb-4">Witamy w Przystani Smaków</h1>
                    <p className="text-lg text-center mb-4">Twoja Osobista Księga Kulinarnych Skarbów!</p>
                    <p className="text-md text-center mb-6">Witaj w miejscu, gdzie Twoja pasja do gotowania spotyka się
                        z Twoją kreatywnością. Ta strona to Twoja osobista księga przepisów, kolekcja ulubionych dań,
                        które samodzielnie stworzyłeś lub zapisane zostały z naszego bogatego katalogu. Każdy przepis to
                        odbicie Twoich kulinarnych podróży, eksperymentów i udoskonalonych technik. Jest to przestrzeń,
                        gdzie Twoje ulubione smaki i aromaty są zawsze pod ręką, gotowe do odkrycia i dzielenia się nimi
                        z innymi.</p>
                    <h2 className="text-xl font-semibold mb-8">Witaj, {userProfile.name}!</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                        <div key={recipe.id} className="relative bg-white shadow-lg p-2 rounded-lg overflow-hidden">
                            <Link href={route('recipes.show', recipe.id)}>
                                <img src={recipe.image} alt={recipe.title}
                                     className="w-full h-64 object-cover rounded-t-lg"/>
                                <h4 className="text-center py-2">{recipe.title}</h4>
                            </Link>
                            <div className="absolute top-3 right-3 flex ">
                                {recipe.diets && recipe.diets.includes('vegan') &&
                                    <LuVegan size={36} className="text-green-500"/>}
                                {recipe.diets && recipe.diets.includes('gluten free') &&
                                    <LuWheatOff size={36} className="text-yellow-400"/>}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center my-12">
                    <p>Z DishDock każdy dzień może być nową przygodą kulinarną. Życzymy Ci wielu inspirujących chwil i
                        niezapomnianych smaków!</p>
                </div>


            </div>
            </div>
        </AuthenticatedLayout>
    );
}



