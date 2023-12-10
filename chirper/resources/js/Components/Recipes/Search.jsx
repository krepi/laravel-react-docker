import styled from "styled-components";
import {useState} from "react";
import {FaSearch, FaPizzaSlice} from "react-icons/fa";
import {Inertia} from "@inertiajs/inertia";


export default function Search() {

    const [searchTerm, setSearchTerm] = useState('');
    //
    // const handleSearch = (e) => {
    //     e.preventDefault();
    //     if (searchTerm.trim()) {
    //         Inertia.post('/search', { term: searchTerm.trim() });
    //     }
    // };
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [parameters, setParameters] = useState({maxProtein: '', minProtein: '', maxFat: ''});

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
        <FormStyle onSubmit={handleSearch}>
            <div>
                <FaSearch className='search'></FaSearch>
                <input
                    onChange={(e) => setSearchTerm(e.target.value)}
                    type="text"
                    value={searchTerm}
                    placeholder="Wpisz szukany przepis"
                />
            </div>
            {/*        <button type="button" onClick={() => toggleOption('pasta')}*/}
            {/*                className={`m-4 px-4 py-2 rounded ${isActive('pasta') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>*/}
            {/*            Makaron*/}
            {/*        </button>*/}
            {/*        <button type="button" onClick={() => toggleOption('chicken')}*/}
            {/*                className={`m-4 px-4 py-2 rounded ${isActive('chicken') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>*/}
            {/*Kurczak*/}
            {/*        </button>*/}
            {/*        <button type="button" onClick={() => toggleOption('lunch')}*/}
            {/*                className={`m-4 px-4 py-2 rounded ${isActive('lunch') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>*/}
            {/*           lunch*/}
            {/*        </button>*/}
            {/*        <button type="button" onClick={() => toggleOption('pork')}*/}
            {/*                className={`m-4 px-4 py-2 rounded ${isActive('pork') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>*/}
            {/*           swinia*/}
            {/*        </button>*/}
            {/* ... więcej przycisków ... */}

            <input type="text" placeholder="Max Protein (g)"
                   onChange={(e) => updateParameter('maxProtein', e.target.value)}
                   className="px-2 py-1 m-2 rounded border small"/>
            <input type="text" placeholder="Min Protein (g)"
                   onChange={(e) => updateParameter('minProtein', e.target.value)}
                   className="px-2 m-2 py-1 rounded border small"/>
            <input type="text" placeholder="Max Fat (g)"
                   onChange={(e) => updateParameter('maxFat', e.target.value)}
                   className="px-2 m-2 py-1 rounded border small"/>
            <button
                type="button"
                onClick={() => toggleParameterOption('diet', 'vegan')}
                className={`m-4 px-4 py-2 rounded ${isParameterActive('diet', 'vegan') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                Vegan
            </button>

            <button
                type="button"
                onClick={() => toggleParameterOption('diet', 'gluten-free')}
                className={`m-4 px-4 py-2 rounded ${isParameterActive('diet', 'gluten-free') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                Gluten free
            </button>
            <button
                type="button"
                onClick={() => toggleParameterOption('cuisine', 'italian')}
                className={`m-4 px-4 py-2 rounded ${isParameterActive('cuisine', 'italian') ? 'active' : 'bg-gray-200'}`}>
                <FaPizzaSlice className='icon'/>Italian
            </button>
            {/* Przycisk wyszukiwania */}
            <button type="submit" className="px-4 py-2 rounded bg-green-500 text-white">
                Search
            </button>
        </FormStyle>
    );
}


const FormStyle = styled.form`
    margin: 2rem 10rem;

    div {
        position: relative;
        width: 100%;
    }

    input {
        border: none;
        background: linear-gradient(35deg, #494949, #313131);
        font-size: 1.5rem;
        color: #fff;
        padding: 1rem 3rem;
        border: none;
        border-radius: 5rem;
        outline: none;
        width: 100%;
    }

    .small {
        font-size: 1rem;
        width: 30%;
    }

    .search {
        position: absolute;
        top: 50%;
        left: 0%;
        transform: translate(100%, -50%);
        color: #fff;

    }

    .icon {
        color: #ffff;
        font-size: 1.5rem;
    }

    .active {
        background: linear-gradient(to right, #e17532, #ec3107);
        color: #ffff;
    }
`;


