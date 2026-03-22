// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import { superAdmins } from './adminConfig';
import './App.css'

import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import HowItWorks from './pages/HowItWorks';
import FAQ from './pages/FAQ';
import ContactUs from './pages/ContactUs';
import DonorDashboard from './pages/DonorDashboard';
import ReceiverDashboard from './pages/ReceiverDashboard';
import About from './pages/About';
import TechStack from './pages/TechStack';
import AdminMessages from './pages/AdminMessages';
import Profile from './pages/Profile';
import AdminUsers from './pages/AdminUsers';

const NavLink = ({ to, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`sb-link${isActive ? ' active' : ''}`} onClick={onClick}>
      {children}
    </Link>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists() && userDoc.data().role) {
          setRole(userDoc.data().role);
        } else {
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => { signOut(auth); closeMenu(); };

  const handleRoleSelection = async (selectedRole) => {
    if (!user) return;
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      name: user.displayName || '',
      role: selectedRole,
      createdAt: new Date().toISOString()
    }, { merge: true }); 
    setRole(selectedRole);
  };

  const isAdmin = user && (superAdmins.includes(user.email) || role === 'admin');

  const getUserInitials = () => {
    if (!user) return '';
    const name = user.displayName || user.email || '';
    return name.slice(0, 2).toUpperCase();
  };

  const navLinks = [
    { to: '/about', label: 'About' },
    { to: '/how-it-works', label: 'How it works' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: 'Contact' },
    { to: '/tech', label: 'Tech stack' },
  ];

  return (
    <Router>
      <nav className={`sb-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="sb-nav-inner">
          <Link to="/" className="sb-logo" onClick={closeMenu}>
            <div className="sb-logo-icon">🍲</div>
            <span className="sb-logo-text">Share<span>Bite</span></span>
          </Link>

          <div className="sb-links">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to}>{label}</NavLink>
            ))}
          </div>

          <div className="sb-actions">
            {isAdmin && (
              <div className="sb-admin-dropdown">
                <button className="sb-admin-dropbtn">
                  <span className="sb-admin-dot" /> Admin Panel ▾
                </button>
                <div className="sb-admin-dropdown-content">
                  <Link to="/admin" className="sb-admin-dropdown-link">📊 Live Activity</Link>
                  <Link to="/messages" className="sb-admin-dropdown-link">📥 Inbox</Link>
                  <Link to="/users" className="sb-admin-dropdown-link">👥 Manage Users</Link>
                </div>
              </div>
            )}

            {user ? (
              <>
                {/* STRICT ROLE CHECK: Only true Donors see this */}
                {role === 'donor' && (
                  <Link to="/donor" className="sb-dashboard-btn">
                    <span className="sb-role-badge donor">Donor</span>
                    Dashboard
                  </Link>
                )}
                
                {/* STRICT ROLE CHECK: Only true Receivers see this */}
                {role === 'receiver' && (
                  <Link to="/receiver" className="sb-dashboard-btn">
                    <span className="sb-role-badge receiver">Receiver</span>
                    Dashboard
                  </Link>
                )}
                
                <Link to="/profile" className="sb-profile-btn">
                  <div className="sb-avatar">{getUserInitials()}</div>
                  My profile
                </Link>
                <button className="sb-logout-btn" onClick={handleLogout}>Sign out</button>
              </>
            ) : (
              <Link to="/login" className="sb-login-btn">Get started →</Link>
            )}
          </div>

          <button className={`sb-hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`sb-mobile-menu${menuOpen ? ' open' : ''}`}>
        <div className="sb-mobile-nav-links">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} className="sb-mobile-link" onClick={closeMenu}>{label}</Link>
          ))}
        </div>

        {isAdmin && (
          <div className="sb-mobile-section admin-card">
            <p className="sb-mobile-section-label">🛡️ Admin Controls</p>
            <Link to="/admin" className="sb-mobile-admin-link" onClick={closeMenu}>📊 Live activity</Link>
            <Link to="/messages" className="sb-mobile-admin-link" onClick={closeMenu}>📥 Inbox</Link>
            <Link to="/users" className="sb-mobile-admin-link" onClick={closeMenu}>👥 Manage Users</Link>
          </div>
        )}

        <div className="sb-mobile-actions">
          {user ? (
            <>
              {/* STRICT ROLE CHECK FOR MOBILE */}
              {role === 'donor' && (
                <Link to="/donor" className="sb-mobile-dashboard-link donor" onClick={closeMenu}>🍲 Donor Dashboard</Link>
              )}
              {role === 'receiver' && (
                <Link to="/receiver" className="sb-mobile-dashboard-link receiver" onClick={closeMenu}>🤲 Receiver Dashboard</Link>
              )}
              <Link to="/profile" className="sb-mobile-profile-link" onClick={closeMenu}>👤 My Profile</Link>
              <button className="sb-mobile-logout" onClick={handleLogout}>Sign out</button>
            </>
          ) : (
            <Link to="/login" className="sb-mobile-login" onClick={closeMenu}>Get started →</Link>
          )}
        </div>
      </div>

      <div className="sb-page">
        <div className="sb-content">
          {authLoading ? (
            <div className="flex justify-center items-center h-[60vh]">
              <div className="text-xl text-green-700 font-bold animate-pulse">Loading ShareBite...</div>
            </div>
          ) : (user && !role) ? (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
              <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 max-w-2xl w-full text-center">
                <div className="text-6xl mb-6">👋</div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to ShareBite!</h1>
                <p className="text-gray-600 mb-10 text-lg">Before you get started, tell us how you want to use the platform.</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <button onClick={() => handleRoleSelection('donor')} className="p-8 border-2 border-green-100 rounded-2xl hover:border-green-500 hover:bg-green-50 transition text-left group">
                    <div className="text-5xl mb-4 transform group-hover:scale-110 transition">🍲</div>
                    <h3 className="font-bold text-xl text-green-800 mb-2">I want to Donate Food</h3>
                    <p className="text-gray-600 text-sm">I have extra food from my home, restaurant, or event to share.</p>
                  </button>
                  <button onClick={() => handleRoleSelection('receiver')} className="p-8 border-2 border-orange-100 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition text-left group">
                    <div className="text-5xl mb-4 transform group-hover:scale-110 transition">🤲</div>
                    <h3 className="font-bold text-xl text-orange-800 mb-2">I need to Receive Food</h3>
                    <p className="text-gray-600 text-sm">I am an NGO, shelter, or individual looking for food donations.</p>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              
              <Route 
                path="/login" 
                element={
                  user && role === 'donor' ? <Navigate to="/donor" replace /> :
                  user && role === 'receiver' ? <Navigate to="/receiver" replace /> :
                  user && isAdmin ? <Navigate to="/admin" replace /> :
                  <Login />
                } 
              />

              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/tech" element={<TechStack />} />
              
              {/* UPDATED: Strict routing for Donor */}
              <Route 
                path="/donor" 
                element={
                  !user ? <Navigate to="/login" replace /> : 
                  role === 'receiver' ? <Navigate to="/receiver" replace /> : 
                  <DonorDashboard user={user} />
                } 
              />
              
              {/* UPDATED: Strict routing for Receiver */}
              <Route 
                path="/receiver" 
                element={
                  !user ? <Navigate to="/login" replace /> : 
                  role === 'donor' ? <Navigate to="/donor" replace /> : 
                  <ReceiverDashboard user={user} />
                } 
              />

              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
              
              <Route path="/admin" element={<AdminDashboard role={role} />} />
              <Route path="/messages" element={<AdminMessages role={role} />} />
              <Route path="/users" element={<AdminUsers isAdmin={isAdmin} />} />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
}