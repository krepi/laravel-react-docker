import React, { useState, useEffect } from 'react';
import LoadingComponent from '@/Components/custom/LoadingComponent';

const InertiaApp = ({ App, props }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        const handleStart = () => {
            setIsLoading(true);
            // Ustawienie opóźnienia przed pokazaniem komponentu ładowania
            setTimeout(() => {
                if (isLoading) setShowLoading(true);
            }, 500); // 500 ms opóźnienia
        };

        const handleFinish = () => {
            setIsLoading(false);
            setShowLoading(false);
        };

        document.addEventListener('inertia:start', handleStart);
        document.addEventListener('inertia:finish', handleFinish);

        return () => {
            document.removeEventListener('inertia:start', handleStart);
            document.removeEventListener('inertia:finish', handleFinish);
        };
    }, []);

    return (
        <>
            {showLoading && <LoadingComponent />}
            <App {...props} />
        </>
    );
};

export default InertiaApp;
