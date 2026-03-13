// src/pages/HowItWorks.jsx
import { Utensils, Handshake, Heart } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 text-center">
      <h1 className="text-4xl font-bold text-green-700 mb-4">How ShareByte Works</h1>
      <p className="text-xl text-gray-600 mb-12">Three simple steps to make a difference.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Step 1 */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col items-center">
          <div className="bg-green-100 p-4 rounded-full mb-6">
            <Utensils className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-3">1. Post Food</h2>
          <p className="text-gray-600">Donors simply log in and post details about the extra food they have, including the quantity and pickup time.</p>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col items-center">
          <div className="bg-blue-100 p-4 rounded-full mb-6">
            <Handshake className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold mb-3">2. Request Food</h2>
          <p className="text-gray-600">NGOs or individuals browse available food and click 'Request' to instantly notify the donor.</p>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col items-center">
          <div className="bg-red-100 p-4 rounded-full mb-6">
            <Heart className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-3">3. Pick Up & Share</h2>
          <p className="text-gray-600">The donor accepts the request, and the receiver picks up the food to share with those who need it.</p>
        </div>
      </div>
    </div>
  );
}