import React, { useState } from 'react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ButtonStyling from '../ButtonStyling';

function DoctorSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    const doctorsRef = collection(db, 'doctors');
    const q = query(
      doctorsRef,
      where('specialization', '>=', searchTerm),
      where('specialization', '<=', searchTerm + '\uf8ff')
    );

    const querySnapshot = await getDocs(q);
    const doctors = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setSearchResults(doctors);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-[#EFEFED]">Find a Doctor</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by specialization"
          className="flex-grow p-2 bg-[#262A36] text-[#EFEFED] rounded-l"
        />
        <ButtonStyling text="Search" onClick={handleSearch} className="rounded-l-none" />
      </div>
      <div className="bg-[#171B26] p-4 rounded-lg">
        {searchResults.map(doctor => (
          <div key={doctor.id} className="mb-2 p-2 bg-[#262A36] rounded">
            <h3 className="text-lg font-semibold text-[#EFEFED]">{doctor.fullName}</h3>
            <p className="text-[#EFEFED]">Specialization: {doctor.specialization}</p>
            <p className="text-[#EFEFED]">Location: {doctor.location}</p>
            <ButtonStyling text="Book Appointment" onClick={() => {/* Implement booking logic */}} className="mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorSearch;