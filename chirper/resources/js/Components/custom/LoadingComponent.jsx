import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animacja zmieniająca rozmiar i kolor tekstu
const changeSizeAndColor = keyframes`
  0%, 100% {
    font-size: clamp(32px, 5vw, 40px);
    color: #dbe1e8;
  }
  50% {
    font-size: clamp(28px, 4.5vw, 32px);
    color: #009fff;
  }
`;

// Stylowany kontener dla komponentu ładowania
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(106, 114, 117, 0.9);
  z-index: 9999;
`;

// Stylowany tekst
// const LoadingText = styled.p`
//   animation: ${changeSizeAndColor} 2s ease-in-out infinite;
//   font-size: 40px; // Domyślny rozmiar dla dużych ekranów
//
//   @media (max-width: 768px) {
//     font-size: 28px; // Mniejszy rozmiar dla tabletów
//   }
//
//   @media (max-width: 480px) {
//     font-size: 24px; // Jeszcze mniejszy rozmiar dla telefonów
//   }
// `;
// Stylowany tekst
const LoadingText = styled.p`
  animation: ${changeSizeAndColor} 2s ease-in-out infinite;
  position: absolute; // Ustawia tekst absolutnie wewnątrz kontenera
  top: 50%; // Centruje w pionie
  left: 50%; // Centruje w poziomie
  transform: translate(-50%, -50%); // Precyzyjne centrowanie tekstu
  width: 80%; // Maksymalna szerokość tekstu, aby uniknąć wyjścia poza ekran
  text-align: center; // Wyrównuje tekst do środka

  @media (max-width: 768px) {
    font-size: 28px; // Mniejszy rozmiar dla tabletów
  }

  @media (max-width: 480px) {
    font-size: 20px; // Jeszcze mniejszy rozmiar dla telefonów
    width: 90%; // Pozwól tekstu zajmować więcej miejsca na małych ekranach
  }
`;


const LoadingComponent = () => (
    <LoadingContainer>
        <LoadingText>Przygotowujemy Twoje Zamówienie ;D</LoadingText>
    </LoadingContainer>
);

export default LoadingComponent;

// import React from 'react';
// import styled, { keyframes } from 'styled-components';
//
// // Animacja zmieniająca rozmiar i kolor tekstu
// const changeSizeAndColor = keyframes`
//   0% {
//     font-size: 40px;
//     color: #d7dde3;
//   }
//   50% {
//     font-size: 28px;
//     color: #009fff;
//   }
//   100% {
//     font-size: 40px;
//     color: #dbe1e8;
//   }
// `;
//
// // Stylowany kontener dla komponentu ładowania
// const LoadingContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   position: fixed; // Fixed, aby zawsze był na środku ekranu
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: rgba(106, 114, 117, 0.9); // Jasnoniebieskie, półprzezroczyste tło
//   z-index: 9999; // Wysoki z-index, aby być nad innymi elementami
// `;
//
// // Stylowany tekst
// const LoadingText = styled.p`
//   animation: ${changeSizeAndColor} 2s ease-in-out infinite;
// `;
//
// const LoadingComponent = () => (
//     <LoadingContainer>
//         <LoadingText>We are preparing Your Recipe</LoadingText>
//     </LoadingContainer>
// );
//
// export default LoadingComponent;
