// src/pages/Login.jsx
import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, provider, db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [needsRole, setNeedsRole] = useState(false);
  const [tempUser, setTempUser] = useState(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if we already have this user saved
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // New user! Ask them what role they want.
        setTempUser(user);
        setNeedsRole(true);
      } else {
        // Old user, send them to their dashboard
        const role = userDoc.data().role;
        navigate(role === 'donor' ? '/donor' : '/receiver');
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const selectRole = async (selectedRole) => {
    await setDoc(doc(db, 'users', tempUser.uid), {
      name: tempUser.displayName,
      email: tempUser.email,
      role: selectedRole,
      createdAt: new Date()
    });
    navigate(selectedRole === 'donor' ? '/donor' : '/receiver');
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-3xl font-bold mb-6">Welcome to ShareBite</h2>
      
      {!needsRole ? (
        <button onClick={handleGoogleLogin} className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700">
          Sign in with Google
        </button>
      ) : (
        <div className="bg-white p-8 rounded shadow text-center">
          <h3 className="text-xl mb-4">Are you here to donate or receive food?</h3>
          <div className="flex gap-4">
            <button onClick={() => selectRole('donor')} className="bg-green-500 text-white px-6 py-2 rounded">I am a Donor</button>
            <button onClick={() => selectRole('receiver')} className="bg-blue-500 text-white px-6 py-2 rounded">I am a Receiver</button>
          </div>
        </div>
      )}
    </div>
  );
}