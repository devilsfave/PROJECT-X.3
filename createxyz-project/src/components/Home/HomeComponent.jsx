import React from 'react';
import ButtonStyling from '../ButtonStyling';

function HomeComponent({ setCurrentTab, setShowCamera }) {
  return (
    <section id="home" className="my-8">
      <h2 className="text-xl mb-4 text-[#EFEFED]">Welcome to DermaVision AI</h2>
      <p className="mb-4 text-[#EFEFED]">
        Take control of your skin health with our AI-powered analysis.
      </p>
      <ButtonStyling text="Scan Now" onClick={() => setShowCamera(true)} />
    </section>
  );
}

export default HomeComponent;