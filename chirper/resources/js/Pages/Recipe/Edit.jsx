

import React, {useState} from 'react';
import {Inertia} from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link} from '@inertiajs/react';
import DOMPurify from "dompurify";

export default function Edit({auth,recipe}) {
    const unitOptions = ['ml', 'l', 'kg', 'g', 'szt.', 'łyżka', 'łyżeczka', 'opakowanie', 'szklanka'];

    const ingredients = JSON.parse(recipe.ingredients);
    const cleanInstructions = DOMPurify.sanitize(recipe.instructions);

    const [values, setValues] = useState({
        title: recipe.title,
        ingredients: ingredients || [{ name: '', quantity: '', unit: '' }],
        instructions: recipe.instructions,
        ready_in_minutes: recipe.ready_in_minutes,
        servings: recipe.servings,
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

    const handleRemoveLastIngredient = () => {
        if (values.ingredients.length > 1) {
            setValues(values => ({
                ...values,
                ingredients: values.ingredients.slice(0, -1),
            }));
        }
    };
    const handleRemoveIngredient = (index) => {
        setValues(values => ({
            ...values,
            ingredients: values.ingredients.filter((_, i) => i !== index),
        }));
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

        if (image) {
            formData.append('image', image);
        }
        formData.append('_method', 'PUT');
        console.log('Form Data:', formData);
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        Inertia.post(route('recipes.update',{ recipe: recipe.id }), formData, {

            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Recipe</h2>}
        >
            <Head title="Edit Recipe"/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <img src={recipe.image} alt=""/>
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
                                    <label htmlFor={`ingredient_${index}_unit`}>Unit:</label>
                                    <input
                                        name={`ingredient_${index}`}
                                        data-type="unit"
                                        value={ingredient.unit}
                                        onChange={handleChange}
                                    >
                                        {/*{unitOptions.map((unit) => (*/}
                                        {/*    <option key={unit} value={unit}>{unit}</option>*/}
                                        {/*))}*/}
                                    </input>
                                    <button className=' text-white m-4 bg-red-600 py-2 px-6 rounded' type="button" onClick={() => handleRemoveIngredient(index)}>Remove</button>
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

                            {/*<button className="text-white m-4 bg-green-600 py-2 px-6 rounded" type="submit">Submit*/}
                            {/*</button>*/}
                            <button className="text-white m-4 bg-green-600 py-2 px-6 rounded" type="button" onClick={handleSubmit}>Submit</button>

                        </form>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}

