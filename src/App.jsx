// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase/config';

import Home from './pages/Home';
import Login from './pages/Login';
import DonorDashboard from './pages/DonorDashboard';
import ReceiverDashboard from './pages/ReceiverDashboard';
import About from './pages/About'; // <-- Add this new line!

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // This checks if the user is logged in every time the app loads
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Find out if they are a donor or receiver
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      } else {
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => signOut(auth);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-green-600 text-white p-4 flex justify-between items-center shadow-md">
          <Link to="/" className="text-xl font-bold">ShareBite 🍲</Link>
          <Link to="/about" className="hover:text-green-200 font-medium">About</Link> 
          <div>
            {user ? (
              <div className="flex gap-4 items-center">
                <span>Hello, {user.displayName}</span>
                {role === 'donor' && <Link to="/donor" className="hover:underline">Donor Dashboard</Link>}
                {role === 'receiver' && <Link to="/receiver" className="hover:underline">Receiver Dashboard</Link>}
                <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="bg-white text-green-600 px-4 py-2 rounded font-bold">Login</Link>
            )}
          </div>
        </nav>

        {/* Page Content */}
        <div className="p-4 max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/donor" element={<DonorDashboard user={user} />} />
            <Route path="/receiver" element={<ReceiverDashboard user={user} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}