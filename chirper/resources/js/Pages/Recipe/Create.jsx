

import React, {useState} from 'react';
import {Inertia} from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head} from '@inertiajs/react';

export default function Create({auth}) {
    const unitOptions = ['ml', 'l', 'kg', 'g', 'szt.', 'łyżka', 'łyżeczka', 'opakowanie', 'szklanka'];

    const [values, setValues] = useState({
        title: '',
        ingredients: [{ name: '', quantity: '', unit: '' }],
        instructions: '',
        ready_in_minutes: '',
        servings: '',
    });
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        const { name, value, dataset } = e.target;
        if (name.startsWith('ingredient')) {
            const index = parseInt(name.split('_')[1], 10);
            const newIngredients = [...values.ingredients];
            newIngredients[index][dataset.type] = value;
            setValues({ ...values, ingredients: newIngredients });
        } else {
            setValues({ ...values, [name]: value });
        }
    };

    const handleAddIngredient = () => {
        setValues({
            ...values,
            ingredients: [...values.ingredients, {name: '', quantity: ''}],
        });
    };
    const handleRemoveIngredient = (index) => {
        setValues(values => ({
            ...values,
            ingredients: values.ingredients.filter((_, i) => i !== index),
        }));
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Stwórz swój przepis</h2>}
        >
            <Head title="Create Recipe" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form className="p-6 flex flex-col" onSubmit={handleSubmit}>
                            <div className="mb-6 flex flex-wrap mx-2  p-4 bg-white rounded-lg shadow">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Nazwa Przepisu:</label>
                                <input name="title" value={values.title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                            </div>

                            {values.ingredients.map((ingredient, index) => (
                                <div key={index} className='flex flex-wrap mx-2 mb-4 p-4 bg-white rounded-lg shadow'>
                                {/*// <div key={index} className='flex items-center mb-4 p-4 bg-white rounded-lg shadow'>*/}
                                    <div className='w-full md:w-1/2 px-2 mb-4 md:mb-0'>
                                        <label htmlFor={`ingredient_${index}_name`} className="block text-sm font-medium text-gray-700">Składnik {index + 1}:</label>
                                        <input
                                            name={`ingredient_${index}`}
                                            data-type="name"
                                            value={ingredient.name}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className='w-1/4 md:w-1/6 px-2 mb-4 md:mb-0'>
                                        <label htmlFor={`ingredient_${index}_quantity`} className="block text-sm font-medium text-gray-700">Ilość:</label>
                                        <input
                                            name={`ingredient_${index}`}
                                            data-type="quantity"
                                            value={ingredient.quantity}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        />
                                    </div>

                                    <div className='w-1/4 md:w-1/6 px-2 mb-4 md:mb-0'>
                                        <label htmlFor={`ingredient_${index}_unit`} className="block text-sm font-medium text-gray-700">Jednostka:</label>
                                        <select
                                            name={`ingredient_${index}`}
                                            data-type="unit"
                                            value={ingredient.unit}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        >
                                            {unitOptions.map((unit) => (
                                                <option key={unit} value={unit}>{unit}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {index > 0 && (
                                        <button
                                            className='text-white bg-red-600 hover:bg-red-700 py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 m-6'
                                            type="button"
                                            onClick={() => handleRemoveIngredient(index)}
                                        >
                                            Usuń
                                        </button>
                                    )}
                                </div>
                            ))}

                            <div className="flex justify-start -mx-2 mb-4">
                                <button className='text-white m-4 bg-green-500 hover:bg-green-600 py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
                                        type="button"
                                        onClick={handleAddIngredient}
                                >
                                    Dodaj Składnik
                                </button>
                                {/*{values.ingredients.length > 1 && (*/}
                                {/*    <button className='text-white m-4 bg-red-600 hover:bg-red-700 py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50' type="button" onClick={handleRemoveLastIngredient}>Remove Last Ingredient</button>*/}
                                {/*)}*/}
                            </div>

                            <div className='flex flex-wrap mx-2 mb-4 p-4 bg-white rounded-lg shadow'>
                                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions:</label>
                                <textarea name="instructions" value={values.instructions} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                            </div>

                            {/*<div className="flex flex-wrap -mx-2 mb-4">*/}
                            <div className='flex flex-wrap mx-2 mb-4 p-4 bg-white rounded-lg shadow'>
                                <div className="w-1/4 md:w-1/4 px-2 mb-4 md:mb-0">
                                    <label htmlFor="ready_in_minutes" className="block text-sm font-medium text-gray-700">Czas minut:</label>
                                    <input name="ready_in_minutes" type="number" value={values.ready_in_minutes}
                                           onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                                </div>

                                <div className="w-1/4 md:w-1/4 px-2">
                                    <label htmlFor="servings" className="block text-sm font-medium text-gray-700">Porcji:</label>
                                    <input name="servings" type="number" value={values.servings} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                                </div>
                            </div>

                            <div className='flex flex-wrap mx-2 mb-4 p-4 bg-white rounded-lg shadow'>
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image:</label>
                                <input type="file" name="image" onChange={handleImageChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                            </div>

                            <button className="w-3/4 mx-auto text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 py-2 px-6 rounded" type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>

        // <AuthenticatedLayout
        //     user={auth.user}
        //     header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Recipe</h2>}
        // >
        //     <Head title="Create Recipe"/>
        //     <div className="py-12">
        //         <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        //             <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        //                 <form className="p-4 flex flex-col" onSubmit={handleSubmit}>
        //                     <label htmlFor="title">Title:</label>
        //                     <input name="title" value={values.title} onChange={handleChange} className="rounded mx-2 "/>
        //
        //                     {values.ingredients.map((ingredient, index) => (
        //                         <div key={index} className='m-2'>
        //                             <label htmlFor={`ingredient_${index}_name`}>Składnik {index + 1} :</label>
        //                             <input
        //                                 name={`ingredient_${index}`}
        //                                 data-type="name"
        //                                 value={ingredient.name}
        //                                 onChange={handleChange}
        //                                 className="rounded mx-2"
        //                             />
        //
        //                             <label htmlFor={`ingredient_${index}_quantity`}>Ilość:</label>
        //                             <input
        //                                 name={`ingredient_${index}`}
        //                                 data-type="quantity"
        //                                 value={ingredient.quantity}
        //                                 onChange={handleChange}
        //                                 className="rounded mx-2 "
        //                             />
        //                             <label htmlFor={`ingredient_${index}_unit`}>Unit:</label>
        //                             <select
        //                                 name={`ingredient_${index}`}
        //                                 data-type="unit"
        //                                 value={ingredient.unit}
        //                                 onChange={handleChange}
        //                                 className="rounded mx-2 "
        //                             >
        //                                 {unitOptions.map((unit) => (
        //                                     <option key={unit} value={unit}>{unit}</option>
        //                                 ))}
        //                             </select>
        //                             {index >0 &&
        //                             <button className=' text-white m-4 bg-red-600 py-2 px-6 rounded' type="button" onClick={() => handleRemoveIngredient(index)}>Remove</button>
        //                             }
        //                             </div>
        //
        //                     ))}
        //                     <div>
        //                         <button className=' text-white m-4 bg-green-500 py-2 px-6 rounded' type="button"
        //                                 onClick={handleAddIngredient}>Add Ingredient
        //                         </button>
        //                         {values.ingredients.length > 1 && (
        //                             <button className=' text-white m-4 bg-red-600 py-2 px-6 rounded' type="button"
        //                                     onClick={handleRemoveLastIngredient}>Remove Last Ingredient</button>
        //                         )}
        //                     </div>
        //                     <label htmlFor="instructions">Instructions:</label>
        //                     <textarea name="instructions" value={values.instructions} onChange={handleChange} className="rounded m-2 "/>
        //                     <div>
        //                         <label htmlFor="ready_in_minutes">Ready in Minutes:</label>
        //                         <input name="ready_in_minutes" type="number" value={values.ready_in_minutes}
        //                                onChange={handleChange} className="rounded mx-2 "/>
        //
        //                         <label htmlFor="servings">Servings:</label>
        //                         <input name="servings" type="number" value={values.servings} onChange={handleChange} className="rounded mx-2 "/>
        //                     </div>
        //                     <label htmlFor="image">Image:</label>
        //                     {/*<input type="file" name="image" onChange={handleImageChange}/>*/}
        //                     <input type="file" name="image" onChange={handleImageChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"/>
        //
        //                     <button className="text-white m-4 bg-green-600 py-2 px-6 rounded" type="submit">Submit
        //                     </button>
        //                 </form>
        //             </div>
        //         </div>
        //     </div>
        // </AuthenticatedLayout>
    );
}

