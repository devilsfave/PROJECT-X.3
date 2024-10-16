import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase/config';
import MainComponent from './components/MainComponent';
import LoginForm from './components/LoginForm'; 
import RegisterForm from './components/RegisterForm';
import AdminPanel from './components/Admin/AdminPanel';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ name: user.displayName, email: user.email });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <p className="text-center text-[#EFEFED]">Loading...</p>;
  }

  return (
    <div>
      {user ? (
        <>
          {user.email && user.email === 'herbertyeboah123@gmail.com' ? (
            <AdminPanel user={user} />
          ) : (
            <MainComponent user={user} setUser={setUser} />
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <LoginForm setUser={setUser} />
          <RegisterForm setUser={setUser} />
        </div>
      )}
    </div>
  );
}

export default App;