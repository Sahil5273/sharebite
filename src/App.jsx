// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase/config';

import Home from './pages/Home';
import Login from './pages/Login';
import HowItWorks from './pages/HowItWorks';
import FAQ from './pages/FAQ';
import ContactUs from './pages/ContactUs';
import DonorDashboard from './pages/DonorDashboard';
import ReceiverDashboard from './pages/ReceiverDashboard';
import About from './pages/About'; // <-- Add this new line!

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
        {/* Mobile-Friendly Navigation Bar */}
        <nav className="bg-green-600 text-white p-4 shadow-md">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <Link to="/" className="text-xl font-bold">ShareByte 🍲</Link>

            {/* Desktop Links (These hide on small phones!) */}
            <div className="hidden md:flex gap-6 items-center">
              <Link to="/about" className="hover:text-green-200">About</Link>
              <Link to="/how-it-works" className="hover:text-green-200">How it Works</Link>
              <Link to="/faq" className="hover:text-green-200">FAQ</Link>
              <Link to="/contact" className="hover:text-green-200">Contact</Link>
              
              {user ? (
                <div className="flex gap-4 items-center ml-4">
                  {role === 'donor' && <Link to="/donor" className="hover:underline">Dashboard</Link>}
                  {role === 'receiver' && <Link to="/receiver" className="hover:underline">Dashboard</Link>}
                  <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
                </div>
              ) : (
                <Link to="/login" className="bg-white text-green-600 px-4 py-2 rounded font-bold ml-4">Login</Link>
              )}
            </div>

            {/* Mobile Menu Button (This ONLY shows on phones!) */}
            <button 
              className="md:hidden text-white" 
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {/* This draws the 3 lines (Hamburger) or an X to close */}
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* The Dropdown Menu for Phones */}
          {menuOpen && (
            <div className="md:hidden flex flex-col gap-4 mt-4 border-t border-green-500 pt-4">
              <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
              <Link to="/how-it-works" onClick={() => setMenuOpen(false)}>How it Works</Link>
              <Link to="/faq" onClick={() => setMenuOpen(false)}>FAQ</Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
              
              {user ? (
                <div className="flex flex-col gap-3 mt-2">
                  {role === 'donor' && <Link to="/donor" onClick={() => setMenuOpen(false)}>Dashboard</Link>}
                  {role === 'receiver' && <Link to="/receiver" onClick={() => setMenuOpen(false)}>Dashboard</Link>}
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="bg-red-500 p-2 rounded w-full text-center">Logout</button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="bg-white text-green-600 p-2 rounded font-bold text-center mt-2">Login</Link>
              )}
            </div>
          )}
        </nav>

        {/* Page Content */}
        <div className="p-4 max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/donor" element={<DonorDashboard user={user} />} />
            <Route path="/receiver" element={<ReceiverDashboard user={user} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}