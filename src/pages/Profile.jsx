// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
// 1. We brought in 'updateDoc' so we can modify existing database info
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 2. These new memories handle the "Edit Mode"
  const [isEditing, setIsEditing] = useState(false);
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");

  useEffect(() => {
    const getUserDetails = async () => {
      const user = auth.currentUser;
      
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          // Pre-fill the typing boxes with their current info
          setEditPhone(data.phone || "");
          setEditAddress(data.address || "");
        }
      }
      setLoading(false);
    };

    getUserDetails();
  }, []);

  // 3. THE SAVE FUNCTION
  const handleSave = async () => {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      
      // Tell Firebase to update just these two specific fields
      await updateDoc(userRef, {
        phone: editPhone,
        address: editAddress
      });

      // Update the screen immediately so the user sees the change
      setUserData({ ...userData, phone: editPhone, address: editAddress });
      
      // Turn off Edit Mode
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl text-gray-600">Loading your details...</div>;

  if (!userData) {
    return <div className="text-center mt-20 text-xl text-red-500 font-bold">Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 pb-20">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        
        {/* The Top Color Banner */}
        <div className="bg-green-600 p-8 text-center text-white relative">
          <div className="w-24 h-24 bg-white text-green-600 rounded-full flex items-center justify-center text-5xl font-extrabold mx-auto mb-4 shadow-md">
            {userData.name ? userData.name.charAt(0).toUpperCase() : "👤"}
          </div>
          <h2 className="text-3xl font-bold">{userData.name || "No Name Provided"}</h2>
          <p className="bg-green-700 inline-block px-4 py-1 rounded-full text-xs font-bold mt-3 uppercase tracking-wider shadow-sm">
            {userData.role} Account
          </p>

          {/* Edit / Cancel Button */}
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 bg-white text-green-700 px-4 py-1 rounded-full text-sm font-bold shadow hover:bg-green-50"
            >
              Edit Profile
            </button>
          ) : (
            <button 
              onClick={() => {
                setIsEditing(false);
                // Reset the boxes if they cancel
                setEditPhone(userData.phone || "");
                setEditAddress(userData.address || "");
              }}
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow hover:bg-red-600"
            >
              Cancel
            </button>
          )}
        </div>

        {/* The Details Section */}
        <div className="p-8 space-y-6 bg-gray-50">
          
          {/* Email is permanent, so it doesn't get a typing box */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
            <p className="text-lg text-gray-800 font-medium">{userData.email}</p>
          </div>

          {/* Phone Number Box */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
            {isEditing ? (
              <input 
                type="text" 
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full border-b-2 border-green-500 p-2 outline-none text-lg bg-gray-50 rounded"
                placeholder="e.g. +91 98765 43210"
              />
            ) : (
              <p className="text-lg text-gray-800 font-medium">{userData.phone || "Not added yet"}</p>
            )}
          </div>

          {/* Location Box */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Address / Location</p>
            {isEditing ? (
              <input 
                type="text" 
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                className="w-full border-b-2 border-green-500 p-2 outline-none text-lg bg-gray-50 rounded"
                placeholder="e.g. VIT Bhopal Hostels"
              />
            ) : (
              <p className="text-lg text-gray-800 font-medium">{userData.address || "Not added yet"}</p>
            )}
          </div>

          {userData.organization && (
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Organization</p>
              <p className="text-lg text-blue-700 font-bold">{userData.organization}</p>
            </div>
          )}

          {/* The Save Button (Only shows when editing) */}
          {isEditing && (
            <button 
              onClick={handleSave}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md mt-4"
            >
              Save Changes
            </button>
          )}

        </div>
      </div>
    </div>
  );
}