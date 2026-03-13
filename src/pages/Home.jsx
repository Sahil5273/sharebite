// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { Heart, Users, Utensils } from 'lucide-react'; // These are the icons for the stats!

export default function Home() {
  return (
    <div className="flex flex-col items-center pb-12">
      
      {/* Top Section (Text on Left, Image on Right) */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between mt-12 mb-20 gap-10">
        
        {/* Left Side: Text and Buttons */}
        <div className="md:w-1/2 text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Share Food, <br/>
            <span className="text-green-600">Spread Hope.</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            ShareBite bridges the gap between extra food and empty plates. 
            Join our community to donate your surplus food or find meals for those in need.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link to="/login" className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-green-700 transition-all transform hover:-translate-y-1">
              Donate Food
            </Link>
            <Link to="/login" className="bg-white text-green-600 border-2 border-green-600 px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-green-50 transition-all transform hover:-translate-y-1">
              Find Food
            </Link>
          </div>
        </div>
        
        {/* Right Side: A Beautiful Picture */}
        <div className="md:w-1/2 w-full flex justify-center">
          <img 
            // src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80" 
            src="https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZCUyMHNoYXJpbmd8ZW58MHx8MHx8fDA%3D?auto=format&fit=crop&w=800&q=80"
            alt="People sharing healthy food" 
            className="rounded-3xl shadow-2xl object-cover h-80 w-full"
          />
        </div>
      </div>

      {/* Bottom Section: Impact Statistics Box */}
      <div className="w-full bg-white rounded-3xl shadow-xl p-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center border border-gray-100">
         
         {/* Stat 1 */}
         <div className="flex flex-col items-center">
           <div className="bg-green-100 p-4 rounded-full mb-4">
             <Utensils className="w-8 h-8 text-green-600" />
           </div>
           <h3 className="text-4xl font-extrabold text-gray-900 mb-2">500+</h3>
           <p className="text-gray-500 font-medium">Meals Shared</p>
         </div>
         
         {/* Stat 2 */}
         <div className="flex flex-col items-center">
           <div className="bg-blue-100 p-4 rounded-full mb-4">
             <Users className="w-8 h-8 text-blue-600" />
           </div>
           <h3 className="text-4xl font-extrabold text-gray-900 mb-2">250+</h3>
           <p className="text-gray-500 font-medium">Active Users</p>
         </div>
         
         {/* Stat 3 */}
         <div className="flex flex-col items-center">
           <div className="bg-red-100 p-4 rounded-full mb-4">
             <Heart className="w-8 h-8 text-red-600" />
           </div>
           <h3 className="text-4xl font-extrabold text-gray-900 mb-2">100+</h3>
           <p className="text-gray-500 font-medium">NGOs Helped</p>
         </div>

      </div>
    </div>
  );
}