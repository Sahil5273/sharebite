// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase/config'; 

export default function AdminDashboard() {
  const [allDonations, setAllDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- THE BOUNCER (Security Check) ---
  const user = auth.currentUser;
  const adminEmail = "hostelbitesvitb@gmail.com"; // Put your exact email here

  if (!user || user.email !== adminEmail) {
    return (
      <div className="max-w-3xl mx-auto mt-20 text-center px-4">
        <div className="text-6xl mb-4">🛑</div>
        <h1 className="text-4xl font-extrabold text-red-600 mb-4">Access Denied</h1>
        <p className="text-xl text-gray-700 bg-red-50 p-6 rounded-2xl border border-red-200">
          This area is restricted to ShareByte administrators only. You do not have permission to view this page.
        </p>
      </div>
    );
  }

  useEffect(() => {
    // We grab the entire "donations" collection, no filters!
    const q = query(collection(db, "donations"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllDonations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-10 text-center text-xl">Loading admin data...</div>;

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 pb-20">
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">Admin Control Center</h1>
        <p className="text-xl text-gray-600 mt-2">Birds-eye view of all platform activity</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* We use a table here because it looks more like a professional admin panel */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-4 font-bold uppercase text-sm">Food Item</th>
                <th className="p-4 font-bold uppercase text-sm">Status</th>
                <th className="p-4 font-bold uppercase text-sm">Donor Info</th>
                <th className="p-4 font-bold uppercase text-sm">Recipient Info</th>
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
                    
                    {/* Column 1: Food Details */}
                    <td className="p-4 align-top">
                      <p className="font-bold text-gray-900 text-lg">{food.foodName}</p>
                      <p className="text-sm text-gray-600">Qty: {food.quantity}</p>
                      <p className="text-xs text-gray-400 mt-1">Type: {food.foodType}</p>
                    </td>

                    {/* Column 2: Status */}
                    <td className="p-4 align-top">
                      {food.status === 'claimed' ? (
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">CLAIMED</span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full border border-yellow-200">AVAILABLE</span>
                      )}
                    </td>

                    {/* Column 3: Donor Details */}
                    <td className="p-4 align-top">
                      <p className="text-sm text-gray-800 flex items-center gap-1"><span className="text-lg">📍</span> {food.address}</p>
                      <p className="text-sm text-gray-800 flex items-center gap-1 mt-1"><span className="text-lg">📞</span> {food.phoneNumber || "N/A"}</p>
                    </td>

                    {/* Column 4: Recipient Details */}
                    <td className="p-4 align-top">
                      {food.status === 'claimed' ? (
                        <div className="bg-blue-50 p-3 rounded border border-blue-100">
                          <p className="font-bold text-blue-900 text-sm">{food.claimedByName}</p>
                          <p className="text-xs text-blue-700 font-bold bg-blue-200 inline-block px-1 rounded mt-1 mb-1">{food.claimedByOrg}</p>
                          <p className="text-sm text-blue-800">📞 {food.claimedByPhone}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic">Waiting for a claim...</p>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}