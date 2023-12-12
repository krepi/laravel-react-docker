import {Link, Head} from '@inertiajs/react';
import mealImage from '/public/images/assets/meal.jpg'

export default function Welcome({auth, laravelVersion, phpVersion}) {
    // const bannerImageUrl = "https://source.unsplash.com/jUPOXXRNdcA";
    return (
        <>
            <Head title="Welcome"/>
            <div
                className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
                <div className="sm:fixed sm:top-0 sm:right-0 p-6 text-right">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                Log in
                            </Link>

                            <Link
                                href={route('register')}
                                className="ml-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

                <div className="main w-4/5 mx-auto" style={{ height: '80vh' }}>
                    <section className='header h-1/2'>
                        <div className="main h-full mx-auto ">
                                <div className="banner relative h-full bg-cover bg-center" style={{ backgroundImage: `url(/images/assets/meal.jpg)`  }}>
                                    <button className="bg-blue-300 w-32 h-16 p-2 text-white rounded login_button absolute inset-0 m-auto">Zaloguj się</button>
                                </div>
                        </div>
                    </section>
                    <section className='h-1/2'>
                        <div className="wrapper flex justify-around">
                            <div className="card">
                                <h4 className="card_title">Znajdz Przepis</h4>
                                <img src="" alt="" className="card_img"/>
                                <p className="card_descriprion"></p>
                            </div>
                            <div className="card">
                                <h4 className="card_title">Zapisz Przepis</h4>
                                <img src="" alt="" className="card_img"/>
                                <p className="card_descriprion"></p>
                            </div>
                            <div className="card">
                                <h4 className="card_title">Stwórz przepis</h4>
                                <img src="" alt="" className="card_img"/>
                                <p className="card_descriprion"></p>
                            </div>
                        </div>
                    </section>
                    <section className="footer">footer</section>

                </div>
            </div>

            {/*<style>{`*/}
            {/*    .bg-dots-darker {*/}
            {/*        background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(0,0,0,0.07)'/%3E%3C/svg%3E");*/}
            {/*    }*/}
            {/*    @media (prefers-color-scheme: dark) {*/}
            {/*        .dark\\:bg-dots-lighter {*/}
            {/*            background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(255,255,255,0.07)'/%3E%3C/svg%3E");*/}
            {/*        }*/}
            {/*    }*/}
            {/*`}</style>*/}
        </>
    );
}
