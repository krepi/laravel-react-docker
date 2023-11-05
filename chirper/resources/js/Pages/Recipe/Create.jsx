import React, {useState} from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import { Inertia } from '@inertiajs/inertia';
import { Head } from '@inertiajs/react';


export default function Create({auth}) {

    const [values, setValues] = useState({
        title: '',
        body: '',
    });

    function handleChange(e) {
        const key = e.target.id;
        const value = e.target.value;
        setValues(values => ({
            ...values, [key]: value,
        }))
    }

    function handleSubmit(e) {
        e.preventDefault();
        Inertia.post(route('recipes.store'), values);
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create recipe</h2>}
        >
            <Head title="Create recipe"/>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form className='p-4 ' onSubmit={handleSubmit}>
                            <label htmlFor="title">Title:</label>
                            <input id="title" value={values.title} onChange={handleChange}/>
                            <label htmlFor="body">Body:</label>
                            <input id="body" value={values.body} onChange={handleChange}/>
                            <button className=' text-white m-4 bg-green-600 py-2 px-6 rounded' type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
