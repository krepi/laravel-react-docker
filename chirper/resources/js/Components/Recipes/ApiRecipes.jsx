import { Splide, SplideSlide } from "@splidejs/react-splide";
import { Link } from "@inertiajs/react";
import React from "react";
import {LuVegan, LuWheatOff} from "react-icons/lu";
import {FaSave} from "react-icons/fa";

export default function ApiRecipes({ apiRecipes, error }) {
    console.log(apiRecipes)
    return (
        <div className="max-w-8xl mx-auto px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow rounded-lg p-4 my-4">
                <h2 className="text-2xl font-semibold">Smaki, które podbijają serca</h2>
                <p>Odkryj przepisy, które właśnie zyskują popularność w naszej społeczności. Zainspiruj się najnowszymi trendami kulinarnymi i spróbuj czegoś nowego już dziś! Od egzotycznych dań po domowe klasyki, znajdź coś, co rozgrzeje Twoje serce i podniebienie.</p>
                <div className="mt-8">
                    {error && <div className="text-red-500">{error}</div>}
                    <Splide options={{
                        perPage: 3,
                        breakpoints: {
                            980: {
                                perPage: 2,
                            },
                            640: {
                                perPage: 1,
                            },
                        },
                        arrows: false,
                        pagination: true,
                        drag: 'free',
                        gap: '20px',
                    }}>
                        {apiRecipes &&
                            apiRecipes.map(apiRecipe => (
                                <SplideSlide key={apiRecipe.id} className='mb-4'>
                                    <div className="relative min-h-64 rounded overflow-hidden">
                                        <Link href={`/recipe/${apiRecipe.id}`}>
                                            <div className="relative h-64 rounded-xl overflow-hidden">
                                            <p className="absolute z-10 text-white text-lg font-semibold text-center w-full bottom-0 pb-4">{apiRecipe.title}</p>
                                            <img src={apiRecipe.image || '/images/recipes/placeholder.jpg'} alt="" className="absolute inset-0 w-full h-full object-cover"/>
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
                                            </div>
                                            <div className="absolute top-2 right-2 flex ">

                                                {apiRecipe.vegan && (
                                                    <div>
                                                        <LuVegan size={36} className="text-green-400"/>
                                                    </div>
                                                )}
                                                {apiRecipe.glutenFree && (
                                                    <div>
                                                        <LuWheatOff size={36} className="text-yellow-500 font-bold"/>
                                                    </div>
                                                )}
                                                {apiRecipe.is_saved && (

                                                    <div>
                                                        <FaSave size={36} className="text-gray-500"/>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    </div>
                                </SplideSlide>
                            ))}
                    </Splide>
                </div>
            </div>
        </div>
    )
}




// import {Splide, SplideSlide} from "@splidejs/react-splide";
// import {Link} from "@inertiajs/react";
// import React from "react";
// import styled from "styled-components";
//
//
// export default function ApiRecipes({apiRecipes,error}) {
//     return (
//         <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
//
//             <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg px-4 py-4 my-4">
//                 <h2>Ostatnio modne</h2>
//                 <Wrapper>
//                     {error && <div className="alert alert-danger">{error}</div>}
//                     <Splide options={{
//                         perPage: 3,
//                         breakpoints: {
//                             980: {
//                                 perPage: 2,
//                             },
//                             640: {
//                                 perPage: 1,
//                             },
//
//                         },
//                         arrows: false,
//                         pagination: true,
//                         drag: 'free',
//                         gap: '5rem',
//                     }}>
//                         {apiRecipes &&
//                             apiRecipes.map(apiRecipe => (
//                                 <SplideSlide key={apiRecipe.id} className='mb-4 '>
//                                     <Card>
//                                         <Link href={`/recipe/${apiRecipe.id}`}>
//                                             <p className='text-xl'>
//                                                 {apiRecipe.title}
//                                             </p>
//                                             <img src={apiRecipe.image || '/images/recipes/placeholder.jpg'} alt=""/>
//                                             <Gradient/>
//                                         </Link>
//                                     </Card>
//                                 </SplideSlide>
//                             ))}
//                     </Splide>
//                 </Wrapper>
//             </div>
//         </div>
//     )
// }
// const Wrapper = styled.div`
//     margin: 4rem 0rem;
// `;
// const Card = styled.div`
//     min-height: 25rem;
//     border-radius: 2rem;
//     overflow: hidden;
//     position: relative;
//
//     img {
//         border-radius: 2rem;
//         position: absolute;
//         left: 0;
//         width: 100%;
//         height: 100%;
//         object-fit: cover;
//     }
//
//     p {
//         position: absolute;
//         z-index: 10;
//         left: 50%;
//         bottom: 0%;
//         transform: translate(-50%, 0%);
//         color: #fff;
//         width: 100%;
//         text-align: center;
//         font-weight: 600;
//         font-size: 1.5rem;
//         height: 40%;
//         display: flex;
//         justify-content: center;
//         align-items: center;
//     }
// `;
// const Gradient = styled.div`
//     z-index: 3;
//     position: absolute;
//     width: 100%;
//     height: 100%;
//     background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
//
// `;
