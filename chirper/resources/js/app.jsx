// import './bootstrap';
// import '../css/app.css';
//
// import { createRoot } from 'react-dom/client';
// import { createInertiaApp } from '@inertiajs/react';
// import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
//
// const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
//
// createInertiaApp({
//     title: (title) => `${title} - ${appName}`,
//     resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
//     setup({ el, App, props }) {
//         const root = createRoot(el);
//
//         root.render(<App {...props} />);
//     },
//     progress: {
//         color: '#4B5563',
//     },
// });

//KOD POWYZEJ TO ORGINALNY KOD Z PAKIETU


import './bootstrap';
import '../css/app.css';
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp} from '@inertiajs/react';
import {InertiaProgress} from "@inertiajs/progress";
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import LoadingComponent from '@/Components/custom/LoadingComponent';


const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

InertiaProgress.init({
    color: '#4B5563',
    includeCSS: true,
    showSpinner: false,
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        // const InertiaApp = () => {
        //     const [isLoading, setIsLoading] = useState(false);
        //
        //     useEffect(() => {
        //         const handleStart = () => setIsLoading(true);
        //         const handleFinish = () => setIsLoading(false);
        //
        //         document.addEventListener('inertia:start', handleStart);
        //         document.addEventListener('inertia:finish', handleFinish);
        //
        //         return () => {
        //             document.removeEventListener('inertia:start', handleStart);
        //             document.removeEventListener('inertia:finish', handleFinish);
        //         };
        //     }, []);
        //
        //     return (
        //         <>
        //             {isLoading && <LoadingComponent />}
        //             <App {...props} />
        //         </>
        //     );
        // };
        const InertiaApp = () => {
            const [isLoading, setIsLoading] = useState(false);
            const [startTimeout, setStartTimeout] = useState(null);

            useEffect(() => {
                const handleStart = () => {
                    // Ustawia timeout, aby opóźnić pokazywanie LoadingComponent
                    const timeout = setTimeout(() => setIsLoading(true), 1000); // 1000 ms = 1 sekunda
                    setStartTimeout(timeout);
                };
                const handleFinish = () => {
                    // Anuluje timeout jeśli strona załadowała się szybciej niż 1 sekunda
                    if (startTimeout) clearTimeout(startTimeout);
                    setIsLoading(false);
                };

                document.addEventListener('inertia:start', handleStart);
                document.addEventListener('inertia:finish', handleFinish);

                return () => {
                    document.removeEventListener('inertia:start', handleStart);
                    document.removeEventListener('inertia:finish', handleFinish);

                    // Wyczyść timeout przy odmontowywaniu komponentu
                    if (startTimeout) clearTimeout(startTimeout);
                };
            }, [startTimeout]);

            return (
                <>
                    {isLoading && <LoadingComponent />}
                    <App {...props} />
                </>
            );
        };

        const root = createRoot(el);
        root.render(<InertiaApp />);
    },
    progress: {
        color: '#4B5563',
    },
});
