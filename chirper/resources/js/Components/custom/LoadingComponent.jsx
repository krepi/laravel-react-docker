import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animacja zmieniająca rozmiar i kolor tekstu
const changeSizeAndColor = keyframes`
  0% {
    font-size: 40px;
    color: #007bff;
  }
  50% {
    font-size: 28px;
    color: #009fff;
  }
  100% {
    font-size: 40px;
    color: #007bff;
  }
`;

// Stylowany kontener dla komponentu ładowania
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed; // Fixed, aby zawsze był na środku ekranu
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(173, 216, 230, 0.9); // Jasnoniebieskie, półprzezroczyste tło
  z-index: 9999; // Wysoki z-index, aby być nad innymi elementami
`;

// Stylowany tekst
const LoadingText = styled.p`
  animation: ${changeSizeAndColor} 2s ease-in-out infinite;
`;

const LoadingComponent = () => (
    <LoadingContainer>
        <LoadingText>We are preparing Your Recipe</LoadingText>
    </LoadingContainer>
);

export default LoadingComponent;
