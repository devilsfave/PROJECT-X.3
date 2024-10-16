import React from 'react';
import ButtonStyling from './ButtonStyling';

function MobileMenu({ isOpen, setCurrentTab, setMobileMenuOpen, user }) {
  if (!isOpen) return null;

  const navigationItems = [
    { name: 'Home', tab: 'home', roles: ['patient', 'doctor'] },
    { name: 'Analysis', tab: 'analysis', roles: ['patient'] },
    { name: 'Appointments', tab: 'appointments', roles: ['patient', 'doctor'] },
    { name: 'Education', tab: 'education', roles: ['patient', 'doctor'] },
    { name: 'Dashboard', tab: 'dashboard', roles: ['patient', 'doctor'] },
    { name: 'Profile', tab: 'profile', roles: ['patient', 'doctor'] },
  ];

  const handleNavClick = (tab) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0D111D] bg-opacity-95">
      <div className="flex flex-col items-center justify-center h-full">
        <button
          className="absolute top-4 right-4 text-[#EFEFED]"
          onClick={() => setMobileMenuOpen(false)}
        >
          <i className="fas fa-times text-2xl"></i>
        </button>
        <nav className="flex flex-col space-y-4">
          {navigationItems.map((item) => (
            user && user.role && item.roles.includes(user.role) && (
              <ButtonStyling
                key={item.tab}
                text={item.name}
                onClick={() => handleNavClick(item.tab)}
                className="w-full text-xl py-3"
              />
            )
          ))}
        </nav>
      </div>
    </div>
  );
}

export default MobileMenu;