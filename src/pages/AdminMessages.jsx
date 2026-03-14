// src/pages/AdminMessages.jsx
import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null); // --- NEW: Holds the hidden error ---

  const adminEmails = ["hostelbitesvitb@gmail.com", "vishalsinghbhati@vitbhopal.ac.in"];

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    
    // We added an error catcher to the onSnapshot listener!
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const msgList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(msgList);
        setLoading(false);
      }, 
      (error) => {
        // If Firebase fails, it will trigger this code instead of being stuck
        console.error("Firebase Error:", error);
        setErrorMsg(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // THE BOUNCER 
  if (!auth.currentUser || !adminEmails.includes(auth.currentUser.email)) {
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

      {/* --- NEW: Show the error if one happened --- */}
      {errorMsg ? (
        <div className="bg-red-50 border border-red-200 p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-2">Firebase Blocked the Request</h2>
          <p className="text-red-600 font-mono text-sm bg-white p-4 rounded border border-red-100">
            {errorMsg}
          </p>
          <p className="text-gray-600 mt-4">
            If the error mentions a <strong>"missing index"</strong>, right-click the page, click "Inspect", go to the "Console" tab, and click the blue link Firebase provided to build the index.
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}