// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
// 1. We added 'doc' and 'deleteDoc' so we can erase things from the database
import { collection, onSnapshot, query, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config'; 
import { superAdmins } from '../adminConfig';

export default function AdminDashboard({ role }) {
  const [allDonations, setAllDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 2. We created a memory space to hold the data for the popup window
  const [selectedItem, setSelectedItem] = useState(null);

  // --- THE BOUNCER ---
  if (!auth.currentUser || (!superAdmins.includes(auth.currentUser.email) && role !== 'admin')) {
    return (
      <div className="max-w-3xl mx-auto mt-20 text-center px-4">
        <div className="text-6xl mb-4">🛑</div>
        <h1 className="text-4xl font-extrabold text-red-600 mb-4">Access Denied</h1>
        <p className="text-xl text-gray-700 bg-red-50 p-6 rounded-2xl border border-red-200">
          This area is restricted to ShareByte administrators only.
        </p>
      </div>
    );
  }

  useEffect(() => {
    const q = query(collection(db, "donations"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllDonations(snapshot.docs.map(document => ({ id: document.id, ...document.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 3. THE DELETE FUNCTION
  const handleDelete = async (id) => {
    // We show a warning box first so you don't delete by accident
    const isSure = window.confirm("Are you sure you want to delete this donation forever?");
    
    if (isSure) {
      // This tells Firebase to erase it completely
      await deleteDoc(doc(db, "donations", id));
    }
  };

  if (loading) return <div className="p-10 text-center text-xl">Loading admin data...</div>;

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 pb-20 relative">
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">Admin Control Center</h1>
        <p className="text-xl text-gray-600 mt-2">Birds-eye view of all platform activity</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-4 font-bold uppercase text-sm">Food Item</th>
                <th className="p-4 font-bold uppercase text-sm">Status</th>
                <th className="p-4 font-bold uppercase text-sm">Location</th>
                <th className="p-4 font-bold uppercase text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allDonations.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">No donations in the database yet.</td>
                </tr>
              ) : (
                allDonations.map((food) => (
                  <tr key={food.id} className="hover:bg-gray-50 transition-colors">
                    
                    {/* Basic Info */}
                    <td className="p-4 align-top">
                      <p className="font-bold text-gray-900 text-lg">{food.foodName}</p>
                      <p className="text-sm text-gray-600">Qty: {food.quantity}</p>
                    </td>

                    {/* Status Label */}
                    <td className="p-4 align-top">
                      {food.status === 'claimed' ? (
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">CLAIMED</span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full border border-yellow-200">AVAILABLE</span>
                      )}
                    </td>

                    {/* Short Location */}
                    <td className="p-4 align-top">
                      <p className="text-sm text-gray-800 flex items-center gap-1"><span className="text-lg">📍</span> {food.address}</p>
                    </td>

                    {/* 4. THE ACTION BUTTONS */}
                    <td className="p-4 align-top text-center space-y-2 flex flex-col items-center">
                      <button 
                        onClick={() => setSelectedItem(food)} 
                        className="bg-green-100 text-green-700 font-bold px-4 py-1 rounded hover:bg-green-200 w-full max-w-[120px]"
                      >
                        Details
                      </button>
                      <button 
                        onClick={() => handleDelete(food.id)} 
                        className="bg-red-100 text-red-700 font-bold px-4 py-1 rounded hover:bg-red-200 w-full max-w-[120px]"
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* 5. THE POPUP WINDOW (It only shows up if you click the 'Details' button) */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative">
            
            {/* The X button to close the popup */}
            <button 
              onClick={() => setSelectedItem(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 font-bold text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-gray-800">Full Details</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-500 uppercase text-xs">Food Information</h3>
                <p className="text-lg font-bold text-gray-800">{selectedItem.foodName} (Qty: {selectedItem.quantity})</p>
                <p className="text-gray-600 text-sm">Type: {selectedItem.foodType}</p>
              </div>

              <div>
                <h3 className="font-bold text-gray-500 uppercase text-xs">Donor Information</h3>
                <p className="text-gray-800">📍 {selectedItem.address}</p>
                <p className="text-gray-800">📞 {selectedItem.phoneNumber || "No phone provided"}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-500 uppercase text-xs mb-2">Recipient Information</h3>
                {selectedItem.status === 'claimed' ? (
                  <>
                    <p className="font-bold text-blue-900">{selectedItem.claimedByName}</p>
                    <p className="text-sm text-blue-700 font-bold bg-blue-100 inline-block px-2 py-1 rounded mt-1 mb-1">{selectedItem.claimedByOrg}</p>
                    <p className="text-gray-800 mt-1">📞 {selectedItem.claimedByPhone}</p>
                  </>
                ) : (
                  <p className="text-gray-500 italic">This food is still waiting for an NGO to claim it.</p>
                )}
              </div>
            </div>

            <button 
              onClick={() => setSelectedItem(null)} 
              className="mt-6 w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

    </div>
  );
}