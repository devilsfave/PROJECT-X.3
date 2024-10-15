import React from 'react';
import ButtonStyling from '../ButtonStyling';

function DoctorListComponent() {
  const doctors = [
    { id: 1, name: "Dr. John Doe", specialty: "Dermatologist" },
    { id: 2, name: "Dr. Jane Smith", specialty: "Dermatologist" },
    // Add more doctors as needed
  ];

  return (
    <section id="doctor-list" className="my-8">
      <h2 className="text-xl mb-4 text-[#EFEFED]">Available Doctors</h2>
      <div className="bg-[#171B26] p-4 rounded-lg">
        {doctors.map(doctor => (
          <div key={doctor.id} className="mb-4 p-2 border border-[#262A36] rounded">
            <h3 className="text-lg text-[#EFEFED]">{doctor.name}</h3>
            <p className="text-[#9C9FA4]">{doctor.specialty}</p>
            <ButtonStyling text="Book Appointment" onClick={() => {/* Implement booking logic */}} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default DoctorListComponent;