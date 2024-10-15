import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  FacebookAuthProvider, 
  signInWithCredential, 
  sendPasswordResetEmail // Import the password reset function
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Firestore import

const firebaseConfig = {
  apiKey: "AIzaSyA31h_KyFq8MbwzJt5NKZWZMTkFcqrI6nQ",
  authDomain: "dermaviosion-ai.firebaseapp.com",
  projectId: "dermaviosion-ai",
  storageBucket: "dermaviosion-ai.appspot.com",
  messagingSenderId: "537710907865",
  appId: "1:537710907865:android:a3fb336ef1826ecdd789c8",
  measurementId: "G-XXXXXXX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Exporting auth for authentication
export const db = getFirestore(app); // Exporting db for Firestore access

// Function to sign in with Facebook
export const signInWithFacebookCredential = async (accessToken) => {
  const credential = FacebookAuthProvider.credential(accessToken);
  try {
    const result = await signInWithCredential(auth, credential);
    // Handle the signed-in user
    return result.user;
  } catch (error) {
    // Handle errors
    throw error;
  }
};

// Function to reset the user's password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert('Password reset email sent. Please check your inbox.');
  } catch (error) {
    // Handle errors
    throw error;
  }
};
