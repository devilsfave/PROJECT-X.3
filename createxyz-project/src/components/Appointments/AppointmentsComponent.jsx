import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../Firebase/config';
import ButtonStyling from '../ButtonStyling';
import { useRouter } from 'next/router';

function AppointmentBooking({ user }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [appointments, setAppointments] = useState([]);
  
  // Use router to get doctorId and doctorName from the query parameters
  const router = useRouter();
  const { doctorId, doctorName } = router.query; // Fetching from URL parameters

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const q = query(collection(db, 'appointments'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedAppointments = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const handleBookAppointment = async () => {
    if (!date || !time) {
      alert('Please select both date and time.');
      return;
    }

    try {
      const appointmentData = {
        doctorId,  // use doctorId from query
        userId: user.uid,
        date,
        time,
      };

      await addDoc(collection(db, 'appointments'), appointmentData);

      alert(`Appointment booked with Dr. ${doctorName} on ${date} at ${time}.`);
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment.');
    }
  };

  const handleCancelAppointment = async (id) => {
    try {
      await deleteDoc(doc(db, 'appointments', id));
      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
      alert('Appointment canceled successfully.');
    } catch (error) {
      console.error('Error canceling appointment:', error);
      alert('Failed to cancel appointment.');
    }
  };

  return (
    <div className="p-4 bg-[#171B26] rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-[#EFEFED]">
        Book Appointment with Dr. {doctorName ? doctorName : 'Select a Doctor'}
      </h2>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 mb-2 bg-[#262A36] text-[#EFEFED] rounded"
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full p-2 mb-4 bg-[#262A36] text-[#EFEFED] rounded"
      />
      <ButtonStyling text="Book Appointment" onClick={handleBookAppointment} />

      <h3 className="text-xl font-semibold mt-6 mb-2 text-[#EFEFED]">Your Appointments:</h3>
      {appointments.map((appointment) => (
        <div key={appointment.id} className="mb-2 p-2 bg-[#262A36] rounded">
          <p className="text-[#EFEFED]">
            {`${new Date(appointment.date).toLocaleDateString()} at ${appointment.time} with Dr. ${appointment.doctorId}`}
          </p>
          <ButtonStyling text="Cancel" onClick={() => handleCancelAppointment(appointment.id)} variant="secondary" />
        </div>
      ))}
    </div>
  );
}

export default AppointmentBooking;
//