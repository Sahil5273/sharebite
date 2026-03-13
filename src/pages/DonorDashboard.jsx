// src/pages/DonorDashboard.jsx
import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function DonorDashboard({ user }) {
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', quantity: '', address: '', expiryTime: '', contactNumber: '' });

  // Load the donor's food and any requests people made for it
  const loadData = async () => {
    if (!user) return;
    
    // Get Donations
    const qDonations = query(collection(db, 'donations'), where('donorId', '==', user.uid));
    const docs = await getDocs(qDonations);
    setDonations(docs.docs.map(d => ({ id: d.id, ...d.data() })));

    // Get Requests
    const qRequests = query(collection(db, 'requests'), where('donorId', '==', user.uid), where('status', '==', 'pending'));
    const reqDocs = await getDocs(qRequests);
    setRequests(reqDocs.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { loadData(); }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'donations'), {
      ...form,
      donorId: user.uid,
      status: 'available',
      createdAt: new Date()
    });
    setForm({ title: '', description: '', quantity: '', address: '', expiryTime: '', contactNumber: '' });
    loadData();
  };

  const handleRequest = async (requestId, donationId, action) => {
    // Action is either 'accepted' or 'rejected'
    await updateDoc(doc(db, 'requests', requestId), { status: action });
    if (action === 'accepted') {
      await updateDoc(doc(db, 'donations', donationId), { status: 'reserved' });
    }
    loadData();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Form to add food */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Post Extra Food</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input required placeholder="Food Title (e.g., 50 Sandwiches)" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="border p-2 rounded" />
          <textarea required placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="border p-2 rounded" />
          <input required placeholder="Quantity (e.g., 5 kg)" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} className="border p-2 rounded" />
          <input required placeholder="Pickup Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="border p-2 rounded" />
          <input required type="datetime-local" value={form.expiryTime} onChange={e => setForm({...form, expiryTime: e.target.value})} className="border p-2 rounded" />
          <input required placeholder="Contact Number" value={form.contactNumber} onChange={e => setForm({...form, contactNumber: e.target.value})} className="border p-2 rounded" />
          <button type="submit" className="bg-green-600 text-white p-2 rounded mt-2">Post Food</button>
        </form>
      </div>

      <div>
        {/* List of requests */}
        <h2 className="text-2xl font-bold mb-4">Incoming Requests</h2>
        {requests.length === 0 ? <p>No pending requests.</p> : requests.map(req => (
          <div key={req.id} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded shadow">
            <p>Someone wants to pick up your food!</p>
            <div className="mt-2 flex gap-2">
              <button onClick={() => handleRequest(req.id, req.donationId, 'accepted')} className="bg-green-500 text-white px-3 py-1 rounded">Accept</button>
              <button onClick={() => handleRequest(req.id, req.donationId, 'rejected')} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
            </div>
          </div>
        ))}

        {/* List of their donations */}
        <h2 className="text-2xl font-bold mt-8 mb-4">Your Postings</h2>
        {donations.map(don => (
          <div key={don.id} className="bg-white p-4 mb-3 rounded shadow border">
            <h3 className="font-bold">{don.title}</h3>
            <p className="text-sm text-gray-600">Status: <span className="font-semibold">{don.status}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}