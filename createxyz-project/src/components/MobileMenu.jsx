import React from 'react';

function MobileMenu({ isOpen, setCurrentTab, setMobileMenuOpen }) {
  if (!isOpen) return null;

  return (
    <div className="mobile-menu">
      {/* Mobile menu items */}
    </div>
  );
}

export default MobileMenu;