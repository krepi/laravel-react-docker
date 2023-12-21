import { Link } from '@inertiajs/inertia-react';
import mealImage from '/public/images/assets/meal.jpg';

export default function WelcomeContent({ isLoggedIn }) {
    return (
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-4">

            <div>

                <div className="relative h-96 flex items-center justify-center bg-cover bg-center text-white p-8 rounded" style={{ backgroundImage: `url(${mealImage})` }}>
                    {/* Nakładka ściemniająca */}
                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-black opacity-50 rounded"></div>

                    <div className="text-center relative"> {/* Ustawienie relative, aby tekst był na wierzchu */}
                        <h1 className="text-5xl font-bold mb-4">Witaj w DishDock!</h1>
                        <p className="mb-6">Odkryj najlepsze przepisy i dziel się nimi ze światem.</p>
                        <button href="/login" className="bg-blue-600 hover:bg-blue-700 py-3 px-8 rounded-lg text-lg">Dołącz do nas</button>
                    </div>
                </div>

                {/* Features Section */}
                <div className="my-12 mx-auto sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-semibold text-center mb-10">Możliwości aplikacji</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Feature Card 1 */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <img src="placeholder-feature-1.jpg" alt="Feature 1" className="w-full h-40 object-cover rounded-md"/>
                            <h3 className="mt-4 font-semibold text-lg">Funkcja 1</h3>
                            <p>Krótki opis funkcji 1.</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <img src="placeholder-feature-1.jpg" alt="Feature 1" className="w-full h-40 object-cover rounded-md"/>
                            <h3 className="mt-4 font-semibold text-lg">Funkcja 1</h3>
                            <p>Krótki opis funkcji 1.</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <img src="placeholder-feature-1.jpg" alt="Feature 1" className="w-full h-40 object-cover rounded-md"/>
                            <h3 className="mt-4 font-semibold text-lg">Funkcja 1</h3>
                            <p>Krótki opis funkcji 1.</p>
                        </div>
                        {/* Feature Card 2 */}
                        {/* ... (powtórz dla pozostałych funkcji) ... */}

                    </div>
                </div>

                {/* About Us Section */}
                <div className="my-12 mx-auto sm:px-6 lg:px-8 ">
                    <h2 className="text-3xl font-semibold text-center mb-10">O nas</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Team Member Card 1 */}
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <img src="placeholder-team-1.jpg" alt="Team Member 1" className="w-24 h-24 object-cover rounded-full mx-auto"/>
                            <h3 className="mt-4 font-semibold">Imię Nazwisko</h3>
                            <p>Rola w zespole</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <img src="placeholder-team-1.jpg" alt="Team Member 1" className="w-24 h-24 object-cover rounded-full mx-auto"/>
                            <h3 className="mt-4 font-semibold">Imię Nazwisko</h3>
                            <p>Rola w zespole</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <img src="placeholder-team-1.jpg" alt="Team Member 1" className="w-24 h-24 object-cover rounded-full mx-auto"/>
                            <h3 className="mt-4 font-semibold">Imię Nazwisko</h3>
                            <p>Rola w zespole</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <img src="placeholder-team-1.jpg" alt="Team Member 1" className="w-24 h-24 object-cover rounded-full mx-auto"/>
                            <h3 className="mt-4 font-semibold">Imię Nazwisko</h3>
                            <p>Rola w zespole</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <img src="placeholder-team-1.jpg" alt="Team Member 1" className="w-24 h-24 object-cover rounded-full mx-auto"/>
                            <h3 className="mt-4 font-semibold">Imię Nazwisko</h3>
                            <p>Rola w zespole</p>
                        </div>
                        {/* Team Member Card 2 */}
                        {/* ... (powtórz dla pozostałych członków zespołu) ... */}
                    </div>
                </div>

                {/* Footer Section */}
                <div className="bg-gray-900 text-white p-6">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <p>&copy; DishDock {new Date().getFullYear()}</p>
                        <div>
                            {/* Social Media Icons */}
                            {/* ... (dodaj ikony/linki do mediów społecznościowych) ... */}
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}
