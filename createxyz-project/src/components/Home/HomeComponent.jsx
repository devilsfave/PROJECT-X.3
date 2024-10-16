import React from 'react';
import ButtonStyling from '../ButtonStyling';

function HomeComponent({ setCurrentTab, setShowCamera, user }) {
  return (
    <section id="home" className="my-8">
      <h2 className="text-3xl font-bold mb-6 text-[#EFEFED]">Welcome to DermaVision AI</h2>
      <p className="mb-6 text-lg text-[#EFEFED]">
        Take control of your skin health with our AI-powered analysis and comprehensive healthcare services.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ButtonStyling 
          text="Skin Analysis" 
          onClick={() => setShowCamera(true)} 
          className="w-full"
        />
        <ButtonStyling 
          text="Appointments" 
          onClick={() => setCurrentTab('appointments')} 
          className="w-full"
        />
        <ButtonStyling 
          text="Education Center" 
          onClick={() => setCurrentTab('education')} 
          className="w-full"
        />
        <ButtonStyling 
          text="My Profile" 
          onClick={() => setCurrentTab('profile')} 
          className="w-full"
        />
        {user && user.role === 'doctor' && (
          <ButtonStyling 
            text="Doctor Dashboard" 
            onClick={() => setCurrentTab('doctorDashboard')} 
            className="w-full"
          />
        )}
        {user && user.role === 'patient' && (
          <ButtonStyling 
            text="Patient Dashboard" 
            onClick={() => setCurrentTab('patientDashboard')} 
            className="w-full"
          />
        )}
      </div>
    </section>
  );
}

export default HomeComponent;