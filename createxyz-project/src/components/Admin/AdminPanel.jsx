import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../Firebase/config';
import ButtonStyling from '../ButtonStyling';

function AdminPanel({ user }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUnverifiedDoctors();
  }, []);

  const loadUnverifiedDoctors = async () => {
    try {
      const q = query(collection(db, 'doctors'), where('isVerified', '==', false));
      const querySnapshot = await getDocs(q);
      const unverifiedDoctors = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDoctors(unverifiedDoctors);
    } catch (error) {
      console.error('Error loading unverified doctors:', error);
      alert('Failed to load unverified doctors.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDoctor = async (doctorId) => {
    try {
      await updateDoc(doc(db, 'doctors', doctorId), { isVerified: true });
      alert('Doctor verified successfully.');
      loadUnverifiedDoctors();
    } catch (error) {
      console.error('Error verifying doctor:', error);
      alert('Failed to verify doctor.');
    }
  };

  const handleRejectDoctor = async (doctorId) => {
    try {
      await deleteDoc(doc(db, 'doctors', doctorId));
      alert('Doctor rejected and deleted successfully.');
      loadUnverifiedDoctors();
    } catch (error) {
      console.error('Error rejecting doctor:', error);
      alert('Failed to reject doctor.');
    }
  };

  if (user.email !== 'herbertyeboah123@gmail.com') {
    return (
      <div className="p-4 bg-[#171B26] text-[#EFEFED]">
        <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center text-[#EFEFED]">Loading...</div>;
  }

  return (
    <div className="p-4 bg-[#171B26] text-[#EFEFED]">
      <h1 className="text-2xl font-bold mb-4">Admin Panel - Unverified Doctors</h1>
      {doctors.length === 0 ? (
        <p>No unverified doctors available</p>
      ) : (
        <div>
          {doctors.map(doctor => (
            <div key={doctor.id} className="mb-4 p-2 border border-[#262A36] rounded">
              <h3 className="text-lg font-bold">{doctor.fullName}</h3>
              <p>{doctor.email}</p>
              <div className="mt-2 flex space-x-2">
                <ButtonStyling 
                  text="Verify" 
                  onClick={() => handleVerifyDoctor(doctor.id)} 
                  className="bg-green-500 hover:bg-green-600"
                />
                <ButtonStyling 
                  text="Reject" 
                  onClick={() => handleRejectDoctor(doctor.id)} 
                  className="bg-red-500 hover:bg-red-600"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;