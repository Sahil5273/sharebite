// src/pages/About.jsx
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">
        About ShareBite
      </h1>
      
      <p className="text-lg text-gray-700 mb-10 text-center">
        ShareBite is a platform built to tackle one of the world's biggest problems: 
        food going to waste while people go hungry. Our mission is to connect extra 
        food with the people who need it most.
      </p>

      {/* Facts Section */}
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          The Hidden Crisis of Food Wastage
        </h2>
        
        <div className="space-y-6">
          <div className="flex gap-4 items-start">
            <div className="text-3xl">📉</div>
            <div>
              <h3 className="text-xl font-bold text-red-600">The Global Impact</h3>
              <p className="text-gray-600">Roughly one-third of all food produced in the world for human consumption every year gets lost or wasted.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="text-3xl">🇮🇳</div>
            <div>
              <h3 className="text-xl font-bold text-orange-500">The Reality in India</h3>
              <p className="text-gray-600">Millions of tons of food are wasted in our country every single year, often at weddings, events, and in homes, while many families still struggle to get a daily meal.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="text-3xl">🌍</div>
            <div>
              <h3 className="text-xl font-bold text-green-600">Environmental Harm</h3>
              <p className="text-gray-600">When food rots in landfills, it creates methane—a greenhouse gas that is much worse for the environment than carbon dioxide. Saving food also saves the planet.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-green-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Be Part of the Solution</h2>
        <p className="text-gray-700 mb-6">Whether you have extra food to share or you help distribute it to others, your actions matter.</p>
        <div className="flex justify-center gap-4">
          <Link to="/login" className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 shadow">
            Join ShareBite Today
          </Link>
        </div>
      </div>
    </div>
  );
}