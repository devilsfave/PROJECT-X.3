import React, { useState, useEffect } from 'react';
import { db } from '../../Firebase/config';
import ButtonStyling from '../ButtonStyling';
import { collection, query, where, getDocs } from 'firebase/firestore';
import AppointmentBooking from '../Appointment/AppointmentBooking';

function PatientDashboard({ user }) {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('patientId', '==', user.uid),
        where('date', '>=', new Date())
      );

      const querySnapshot = await getDocs(q);
      const appointments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUpcomingAppointments(appointments);
    };

    fetchAppointments();
  }, [user.uid]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-[#EFEFED]">Welcome, {user.name}</h2>
      <div className="bg-[#171B26] p-4 rounded-lg mb-4">
        <h3 className="text-xl font-semibold mb-2 text-[#EFEFED]">Upcoming Appointments</h3>
        {upcomingAppointments.length > 0 ? (
          <ul>
            {upcomingAppointments.map(appointment => (
              <li key={appointment.id} className="mb-2 text-[#EFEFED]">
                {appointment.doctorName} - {new Date(appointment.date.toDate()).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[#EFEFED]">No upcoming appointments</p>
        )}
      </div>
      <ButtonStyling text="Book New Appointment" onClick={() => setSelectedDoctor({ id: 'someDocId', name: 'John Doe' })} />
      <ButtonStyling text="View Skin Analysis History" onClick={() => {/* Implement navigation to analysis history */}} />
      
      {selectedDoctor && (
        <AppointmentBooking 
          user={user} 
          doctorId={selectedDoctor.id} 
          doctorName={selectedDoctor.name} 
        />
      )}
    </div>
  );
}

export default PatientDashboard;