// src/pages/HowItWorks.jsx
import { Utensils, Handshake, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  return (
    <div className="max-w-6xl mx-auto mt-12 px-4 pb-20 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-6">How ShareBite Works</h1>
      <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto">
        We have made the donation process as simple as possible. Three easy steps to turn your surplus food into someone's meal.
      </p>

      {/* The Steps Container */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 relative">
        
        {/* Step 1 */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center w-full md:w-1/3 relative z-10 transform transition-transform duration-300 hover:-translate-y-3 hover:shadow-2xl">
          <div className="absolute -top-6 -left-6 bg-green-600 text-white w-12 h-12 flex items-center justify-center rounded-full text-2xl font-bold shadow-md">1</div>
          <div className="bg-green-100 p-5 rounded-full mb-6">
            <Utensils className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-800">Post Food</h2>
          <p className="text-gray-600 text-center">Donors securely log in and post details about their extra food, including quantity, type, and available pickup time.</p>
        </div>

        {/* Arrow (Hides on phones, shows on laptops) */}
        <ArrowRight className="hidden md:block w-12 h-12 text-green-300 flex-shrink-0" />

        {/* Step 2 */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center w-full md:w-1/3 relative z-10 transform transition-transform duration-300 hover:-translate-y-3 hover:shadow-2xl">
          <div className="absolute -top-6 -left-6 bg-blue-600 text-white w-12 h-12 flex items-center justify-center rounded-full text-2xl font-bold shadow-md">2</div>
          <div className="bg-blue-100 p-5 rounded-full mb-6">
            <Handshake className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-800">Request Food</h2>
          <p className="text-gray-600 text-center">NGOs or verified individuals browse the live map of available food and click 'Request' to instantly notify the donor.</p>
        </div>

        {/* Arrow */}
        <ArrowRight className="hidden md:block w-12 h-12 text-blue-300 flex-shrink-0" />

        {/* Step 3 */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center w-full md:w-1/3 relative z-10 transform transition-transform duration-300 hover:-translate-y-3 hover:shadow-2xl">
          <div className="absolute -top-6 -left-6 bg-red-600 text-white w-12 h-12 flex items-center justify-center rounded-full text-2xl font-bold shadow-md">3</div>
          <div className="bg-red-100 p-5 rounded-full mb-6">
            <Heart className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-800">Pick Up & Share</h2>
          <p className="text-gray-600 text-center">The donor reviews and accepts the request. The receiver then picks up the food to share with those who need it most.</p>
        </div>
      </div>

      {/* Call to Action Button */}
      <div className="mt-16">
        <Link to="/login" className="bg-green-600 text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:bg-green-700 transition-all transform hover:scale-105 inline-block">
          Start Donating Now
        </Link>
      </div>
    </div>
  );
}