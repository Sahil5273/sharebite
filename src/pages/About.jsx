// src/pages/About.jsx
import { Link } from 'react-router-dom';

export default function About() {
  // Your amazing team!
  const team = [
    { name: "Sahil Kumar", id: "23BA110224" },
    { name: "Mrityudaman Dhaka", id: "23BCE10164" },
    { name: "Vinay Singh", id: "23BCY10336" },
    { name: "Aman Kumar", id: "23BCE10302" },
    { name: "Lakshyawardhan Singh", id: "23BCE10631" },
    { name: "Mohit Thakur", id: "23MIP10009" }
  ];

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 pb-12">
      
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-4">About ShareBite</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
          A MERN-Firebase Integrated Solution for Surplus Food Redistribution.
        </p>
      </div>

      {/* Mission & Concept Section */}
      <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 mb-10 text-center md:text-left">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Our Vision</h2>
        
        <div className="grid md:grid-cols-2 gap-8 mt-4">
          <div>
            <h3 className="text-xl font-bold text-green-700 mb-2">The Concept</h3>
            <p className="text-gray-700 text-lg">ShareBite is a centralized platform connecting restaurants, grocery stores, and individuals (Donors) with local shelters and NGOs (Recipients).</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-green-700 mb-2">The Mission</h3>
            <p className="text-gray-700 text-lg">To streamline the donation process, making it as easy to donate food as it is to order it.</p>
          </div>
          <div className="md:col-span-2 bg-green-50 p-6 rounded-xl mt-2 border border-green-100">
            <h3 className="text-xl font-bold text-green-800 mb-2 text-center">Our Core Value</h3>
            <p className="text-gray-700 text-lg text-center">Reducing the environmental footprint of food waste while solving local hunger.</p>
          </div>
        </div>
      </div>

      {/* The Problem Statement Section */}
      <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4 text-center md:text-left">The Problem Statement</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="text-2xl font-bold text-red-600 mb-2">30% Food Waste</h3>
            <p className="text-gray-600">Over 30% of global food production is wasted every single year.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="text-5xl mb-4">⏳</div>
            <h3 className="text-2xl font-bold text-orange-500 mb-2">Time Sensitivity</h3>
            <p className="text-gray-600">Perishable food requires a real-time system to ensure it reaches the needy before it spoils.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="text-5xl mb-4">🚚</div>
            <h3 className="text-2xl font-bold text-blue-600 mb-2">Logistics Gap</h3>
            <p className="text-gray-600">Donors often want to give, but don't have a platform to find volunteers or recipients quickly.</p>
          </div>
        </div>
      </div>

      {/* Meet the Team Section */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 text-xl mb-1">{member.name}</h3>
              <span className="inline-block bg-green-100 text-green-800 font-mono text-sm px-3 py-1 rounded-full border border-green-200">
                {member.id}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}