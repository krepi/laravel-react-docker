import {Link, Head} from '@inertiajs/react';
import mealImage from '/public/images/assets/meal.jpg'
import WelcomeContent from "@/Pages/WelcomeContent.jsx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import WelcomeGuestLayout from "@/Layouts/WelcomeGuestLayout.jsx";

export default function Welcome({auth, laravelVersion, phpVersion}) {
    const isLoggedIn = !!auth.user;
    return (
        <>
            <Head title="Welcome"/>

            <div>

                {isLoggedIn ? (
                    <AuthenticatedLayout user={auth.user}>
                        <WelcomeContent isLoggedIn={isLoggedIn}/>
                    </AuthenticatedLayout>
                ) : (
                    <>
                        <div

                        >

                            {/*</div>*/}
                            <WelcomeGuestLayout>
                                <WelcomeContent isLoggedIn={isLoggedIn}/>
                            </WelcomeGuestLayout>

                        </div>
                    </>

                )}

            </div>

        </>
    );
}
