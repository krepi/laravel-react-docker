// AllUsersRecipes.jsx
import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/inertia-react';

export default function AllUsersRecipes({ recipes,handlePagination }) {
    // const [recipes, setRecipes] = useState(initialRecipes);
console.log(recipes)
    const handlePageChange = (url) => {
        if (url) {
            Inertia.visit(url, {
                onSuccess: ({ props }) => {
                    setRecipes(props.recipes);
                },
                preserveState: true,
                only: ['recipes'],
            });
        }
    };

    return (
        <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Twoje przepisy</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.data.map((recipe) => (
                    <div key={recipe.id} className="bg-white shadow-lg p-2 rounded-lg overflow-hidden">
                        <Link href={`/recipe/${recipe.id}`}>
                            <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover"/>
                            <h4 className="text-center py-2">{recipe.title}</h4>
                        </Link>
                    </div>
                ))}
            </div>
            <div className="pagination flex justify-center items-center space-x-2 mt-4">
                {recipes.links.map((link, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(link.url)}
                        disabled={!link.url}
                        className={`px-4 py-2 border rounded ${link.active ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                    >
                        {link.label.replace(/&laquo;|&raquo;/g, '')}
                    </button>
                ))}
            </div>
            {/*<div className="pagination flex justify-center items-center space-x-2">*/}
            {/*    {recipes.links.map((link, index) => (*/}
            {/*        <button*/}
            {/*            key={index}*/}
            {/*            onClick={() => handlePagination(link.url)}*/}
            {/*            className={`px-4 py-2 border rounded ${link.active ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}*/}
            {/*        >*/}
            {/*            {link.label.replace(/&laquo;|&raquo;/g, '')}*/}
            {/*        </button>*/}
            {/*    ))}*/}
            {/*</div>*/}
        </div>
    );
}




// // AllUsersRecipes.jsx
// import React from 'react';
// import { Link,InertiaLink } from "@inertiajs/inertia-react";
//
// export default function AllUsersRecipes({ recipes }) {
//     return (
//         <div className="mt-4">
//             <h1 className="text-xl font-semibold text-gray-700">Wyniki wyszukiwania:</h1>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
//                 {recipes.data.map((recipe) => (
//                     <div key={recipe.id} className="bg-white shadow-lg p-2 rounded-lg overflow-hidden">
//                         <Link href={`/recipe/${recipe.id}`}>
//                             <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover rounded-t-lg" />
//                             <h4 className="text-center py-2">{recipe.title}</h4>
//                         </Link>
//                     </div>
//                 ))}
//             </div>
//
//             {/* Paginacja */}
//             <div className="pagination flex justify-center items-center space-x-2 mt-4">
//                 {recipes.links.map((link, index) => (
//                     <InertiaLink
//                         key={index}
//                         href={link.url}
//                         preserveScroll
//                         only={['recipes']}
//                         className={`px-4 py-2 border rounded ${link.active ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
//                     >
//                         {link.label.replace(/&laquo;|&raquo;/g, '')} {/* Usuwa &laquo; i &raquo; */}
//                     </InertiaLink>
//                 ))}
//             </div>
//         </div>
//     );
// }
