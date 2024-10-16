import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, signInWithFacebookCredential } from '../../Firebase/config';
import ButtonStyling from '../ButtonStyling';
import FacebookLogin from '@greatsumini/react-facebook-login';

function LoginForm({ setUserWithRole }) {  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [role, setRole] = useState('patient');  // Role state
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = { name: userCredential.user.displayName, email: userCredential.user.email };
      setUserWithRole(userData, role);  // Set user with role
    } catch (err) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email to reset the password.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent!');
      setError(null);
    } catch (err) {
      setError('Failed to send password reset email.');
    }
  };

  const responseFacebook = async (response) => {
    if (response.accessToken) {
      try {
        setIsLoading(true);
        const user = await signInWithFacebookCredential(response.accessToken);
        setUserWithRole({ name: user.displayName, email: user.email }, role);  // Set user with role for Facebook login
        alert('Logged in with Facebook successfully.');
      } catch (error) {
        setError(error.message || 'An error occurred during Facebook login');
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Facebook login failed');
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
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

      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 pl-10 bg-[#262A36] text-[#EFEFED] rounded"
          required
        />
        <span className="absolute left-3 top-2 text-[#EFEFED]">📧</span>
      </div>

      <div className="relative">
        <input
          type={isPasswordVisible ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 pl-10 pr-10 bg-[#262A36] text-[#EFEFED] rounded"
          required
        />
        <span className="absolute left-3 top-2 text-[#EFEFED]">🔒</span>
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-2 text-[#EFEFED]"
        >
          {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <ButtonStyling text="Login" type="submit" disabled={isLoading} />

      {isLoading && <p className="text-center text-[#EFEFED]">Loading...</p>}

      <div className="text-center mt-4">
        <p className="text-[#EFEFED]">Or login with</p>
        <FacebookLogin
          appId="YOUR_FACEBOOK_APP_ID"
          callback={responseFacebook}
          render={renderProps => (
            <button
              onClick={renderProps.onClick}
              className="mt-2 p-2 bg-[#3b5998] text-white rounded flex items-center justify-center w-full"
            >
              <span className="mr-2">f</span> Continue with Facebook
            </button>
          )}
        />
      </div>

      <p className="text-center text-[#EFEFED] mt-4">
        Don't have an account? <a href="/register" className="text-[#3B82F6]">Sign up</a>
      </p>

      <p 
        className="text-center text-[#3B82F6] mt-2 cursor-pointer" 
        onClick={handlePasswordReset}
      >
        Forgot Password?
      </p>
    </form>
  );
}

export default LoginForm;
