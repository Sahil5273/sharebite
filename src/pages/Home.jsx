// src/pages/Home.jsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-5xl font-extrabold text-green-700 mb-6">ShareBite</h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
        Bridging the gap between extra food and empty plates. 
        Connect with local donors or find food for your organization.
      </p>
      <div className="flex justify-center gap-6">
        <Link to="/login" className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-bold shadow-lg hover:bg-green-700">
          Donate Food
        </Link>
        <Link to="/login" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-bold shadow-lg hover:bg-blue-700">
          Find Food
        </Link>
      </div>
    </div>
  );
}