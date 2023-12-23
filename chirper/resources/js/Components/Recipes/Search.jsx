import styled from "styled-components";
import {useState} from "react";
import {FaSearch, FaPizzaSlice} from "react-icons/fa";
import {GiHamburger} from "react-icons/gi";
import {Inertia} from "@inertiajs/inertia";


export default function Search() {

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [parameters, setParameters] = useState({maxProtein: '', minProtein: '', maxFat: '', minFat: ''});
    // Nowy stan do kontrolowania widoczności zaawansowanych opcji
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

    // ... (reszta twojej logiki)

    const handleToggleAdvancedOptions = () => {
        setShowAdvancedOptions(!showAdvancedOptions);
    }
    const toggleOption = (option) => {
        setSelectedOptions(prev =>
            prev.includes(option) ? prev.filter(p => p !== option) : [...prev, option]
        );
    };

    const updateParameter = (param, value) => {
        setParameters(prev => ({...prev, [param]: value}));
    };

    const isActive = (option) => selectedOptions.includes(option);
    const isParameterActive = (param, option) => {
        return parameters[param]?.split(',').includes(option);
    };
    const buildQuery = () => {
        let queryParts = [];

        // Jeśli searchTerm jest używany, dodaj go jako pierwszy element zapytania
        if (searchTerm) {
            queryParts.push(`query=${encodeURIComponent(searchTerm)}`);
        }

        // Dodaj wybrane opcje jako kolejne elementy zapytania
        selectedOptions.forEach(option => {
            queryParts.push(encodeURIComponent(option));
        });

        // Dodaj pozostałe parametry
        for (const param in parameters) {
            if (parameters[param]) {
                queryParts.push(`${param}=${encodeURIComponent(parameters[param])}`);
            }
        }

        return queryParts.join('&');
    };

    const toggleParameterOption = (param, option) => {
        setParameters(prev => {
            const currentValues = prev[param] ? prev[param].split(',') : [];
            if (currentValues.includes(option)) {
                // Usuń opcję, jeśli już istnieje
                return {...prev, [param]: currentValues.filter(item => item !== option).join(',')};
            } else {
                // Dodaj opcję, jeśli jej jeszcze nie ma
                return {...prev, [param]: [...currentValues, option].join(',')};
            }
        });
    };
    console.log(buildQuery());
    const handleSearch = (e) => {
        e.preventDefault();
        const query = buildQuery();
        if (query) {
            Inertia.post('/search', {term: query});
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className=" overflow-hidden   ">
                <h2 className="text-2xl font-semibold">Odkryj Smaki na Wyciągnięcie Ręki</h2>
                <p>Nasza wyszukiwarka to Twój klucz do świata kulinarnych inspiracji. Wpisz interesującą Cię frazę lub
                    wybierz preferencje, takie jak rodzaj kuchni, dieta, czy typ posiłku. Od klasycznych przepisów po
                    egzotyczne smaki, DishDock ułatwia personalizację Twojego doświadczenia kulinarne</p>
                <form onSubmit={handleSearch}
                      className="max-w-7xl mx-auto p-4 bg-white shadow rounded-lg sm:px-6 lg:px-8">
                    <div className="flex items-center border-b border-gray-300 py-2">
                        <FaSearch className="text-gray-500 mr-2"/>
                        <input
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text"
                            value={searchTerm}
                            placeholder="Wpisz szukany przepis"
                            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                        />
                    </div>
                    <div className="text-center mt-4">
                        <button
                            type="button"
                            onClick={handleToggleAdvancedOptions}
                            className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-700 focus:outline-none focus:shadow-outline mx-6">
                            {showAdvancedOptions ? 'Zwiń' : 'Rozwiń '}
                        </button>

                        <button type="submit"
                                className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-700 focus:outline-none focus:shadow-outline">
                            Szukaj przepisów
                        </button>
                    </div>
                    {showAdvancedOptions && (
                        <>
                            <div className="flex flex-wrap -mx-2 my-4 bg-gray-100">
                                <input type="text" placeholder="Max Protein (g)"
                                       onChange={(e) => updateParameter('maxProtein', e.target.value)}
                                       className="px-2 py-1 m-2 flex-auto rounded border border-gray-300"/>
                                <input type="text" placeholder="Min Protein (g)"
                                       onChange={(e) => updateParameter('minProtein', e.target.value)}
                                       className="px-2 m-2 py-1 flex-auto rounded border border-gray-300"/>
                                <input type="text" placeholder="Max Fat (g)"
                                       onChange={(e) => updateParameter('maxFat', e.target.value)}
                                       className="px-2 m-2 py-1 flex-auto rounded border border-gray-300"/>
                                <input type="text" placeholder="Min Fat (g)"
                                       onChange={(e) => updateParameter('minFat', e.target.value)}
                                       className="px-2 m-2 py-1 flex-auto rounded border border-gray-300"/>
                            </div>

                            <p>Diety</p>
                            <div className="flex justify-center flex-wrap bg-gray-100">
                                <button
                                    type="button"
                                    onClick={() => toggleParameterOption('diet', 'vegan')}
                                    className={`m-2 px-4 py-2 rounded text-sm ${isParameterActive('diet', 'vegan') ? 'bg-green-700 text-white ' : 'bg-gray-500 text-white'}`}>
                                    Vegańska
                                </button>

                                <button
                                    type="button"
                                    onClick={() => toggleParameterOption('diet', 'gluten-free')}
                                    className={`m-2 px-4 py-2 rounded text-sm ${isParameterActive('diet', 'gluten-free') ? 'bg-green-700 text-white ' : 'bg-gray-500 text-white'}`}>
                                 Bezglutenowa
                                </button>
                                <button
                                    type="button"
                                    onClick={() => toggleParameterOption('diet', 'vegetarian')}
                                    className={`m-2 px-4 py-2 rounded text-sm ${isParameterActive('diet', 'vegetarian') ? 'bg-green-700 text-white ' : 'bg-gray-500 text-white'}`}>
                                    Wegetariańska
                                </button>

                                <button
                                    type="button"
                                    onClick={() => toggleParameterOption('diet', 'ketogenic')}
                                    className={`m-2 px-4 py-2 rounded text-sm ${isParameterActive('diet', 'ketogenic') ? 'bg-green-700 text-white ' : 'bg-gray-500 text-white'}`}>
                                    Ketogeniczna
                                </button>


                            </div>
                            <p>Kuchnia</p>
                            <div className="flex justify-center gap-4 flex-wrap bg-gray-100">
                                <button
                                    type="button"
                                    onClick={() => toggleParameterOption('cuisine', 'american')}
                                    className={`text-xs font-bold px-3 py-1  rounded   h-8 items-center justify-center ${isParameterActive('cuisine', 'american') ? 'bg-green-700 text-white ' : 'bg-gray-500 text-white'}`}>
                                    Amerykańska
                                </button>
                                <button
                                    type="button"
                                    onClick={() => toggleParameterOption('cuisine', 'italian')}
                                    className={`text-xs font-bold px-3 py-1  rounded   h-8 items-center justify-center ${isParameterActive('cuisine', 'italian') ? 'bg-green-700 text-white ' : 'bg-gray-500 text-white'}`}>
                                   Włoska
                                </button>
                                <button
                                    type="button"
                                    onClick={() => toggleParameterOption('cuisine', 'mediterranean')}
                                    className={`text-xs font-bold px-3 py-1  rounded   h-8 items-center justify-center ${isParameterActive('cuisine', 'mediterranean') ? 'bg-green-700 text-white ' : 'bg-gray-500 text-white'}`}>
                                    Śródziemnomorska
                                </button>
                                <button
                                    type="button"
                                    onClick={() => toggleParameterOption('cuisine', 'indian')}
                                    className={`text-xs font-bold px-3 py-1  rounded   h-8 items-center justify-center ${isParameterActive('cuisine', 'indian') ? 'bg-green-700 text-white ' : 'bg-gray-500 text-white'}`}>
                                 Indyjska
                                </button>
                                <button
                                    type="button"
                                    onClick={() => toggleParameterOption('cuisine', 'european')}
                                    className={`text-xs font-bold px-3 py-1  rounded   h-8 items-center justify-center ${isParameterActive('cuisine', 'european') ? 'bg-green-700 text-white ' : 'bg-gray-500 text-white'}`}>
                                   Europejska
                                </button>
                                <button
                                    type="button"
                                    onClick={() => toggleParameterOption('cuisine', 'mexican')}
                                    className={`text-xs font-bold px-3 py-1  rounded   h-8 items-center justify-center ${isParameterActive('cuisine', 'mexican') ? 'bg-green-700 text-white ' : 'bg-gray-500 text-white'}`}>
                                    Meksykańska
                                </button>
                                <button
                                    type="button"
                                    onClick={() => toggleParameterOption('cuisine', 'thai')}
                                    className={`text-xs font-bold px-3 py-1  rounded   h-8 items-center justify-center ${isParameterActive('cuisine', 'thai') ? 'bg-green-700 text-white ' : 'bg-gray-500 text-white'}`}>
                                    Tajska
                                </button>
                                <button
                                    type="button"
                                    onClick={() => toggleParameterOption('cuisine', 'chinese')}
                                    className={`text-xs font-bold px-3 py-1  rounded   h-8 items-center justify-center ${isParameterActive('cuisine', 'chinese') ? 'bg-green-700 text-white ' : 'bg-gray-500 text-white'}`}>
                                   Chińska
                                </button>
                            </div>
                            <p>Rodzaj posilku</p>
                            <div className="flex justify-center gap-4 flex-wrap bg-gray-100">
                                <button
                                    type="button"
                                    onClick={() => toggleParameterOption('type', 'breakfast')}
                                    className={`text-xs font-bold px-3 py-1  rounded   h-8 items-center justify-center ${isParameterActive('type', 'breakfast') ? 'bg-green-700 text-white ' : 'bg-gray-500 text-white'}`}>
                                    Śniadanie
                                </button>
                                <button
                                    type="button"
                                    onClick={() => toggleParameterOption('type', 'main course')}
                                    className={`text-xs font-bold px-3 py-1  rounded   h-8 items-center justify-center ${isParameterActive('type', 'main course') ? 'bg-green-700 text-white ' : 'bg-gray-500 text-white'}`}>
                                    Danie Główne
                                </button>
                                <button
                                    type="button"
                                    onClick={() => toggleParameterOption('type', 'soup')}
                                    className={`text-xs font-bold px-3 py-1  rounded   h-8 items-center justify-center ${isParameterActive('type', 'soup') ? 'bg-green-700 text-white ' : 'bg-gray-500 text-white'}`}>
                                    Zupa
                                </button>
                                <button
                                    type="button"
                                    onClick={() => toggleParameterOption('type', 'dessert')}
                                    className={`text-xs font-bold px-3 py-1  rounded   h-8 items-center justify-center ${isParameterActive('type', 'dessert') ? 'bg-green-700 text-white ' : 'bg-gray-500 text-white'}`}>
                                 Deser
                                </button>
                                <button
                                    type="button"
                                    onClick={() => toggleParameterOption('type', 'side dish')}
                                    className={`text-xs font-bold px-3 py-1  rounded   h-8 items-center justify-center ${isParameterActive('type', 'side dish') ? 'bg-green-700 text-white ' : 'bg-gray-500 text-white'}`}>
                                    Przystawka
                                </button>
                                <button
                                    type="button"
                                    onClick={() => toggleParameterOption('type', 'salad')}
                                    className={`text-xs font-bold px-3 py-1  rounded   h-8 items-center justify-center ${isParameterActive('type', 'salad') ? 'bg-green-700 text-white ' : 'bg-gray-500 text-white'}`}>
                                    Sałatka
                                </button>
                            </div>
                        </>
                    )}


                </form>
            </div>
        </div>
    );
}

// <FormStyle onSubmit={handleSearch}>
//     <div>
//         <FaSearch className='search'></FaSearch>
//         <input
//             onChange={(e) => setSearchTerm(e.target.value)}
//             type="text"
//             value={searchTerm}
//             placeholder="Wpisz szukany przepis"
//         />
//     </div>
//     {/*        <button type="button" onClick={() => toggleOption('pasta')}*/}
//     {/*                className={`m-4 px-4 py-2 rounded ${isActive('pasta') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>*/}
//     {/*            Makaron*/}
//     {/*        </button>*/}
//
//     <input type="text" placeholder="Max Protein (g)"
//            onChange={(e) => updateParameter('maxProtein', e.target.value)}
//            className="px-2 py-1 m-2 rounded border small"/>
//     <input type="text" placeholder="Min Protein (g)"
//            onChange={(e) => updateParameter('minProtein', e.target.value)}
//            className="px-2 m-2 py-1 rounded border small"/>
//     <input type="text" placeholder="Max Fat (g)"
//            onChange={(e) => updateParameter('maxFat', e.target.value)}
//            className="px-2 m-2 py-1 rounded border small"/>
//     <button
//         type="button"
//         onClick={() => toggleParameterOption('diet', 'vegan')}
//         className={`m-4 px-4 py-2 rounded ${isParameterActive('diet', 'vegan') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
//         Vegan
//     </button>
//
//     <button
//         type="button"
//         onClick={() => toggleParameterOption('diet', 'gluten-free')}
//         className={`m-4 px-4 py-2 rounded ${isParameterActive('diet', 'gluten-free') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
//         Gluten free
//     </button>
//     {/*<button*/}
//     {/*    type="button"*/}
//     {/*    onClick={() => toggleParameterOption('cuisine', 'italian')}*/}
//     {/*    className={`m-4 px-4 py-2 rounded-full ${isParameterActive('cuisine', 'italian') ? 'active' : 'bg-gray-200'}`}>*/}
//     {/*    <FaPizzaSlice className='icon'/>Italian*/}
//     {/*</button>*/}
//     <button
//         type="button"
//         onClick={() => toggleParameterOption('cuisine', 'italian')}
//         className={`m-4 w-14 h-14 rounded-full flex flex-col items-center justify-center text-sm ${isParameterActive('cuisine', 'italian') ? 'active' : 'bg-gray-400 text-white'}`}>
//         <FaPizzaSlice className='text-lg'/> {/* Zwiększ rozmiar ikony */}
//         <span>Italian</span> {/* Tekst w kontenerze span dla lepszego zarządzania stylem */}
//     </button>
//
//
//     {/* Przycisk wyszukiwania */}
//     <button type="submit" className="px-4 py-2 rounded bg-green-500 text-white">
//         Search
//     </button>
// </FormStyle>
// const FormStyle = styled.form`
//     margin: 2rem 10rem;
//
//     div {
//         position: relative;
//         width: 100%;
//     }
//
//     input {
//         border: none;
//         background: linear-gradient(35deg, #494949, #313131);
//         font-size: 1.5rem;
//         color: #fff;
//         padding: 1rem 3rem;
//         border: none;
//         border-radius: 5rem;
//         outline: none;
//         width: 100%;
//     }
//
//     .small {
//         font-size: 1rem;
//         width: 30%;
//     }
//
//     .search {
//         position: absolute;
//         top: 50%;
//         left: 0%;
//         transform: translate(100%, -50%);
//         color: #fff;
//
//     }
//
//     .icon {
//         color: #ffff;
//         font-size: 1.5rem;
//     }
//
//     .active {
//         background: linear-gradient(to right, #e17532, #ec3107);
//         color: #ffff;
//     }
// `;
//
