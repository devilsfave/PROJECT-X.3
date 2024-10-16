import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  FacebookAuthProvider, 
  signInWithCredential, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyA31h_KyFq8MbwzJt5NKZWZMTkFcqrI6nQ",
  authDomain: "dermaviosion-ai.firebaseapp.com",
  projectId: "dermaviosion-ai",
  storageBucket: "dermaviosion-ai.appspot.com",
  messagingSenderId: "537710907865",
  appId: "1:537710907865:android:a3fb336ef1826ecdd789c8",
  measurementId: "G-XXXXXXX"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app); // For authentication
export const db = getFirestore(app); // For Firestore

// Function to sign in with Facebook
export const signInWithFacebookCredential = async (accessToken) => {
  const credential = FacebookAuthProvider.credential(accessToken);
  try {
    const result = await signInWithCredential(auth, credential);
    return result.user;  // Return the user object
  } catch (error) {
    console.error('Error signing in with Facebook:', error);
    throw error;  // Throw error to be handled in the UI
  }
};

// Function to reset the user's password via email
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert('Password reset email sent. Please check your inbox.');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Function to save analysis results to Firestore
export const saveAnalysisToFirestore = async (prediction, imageUri) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently logged in.');
    }

    const analysisData = {
      userId: user.uid,       // The UID of the current user
      prediction,             // The prediction results from the analysis
      imageUri,               // The URI of the analyzed image
      timestamp: serverTimestamp(),  // Timestamp for when the analysis is saved
    };

    // Save the analysis data to the "analyses" collection in Firestore
    const docRef = await addDoc(collection(db, 'analyses'), analysisData);
    console.log('Analysis saved with document ID:', docRef.id);
    return docRef.id;  // Return the ID of the saved document
  } catch (error) {
    console.error('Error saving analysis to Firestore:', error);
    throw error;
  }
};
