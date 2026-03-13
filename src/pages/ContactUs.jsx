// src/pages/ContactUs.jsx
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault(); // Stops the page from refreshing
    
    const loadingToast = toast.loading("Sending message...");
    
    try {
      // Save the message into a new 'messages' folder in Firebase
      await addDoc(collection(db, 'messages'), {
        ...form,
        createdAt: new Date()
      });
      
      toast.success("Message sent! We will get back to you soon.", { id: loadingToast });
      setForm({ name: '', email: '', message: '' }); // Clear the form
    } catch (error) {
      toast.error("Failed to send message.", { id: loadingToast });
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h1 className="text-4xl font-bold text-green-700 mb-4 text-center">Contact Us</h1>
      <p className="text-gray-600 text-center mb-8">Have a question or found a bug? Send us a message!</p>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col gap-4">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Your Name</label>
          <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border p-3 rounded bg-gray-50" placeholder="John Doe" />
        </div>
        
        <div>
          <label className="block text-gray-700 font-bold mb-2">Your Email</label>
          <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border p-3 rounded bg-gray-50" placeholder="john@example.com" />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Message</label>
          <textarea required rows="4" value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full border p-3 rounded bg-gray-50" placeholder="How can we help you?" />
        </div>

        <button type="submit" className="bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 mt-2">
          Send Message
        </button>
      </form>
    </div>
  );
}