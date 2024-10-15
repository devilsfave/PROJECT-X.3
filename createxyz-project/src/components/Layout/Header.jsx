import React from 'react';
import ButtonStyling from '../ButtonStyling';

function Header({ user, currentTab, setCurrentTab, setUser, setShowAuth, setMobileMenuOpen }) {
  return (
    <header className="p-4 border-b border-[#262A36]">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl text-[#EFEFED]">DermaVision AI</h1>
        {user && (
          <>
            <nav className="hidden md:block">
              {/* Navigation items */}
            </nav>
            <button
              className="md:hidden text-[#EFEFED]"
              onClick={() => setMobileMenuOpen(prev => !prev)}
            >
              <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"} text-2xl`}></i>
            </button>
          </>
        )}
        <div className="flex items-center space-x-4">
          {user ? (
            <ButtonStyling text="Logout" onClick={() => setUser(null)} />
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