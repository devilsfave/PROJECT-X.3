import React from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ButtonStyling from '../ButtonStyling';

function AuthComponent({ setUser, activeTab, setActiveTab }) {
  const toggleTab = () => {
    setActiveTab(activeTab === 'login' ? 'register' : 'login');
  };

  return (
    <div className="bg-[#171B26] p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <div className="flex justify-between mb-6">
        <ButtonStyling
          text="Login"
          onClick={() => setActiveTab('login')}
          variant={activeTab === 'login' ? 'primary' : 'secondary'}
        />
        <ButtonStyling
          text="Register"
          onClick={() => setActiveTab('register')}
          variant={activeTab === 'register' ? 'primary' : 'secondary'}
        />
      </div>
      {activeTab === 'login' ? (
        <LoginForm setUser={setUser} />
      ) : (
        <RegisterForm setUser={setUser} />
      )}
      <p className="mt-4 text-center text-[#EFEFED]">
        {activeTab === 'login' ? "Don't have an account?" : "Already have an account?"}
        <button onClick={toggleTab} className="ml-2 text-[#4A90E2] hover:underline">
          {activeTab === 'login' ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
}

export default AuthComponent;