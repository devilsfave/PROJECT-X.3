import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  FacebookAuthProvider, 
  signInWithCredential, 
  sendPasswordResetEmail // Import the password reset function
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Firestore import

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
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
