import { db } from '../Firebase/config';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc, 
  setDoc,
  updateDoc,
  orderBy
} from 'firebase/firestore';

// Function to save analysis to Firestore
export const saveAnalysisToFirestore = async (prediction, imageUri, userId) => {
  try {
    const historyItem = {
      date: new Date().toISOString(),
      prediction,
      imageUri,
    };
    const userHistoryRef = collection(db, 'users', userId, 'analysisHistory');
    await addDoc(userHistoryRef, historyItem);
  } catch (error) {
    console.error('Error saving analysis to Firestore:', error);
    throw error;
  }
};

// Function to load analysis history from Firestore
export const loadAnalysisHistoryFromFirestore = async (userId) => {
  try {
    const userHistoryRef = collection(db, 'users', userId, 'analysisHistory');
    const q = query(userHistoryRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error loading analysis history from Firestore:', error);
    throw error;
  }
};

// Function to delete a specific analysis from Firestore
export const deleteAnalysisFromFirestore = async (userId, documentId) => {
  try {
    const docRef = doc(db, 'users', userId, 'analysisHistory', documentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting analysis from Firestore:', error);
    throw error;
  }
};

// Function to delete all analyses from Firestore
export const deleteAllAnalysesFromFirestore = async (userId) => {
  try {
    const userHistoryRef = collection(db, 'users', userId, 'analysisHistory');
    const snapshot = await getDocs(userHistoryRef);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error clearing analysis history from Firestore:', error);
    throw error;
  }
};

// Function to fetch unverified doctors from Firestore
export const fetchUnverifiedDoctors = async (filter = {}) => {
  try {
    let q = query(
      collection(db, 'users'),
      where('role', '==', 'doctor'),
      where('verificationStatus', '==', 'pending')
    );

    if (filter.specialization) {
      q = query(q, where('specialization', '==', filter.specialization));
    }

    if (filter.location) {
      q = query(q, where('location', '==', filter.location));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      rating: doc.data().rating || 0,
    }));
  } catch (error) {
    console.error('Error fetching unverified doctors:', error);
    throw error;
  }
};

// Function to verify a doctor in Firestore
export const verifyDoctorInFirestore = async (doctorId) => {
  try {
    const docRef = doc(db, 'users', doctorId);
    await updateDoc(docRef, { verificationStatus: 'approved' });
  } catch (error) {
    console.error('Error verifying doctor:', error);
    throw error;
  }
};

// Function to search doctors
export const searchDoctors = async (searchTerm) => {
  try {
    const doctorsRef = collection(db, 'users');
    const q = query(
      doctorsRef,
      where('role', '==', 'doctor'),
      where('verificationStatus', '==', 'approved'),
      where('specialization', '>=', searchTerm),
      where('specialization', '<=', searchTerm + '\uf8ff')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error searching doctors:', error);
    throw error;
  }
};