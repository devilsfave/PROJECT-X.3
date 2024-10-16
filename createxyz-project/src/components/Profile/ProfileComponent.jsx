import React, { useState, useEffect } from 'react';
import ButtonStyling from '../ButtonStyling';
import Link from 'next/link';
import { auth } from '../../Firebase/config'; 
import { signOut } from 'firebase/auth'; 

function ProfileComponent({ user, setUser }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear the user state
      // Redirect to login page or home page after logout
    } catch (error) {
      console.error("Error logging out:", error);
      alert('An error occurred while logging out. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="text-center text-[#EFEFED]">Loading...</div>;
  }

  return (
    <section id="profile" className="my-8 bg-[#262A36]">
      <h2 className="text-2xl font-bold mb-4 text-[#EFEFED]">User Profile</h2>
      <div className="p-4 rounded-lg bg-[#171B26]">
        <img 
          src={user.photoURL || 'https://via.placeholder.com/150'} 
          alt="Profile" 
          className="w-24 h-24 rounded-full mb-4"
        />
        <h3 className="text-lg text-[#EFEFED]">
          Welcome, {user.displayName || user.name}!
        </h3>
        <p className="text-[#9C9FA4]">{user.email}</p>
        
        <div className="mt-4">
          <ButtonStyling text="Edit Profile" onClick={() => {/* Implement edit profile logic */}} />
          <ButtonStyling text="Logout" onClick={handleLogout} />
        </div>

        <div className="mt-4">
          <Link href="/terms-of-service">
            <a className="text-blue-500 hover:underline block mb-2">Terms of Service</a>
          </Link>
          <Link href="/privacy-policy">
            <a className="text-blue-500 hover:underline block">Privacy Policy</a>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ProfileComponent;