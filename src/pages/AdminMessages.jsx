// src/pages/AdminMessages.jsx
import { useEffect, useState } from 'react';
// 1. We added 'doc' and 'deleteDoc' so we can erase messages
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { superAdmins } from '../adminConfig';

export default function AdminMessages({ role }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const msgList = snapshot.docs.map(document => ({
          id: document.id,
          ...document.data()
        }));
        setMessages(msgList);
        setLoading(false);
      }, 
      (error) => {
        console.error("Firebase Error:", error);
        setErrorMsg(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. THE DELETE FUNCTION
  const handleDelete = async (id) => {
    // Ask for confirmation first so you don't delete by accident
    const isSure = window.confirm("Are you sure you want to delete this message forever?");
    
    if (isSure) {
      // This tells Firebase to permanently erase the message
      await deleteDoc(doc(db, "messages", id));
    }
  };

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

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 pb-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">User Messages</h1>

      {errorMsg ? (
        <div className="bg-red-50 border border-red-200 p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-2">Firebase Blocked the Request</h2>
          <p className="text-red-600 font-mono text-sm bg-white p-4 rounded border border-red-100">
            {errorMsg}
          </p>
        </div>
      ) : loading ? (
        <p className="text-center text-xl text-gray-600">Loading messages...</p>
      ) : messages.length === 0 ? (
        <div className="bg-gray-50 p-10 rounded-xl text-center border">
          <p className="text-gray-600 text-lg">Your inbox is empty. No messages yet!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-green-700">{msg.name}</h3>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                  {msg.createdAt ? msg.createdAt.toDate().toLocaleString() : "Just now"}
                </span>
              </div>
              
              <p className="text-sm text-blue-600 font-medium mb-4 border-b pb-2">{msg.email}</p>
              
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                {msg.message}
              </p>

              {/* 3. THE DELETE BUTTON */}
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => handleDelete(msg.id)}
                  className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors font-bold border border-transparent hover:border-red-200"
                >
                  Delete Message
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}