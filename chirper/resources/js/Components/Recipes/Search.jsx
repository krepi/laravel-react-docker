import styled from "styled-components";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import {Inertia} from "@inertiajs/inertia";

export default function Search() {

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            Inertia.post('/search', { term: searchTerm.trim() });
        }
    };

    return (
        <FormStyle onSubmit={handleSearch} >
            <div>
                <FaSearch></FaSearch>
                <input
                    onChange={(e) => setSearchTerm(e.target.value)}
                    type="text"
                    value={searchTerm}
                />
            </div>
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
  svg {
    position: absolute;
    top: 50%;
    left: 0%;
    transform: translate(100%, -50%);
    color: #fff;
  }
`;


