import React from 'react';
import ButtonStyling from '../ButtonStyling';

function ProfileComponent({ user }) {
  return (
    <section id="profile" className="my-8">
      <h2 className="text-xl mb-4 text-[#EFEFED]">User Profile</h2>
      <div className="bg-[#171B26] p-4 rounded-lg">
        <h3 className="text-lg text-[#EFEFED]">{user.name}</h3>
        <p className="text-[#9C9FA4]">{user.email}</p>
        <ButtonStyling text="Edit Profile" onClick={() => {/* Implement edit profile logic */}} />
      </div>
    </section>
  );
}

export default ProfileComponent;