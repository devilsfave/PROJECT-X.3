import { db } from '../../Firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import ButtonStyling from '../ButtonStyling';
import AppointmentBooking from '../Appointment/AppointmentBooking';

function DoctorDashboard({ user }) {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('doctorId', '==', user.uid),
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
      <h2 className="text-2xl font-bold mb-4 text-[#EFEFED]">Welcome, Dr. {user.name}</h2>
      <div className="bg-[#171B26] p-4 rounded-lg mb-4">
        <h3 className="text-xl font-semibold mb-2 text-[#EFEFED]">Upcoming Appointments</h3>
        {upcomingAppointments.length > 0 ? (
          <ul>
            {upcomingAppointments.map(appointment => (
              <li key={appointment.id} className="mb-2 text-[#EFEFED]">
                {appointment.patientName} - {new Date(appointment.date.toDate()).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[#EFEFED]">No upcoming appointments</p>
        )}
      </div>
      <ButtonStyling text="View Patient Records" onClick={() => {/* Implement navigation to patient records */}} />
      <ButtonStyling text="Manage Availability" onClick={() => {/* Implement navigation to availability management */}} />
      
      <AppointmentBooking 
        user={user} 
        doctorId={user.uid} 
        doctorName={user.name} 
      />
    </div>
  );
}

export default DoctorDashboard;