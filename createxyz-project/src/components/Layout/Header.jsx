import React from 'react';
import ButtonStyling from '../ButtonStyling';

function Header({ user, currentTab, setCurrentTab, setUser, setShowAuth, setMobileMenuOpen }) {
  const navigationItems = [
    { name: 'Home', tab: 'home', roles: ['patient', 'doctor'] },
    { name: 'Analysis', tab: 'analysis', roles: ['patient'] },
    { name: 'Appointments', tab: 'appointments', roles: ['patient', 'doctor'] },
    { name: 'Education', tab: 'education', roles: ['patient', 'doctor'] },
    { name: 'Dashboard', tab: 'dashboard', roles: ['patient', 'doctor'] },
    { name: 'Profile', tab: 'profile', roles: ['patient', 'doctor'] },
  ];

  return (
    <header className="p-4 border-b border-[#262A36]">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl text-[#EFEFED] font-bold">DermaVision AI</h1>
        {user && (
          <>
            <nav className="hidden md:flex space-x-4">
              {navigationItems.map((item) => (
                item.roles.includes(user.role) && (
                  <ButtonStyling
                    key={item.tab}
                    text={item.name}
                    onClick={() => setCurrentTab(item.tab)}
                    className={`${currentTab === item.tab ? 'bg-[#3B82F6]' : 'bg-transparent'} px-3 py-2`}
                  />
                )
              ))}
            </nav>
            <button
              className="md:hidden text-[#EFEFED]"
              onClick={() => setMobileMenuOpen(prev => !prev)}
            >
              <i className={`fas ${setMobileMenuOpen ? "fa-times" : "fa-bars"} text-2xl`}></i>
            </button>
          </>
        )}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-[#EFEFED] hidden md:inline">Welcome, {user.name}</span>
              <ButtonStyling 
                text="Logout" 
                onClick={() => {
                  setUser(null);
                  setCurrentTab('home');
                }} 
              />
            </>
          ) : (
            <ButtonStyling
              text="Login"
              onClick={() => setShowAuth(true)}
              className="animate-pulse"
            />
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;