// import React, {useState} from "react";
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
//
// import { Inertia } from '@inertiajs/inertia';
// import { Head } from '@inertiajs/react';
//
//
// export default function Create({auth}) {
//
//     const [values, setValues] = useState({
//         title: '',
//         body: '',
//     });
//
//     function handleChange(e) {
//         const key = e.target.id;
//         const value = e.target.value;
//         setValues(values => ({
//             ...values, [key]: value,
//         }))
//     }
//
//     function handleSubmit(e) {
//         e.preventDefault();
//         Inertia.post(route('recipes.store'), values);
//     }
//
//     return (
//         <AuthenticatedLayout
//             user={auth.user}
//             header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create recipe</h2>}
//         >
//             <Head title="Create recipe"/>
//
//             <div className="py-12">
//                 <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//                     <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
//                         <form className='p-4 ' onSubmit={handleSubmit}>
//                             <label htmlFor="title">Title:</label>
//                             <input id="title" value={values.title} onChange={handleChange}/>
//                             <label htmlFor="body">Body:</label>
//                             <input id="body" value={values.body} onChange={handleChange}/>
//                             <button className=' text-white m-4 bg-green-600 py-2 px-6 rounded' type="submit">Submit</button>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </AuthenticatedLayout>
//     );
// }

import React, {useState} from 'react';
import {Inertia} from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head} from '@inertiajs/react';

export default function Create({auth}) {
    const [values, setValues] = useState({
        title: '',
        ingredients: [{name: '', quantity: ''}],
        instructions: '',
        ready_in_minutes: '',
        servings: '',
    });

    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        const {name, value} = e.target;
        if (name.startsWith('ingredient')) {
            const index = parseInt(name.split('_')[1], 10);
            const newIngredients = [...values.ingredients];
            newIngredients[index][e.target.dataset.type] = value;
            setValues({...values, ingredients: newIngredients});
        } else {
            setValues({...values, [name]: value});
        }
    };

    const handleAddIngredient = () => {
        setValues({
            ...values,
            ingredients: [...values.ingredients, {name: '', quantity: ''}],
        });
    };

    const handleRemoveLastIngredient = () => {
        if (values.ingredients.length > 1) {
            setValues(values => ({
                ...values,
                ingredients: values.ingredients.slice(0, -1),
            }));
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            if (key === 'ingredients') {
                formData.append(key, JSON.stringify(values[key]));
            } else {
                formData.append(key, values[key]);
            }
        });
        formData.append('source', 'user'); // Dodaj 'source' jako 'user'

        if (image) {
            formData.append('image', image);
        }

        Inertia.post(route('recipes.store'), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Recipe</h2>}
        >
            <Head title="Create Recipe"/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form className="p-4 flex flex-col" onSubmit={handleSubmit}>
                            <label htmlFor="title">Title:</label>
                            <input name="title" value={values.title} onChange={handleChange}/>

                            {values.ingredients.map((ingredient, index) => (
                                <div key={index}>
                                    <label htmlFor={`ingredient_${index}_name`}>Ingredient {index + 1} Name:</label>
                                    <input
                                        name={`ingredient_${index}`}
                                        data-type="name"
                                        value={ingredient.name}
                                        onChange={handleChange}
                                    />

                                    <label htmlFor={`ingredient_${index}_quantity`}>Quantity:</label>
                                    <input
                                        name={`ingredient_${index}`}
                                        data-type="quantity"
                                        value={ingredient.quantity}
                                        onChange={handleChange}
                                    />
                                </div>
                            ))}
                            <div>
                                <button className=' text-white m-4 bg-green-500 py-2 px-6 rounded' type="button"
                                        onClick={handleAddIngredient}>Add Ingredient
                                </button>
                                {values.ingredients.length > 1 && (
                                    <button className=' text-white m-4 bg-red-600 py-2 px-6 rounded' type="button"
                                            onClick={handleRemoveLastIngredient}>Remove Last Ingredient</button>
                                )}
                            </div>
                            <label htmlFor="instructions">Instructions:</label>
                            <textarea name="instructions" value={values.instructions} onChange={handleChange}/>
                            <div>
                                <label htmlFor="ready_in_minutes">Ready in Minutes:</label>
                                <input name="ready_in_minutes" type="number" value={values.ready_in_minutes}
                                       onChange={handleChange}/>

                                <label htmlFor="servings">Servings:</label>
                                <input name="servings" type="number" value={values.servings} onChange={handleChange}/>
                            </div>
                            <label htmlFor="image">Image:</label>
                            <input type="file" name="image" onChange={handleImageChange}/>

                            <button className="text-white m-4 bg-green-600 py-2 px-6 rounded" type="submit">Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

