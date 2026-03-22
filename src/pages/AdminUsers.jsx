// src/pages/AdminUsers.jsx
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config'; // Make sure auth is imported!
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function AdminUsers({ isAdmin }) {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // NEW: Search feature

  // 1. Fetch all users from the database in real-time
  useEffect(() => {
    if (!isAdmin) return; 

    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(document => ({
        id: document.id,
        ...document.data()
      }));
      setUsersList(usersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  // 2. SMART DATE FORMATTER
  const formatJoinDate = (dateValue) => {
    if (!dateValue) return 'Unknown Date';
    
    // Check if it's a special Firebase Timestamp
    if (typeof dateValue.toDate === 'function') {
      return dateValue.toDate().toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
      });
    }
    
    // Fallback for standard string dates
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return 'Unknown Date';
    
    return d.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  // 3. The Blacklist Function
  const toggleBlacklist = async (userId, currentStatus, userName) => {
    const actionWord = currentStatus ? "Unban" : "Blacklist";
    const newStatus = !currentStatus;

    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionWord.toLowerCase()} ${userName || 'this user'}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: currentStatus ? '#16a34a' : '#dc2626', 
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${actionWord}!`
    });

    if (result.isConfirmed) {
      const toastId = toast.loading(`${actionWord}ing user...`);
      try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          isBlacklisted: newStatus
        });
        toast.success(`User successfully ${actionWord.toLowerCase()}ed!`, { id: toastId });
      } catch (error) {
        toast.error("Something went wrong.", { id: toastId });
        console.error(error);
      }
    }
  };

  // 4. FILTER USERS BY SEARCH
  const filteredUsers = usersList.filter(user => 
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // If a regular user somehow types this URL, block them
  if (!isAdmin) {
    return <div className="text-center mt-20 text-xl font-bold text-red-600">Access Denied. Admins only.</div>;
  }

  if (loading) return <div className="p-10 text-center text-xl">Loading users...</div>;

  // Get the current user's email to prevent self-banning
  const currentUserEmail = auth.currentUser?.email;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 pb-20">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* NEW SEARCH BAR */}
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 w-full md:w-64 focus:outline-none focus:border-green-500"
          />
          <div className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold whitespace-nowrap shadow-sm">
            Total: {filteredUsers.length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm uppercase tracking-wider text-gray-500">
                <th className="p-4 font-bold">Name & Email</th>
                <th className="p-4 font-bold">Role</th>
                <th className="p-4 font-bold">Joined</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{u.name || 'No Name Provided'}</div>
                      <div className="text-sm text-gray-500">{u.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        u.role === 'donor' ? 'bg-green-100 text-green-700' : 
                        u.role === 'receiver' ? 'bg-orange-100 text-orange-700' : 
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {u.role || 'New'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600 font-medium">
                      {formatJoinDate(u.createdAt)}
                    </td>
                    <td className="p-4">
                      {u.isBlacklisted ? (
                        <span className="text-red-600 font-bold text-sm flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-600"></span> Banned
                        </span>
                      ) : (
                        <span className="text-green-600 font-bold text-sm flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {/* ANTI-SELF-BAN LOCK: Hide the button if the user is the one currently logged in */}
                      {u.email !== currentUserEmail ? (
                        <button
                          onClick={() => toggleBlacklist(u.id, u.isBlacklisted, u.name)}
                          className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                            u.isBlacklisted 
                              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                              : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                          }`}
                        >
                          {u.isBlacklisted ? 'Unban' : 'Blacklist'}
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm font-bold px-4 py-2">You</span>
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