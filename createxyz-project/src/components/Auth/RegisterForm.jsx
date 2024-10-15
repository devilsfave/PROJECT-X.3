import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, signInWithFacebookCredential } from '../../firebase/config'; // Import signInWithFacebookCredential
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'; // Import Facebook Login
import ButtonStyling from '../ButtonStyling';

function RegisterForm({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState('patient');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Input validation
    if (!email || !password || !confirmPassword || !fullName) {
      setError('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }
    if (role === 'doctor' && (!licenseNumber || !specialization || !location)) {
      setError('Doctors must provide all required details.');
      setIsLoading(false);
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: fullName });

      // Store user details based on role
      if (role === 'doctor') {
        await setDoc(doc(db, 'doctors', userCredential.user.uid), {
          fullName,
          email,
          licenseNumber,
          specialization,
          location,
          verified: false, // Initially set as not verified
        });
        alert('Doctor registered successfully. Verification is pending.');
      } else {
        await setDoc(doc(db, 'patients', userCredential.user.uid), {
          fullName,
          email,
        });
        alert('Patient registered successfully.');
      }

      setUser({ name: fullName, email: email, role: role });
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'An error occurred during signup.');
    } finally {
      setIsLoading(false);
    }
  };

  const responseFacebook = async (response) => {
    if (response.accessToken) {
      try {
        const user = await signInWithFacebookCredential(response.accessToken);
        setUser({ name: user.displayName, email: user.email, role: role });
        alert('Logged in with Facebook successfully.');
      } catch (error) {
        setError(error.message || 'An error occurred during Facebook login');
      }
    } else {
      setError('Facebook login failed');
    }
  };

  const isValidEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-center space-x-4 mb-4">
        <ButtonStyling
          text="Patient"
          onClick={() => setRole('patient')}
          variant={role === 'patient' ? 'primary' : 'secondary'}
        />
        <ButtonStyling
          text="Doctor"
          onClick={() => setRole('doctor')}
          variant={role === 'doctor' ? 'primary' : 'secondary'}
        />
      </div>

      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Full Name"
        className="w-full p-2 bg-[#262A36] text-[#EFEFED] rounded"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 bg-[#262A36] text-[#EFEFED] rounded"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 bg-[#262A36] text-[#EFEFED] rounded"
        required
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
        className="w-full p-2 bg-[#262A36] text-[#EFEFED] rounded"
        required
      />

      {role === 'doctor' && (
        <>
          <input
            type="text"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            placeholder="License Number"
            className="w-full p-2 bg-[#262A36] text-[#EFEFED] rounded"
            required
          />
          <input
            type="text"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            placeholder="Specialization"
            className="w-full p-2 bg-[#262A36] text-[#EFEFED] rounded"
            required
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full p-2 bg-[#262A36] text-[#EFEFED] rounded"
            required
          />
        </>
      )}

      <ButtonStyling text="Register" type="submit" disabled={isLoading} />
      
      {/* Facebook Login Button */}
      <FacebookLogin
        appId="YOUR_FACEBOOK_APP_ID"
        callback={responseFacebook}
        render={renderProps => (
          <button
            onClick={renderProps.onClick}
            className="w-full p-2 bg-[#3b5998] text-white rounded flex items-center justify-center"
          >
            <span className="mr-2">f</span> Continue with Facebook
          </button>
        )}
      />

      {error && <p className="text-red-500">{error}</p>}
      {isLoading && <p className="text-[#EFEFED]">Loading...</p>}
    </form>
  );
}

export default RegisterForm;
