import React from 'react';
import Header from './Header';
import Footer from './Footer';

function Layout({ children, user, currentTab, setCurrentTab, setUser, setShowAuth, setMobileMenuOpen }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0D111D]">
      <Header 
        user={user}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        setUser={setUser}
        setShowAuth={setShowAuth}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;