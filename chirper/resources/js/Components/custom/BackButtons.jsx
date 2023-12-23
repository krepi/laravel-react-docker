import React from 'react';


const BackButton = () => {
    const handleBack = () => {
        window.history.back();
    };

    return (
        <button
            onClick={handleBack}
            className='text-white m-4 bg-gray-600 py-2 px-6 rounded hover:bg-gray-700'
        >
           Powrót
        </button>
    );
};

export default BackButton;
