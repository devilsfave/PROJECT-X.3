import React, { useState, useEffect } from 'react';
import ButtonStyling from '../ButtonStyling';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../Firebase/config';
import { useRouter } from 'next/router';
import { searchDoctors } from '../../services/FirestoreService';

function DoctorListComponent() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();

  // Fetch doctors from Firestore on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const doctorsRef = collection(db, 'doctors');
      const q = query(doctorsRef, where("verified", "==", true));
      const querySnapshot = await getDocs(q);
      const doctorList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDoctors(doctorList);
      setFilteredDoctors(doctorList);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search based on text input
  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(text.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(text.toLowerCase()) ||
        doctor.location.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  // Handle search using Firestore service
  const handleSearchBySpecialization = async () => {
    try {
      const doctors = await searchDoctors(searchTerm);
      setSearchResults(doctors);
    } catch (error) {
      console.error('Error searching doctors:', error);
    }
  };

  const handleBookAppointment = (doctorId, doctorName) => {
    router.push({
      pathname: '/appointments',
      query: { doctorId, doctorName }
    });
  };

  if (loading) {
    return <div className="text-center text-[#EFEFED]">Loading...</div>;
  }

  return (
    <section id="doctor-list" className="my-8">
      <h2 className="text-2xl font-bold mb-4 text-[#EFEFED]">Find a Dermatologist</h2>

      {/* Search by name, specialization, or location */}
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 bg-[#262A36] text-[#EFEFED] rounded"
          placeholder="Search by name, specialization, or location"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Search by specialization */}
      <div className="flex mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by specialization"
          className="flex-grow p-2 bg-[#262A36] text-[#EFEFED] rounded-l"
        />
        <ButtonStyling text="Search" onClick={handleSearchBySpecialization} className="rounded-l-none" />
      </div>

      {/* Display search results */}
      <div className="bg-[#171B26] p-4 rounded-lg">
        {searchResults.length > 0 ? (
          searchResults.map(doctor => (
            <div key={doctor.id} className="mb-4 p-2 border border-[#262A36] rounded">
              <h3 className="text-lg font-bold text-[#EFEFED]">{doctor.fullName}</h3>
              <p className="text-[#9C9FA4]">Specialization: {doctor.specialization}</p>
              <p className="text-[#9C9FA4]">Location: {doctor.location}</p>
              <ButtonStyling 
                text="Book Appointment" 
                onClick={() => handleBookAppointment(doctor.id, doctor.fullName)} 
                className="mt-2" 
              />
            </div>
          ))
        ) : filteredDoctors.length === 0 ? (
          <p className="text-center text-[#EFEFED]">No doctors found</p>
        ) : (
          filteredDoctors.map(doctor => (
            <div key={doctor.id} className="mb-4 p-2 border border-[#262A36] rounded">
              <h3 className="text-lg font-bold text-[#EFEFED]">{doctor.name}</h3>
              <p className="text-[#9C9FA4]">{doctor.specialization}</p>
              <p className="text-[#9C9FA4]">{doctor.location}</p>
              <div className="flex items-center mt-2">
                <span className="text-yellow-400 mr-1">⭐</span>
                <span className="text-[#EFEFED]">{doctor.rating?.toFixed(1) || 'N/A'}</span>
              </div>
              <ButtonStyling 
                text="Book Appointment" 
                onClick={() => handleBookAppointment(doctor.id, doctor.name)} 
                className="mt-2" 
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default DoctorListComponent;
