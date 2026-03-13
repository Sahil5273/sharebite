// src/pages/ReceiverDashboard.jsx
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function ReceiverDashboard({ user }) {
  const [donations, setDonations] = useState([]);

  // Load all food that is currently 'available'
  const loadAvailableFood = async () => {
    const q = query(collection(db, 'donations'), where('status', '==', 'available'));
    const docs = await getDocs(q);
    setDonations(docs.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { loadAvailableFood(); }, []);

  const requestFood = async (donation) => {
    if (!user) return;
    
    // Create a request ticket in the database
    await addDoc(collection(db, 'requests'), {
      donationId: donation.id,
      receiverId: user.uid,
      donorId: donation.donorId,
      status: 'pending',
      createdAt: new Date()
    });
    
    alert("Request sent to the donor!");
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Available Food Donations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donations.length === 0 ? <p>No food available right now.</p> : donations.map(don => (
          <div key={don.id} className="bg-white p-5 rounded shadow-lg border border-gray-100 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-green-700">{don.title}</h3>
              <p className="text-gray-600 mt-2">{don.description}</p>
              <ul className="mt-4 text-sm space-y-1">
                <li><strong>Quantity:</strong> {don.quantity}</li>
                <li><strong>Pickup at:</strong> {don.address}</li>
                <li><strong>Expires:</strong> {new Date(don.expiryTime).toLocaleString()}</li>
                <li><strong>Contact:</strong> {don.contactNumber}</li>
              </ul>
            </div>
            <button 
              onClick={() => requestFood(don)} 
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
              Request Food
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}