import React from 'react';
import ButtonStyling from '../ButtonStyling';

function HomeComponent({ setCurrentTab, setShowCamera, user }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section id="home" className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-6 text-[#EFEFED]">Welcome to DermaVision AI</h1>
          <p className="mb-8 text-xl text-[#EFEFED]">
            Take control of your skin health with our AI-powered analysis and comprehensive healthcare services.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ButtonStyling 
              text="Skin Analysis" 
              onClick={() => setShowCamera(true)} 
              className="w-full text-lg py-3"
            />
            <ButtonStyling 
              text="Appointments" 
              onClick={() => setCurrentTab('appointments')} 
              className="w-full text-lg py-3"
            />
            <ButtonStyling 
              text="Education Center" 
              onClick={() => setCurrentTab('education')} 
              className="w-full text-lg py-3"
            />
            <ButtonStyling 
              text="My Profile" 
              onClick={() => setCurrentTab('profile')} 
              className="w-full text-lg py-3"
            />
            {user && user.role === 'doctor' && (
              <ButtonStyling 
                text="Doctor Dashboard" 
                onClick={() => setCurrentTab('doctorDashboard')} 
                className="w-full text-lg py-3"
              />
            )}
            {user && user.role === 'patient' && (
              <ButtonStyling 
                text="Patient Dashboard" 
                onClick={() => setCurrentTab('patientDashboard')} 
                className="w-full text-lg py-3"
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomeComponent;