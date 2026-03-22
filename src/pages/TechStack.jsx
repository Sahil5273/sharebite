// src/pages/TechStack.jsx
import { Code, Database, Palette, Smartphone, Zap, MapPin, Shield, Sparkles } from 'lucide-react';

export default function TechStack() {
  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 pb-12">
      {/* Top Section: The Tools We Used */}
      <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">How We Built This</h1>
      <p className="text-lg text-gray-700 mb-12 text-center">
        A look under the hood at the technologies and tools used to bring ShareBite to life.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Frontend Section */}
        <div className="bg-white p-8 rounded-xl shadow border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Code className="text-blue-600 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Frontend</h2>
          </div>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>React.js (Vite):</strong> Used to build a fast, modern user interface.</li>
            <li><strong>React Router:</strong> Used to switch between pages smoothly without reloading the website.</li>
            <li><strong>LocationIQ API:</strong> Used to create a smart address dropdown and fetch exact GPS coordinates.</li>
            <li><strong>Lucide React:</strong> Used for adding clean, professional icons.</li>
          </ul>
        </div>

        {/* Backend Section */}
        <div className="bg-white p-8 rounded-xl shadow border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Database className="text-yellow-600 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Backend & Database</h2>
          </div>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Firebase Authentication:</strong> Secure Google Sign-in so users don't have to remember passwords.</li>
            <li><strong>Firebase Firestore:</strong> A real-time database used to store users, food donations, and messages safely.</li>
            <li><strong>Firestore Security Rules:</strong> Strict backend rules to enforce Role-Based Access Control (RBAC).</li>
          </ul>
        </div>

        {/* Design Section */}
        <div className="bg-white p-8 rounded-xl shadow border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Palette className="text-purple-600 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Design & UI</h2>
          </div>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Tailwind CSS:</strong> Used to easily style the website, add colors, and make nice shadow effects.</li>
            <li><strong>SweetAlert2:</strong> Used to build the interactive, highly-styled safety checklist modals.</li>
            <li><strong>React Hot Toast:</strong> Used for the smooth, sliding pop-up notifications.</li>
          </ul>
        </div>

        {/* Mobile Section */}
        <div className="bg-white p-8 rounded-xl shadow border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Smartphone className="text-green-600 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Responsive Layout</h2>
          </div>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Mobile-First Design:</strong> The code automatically adjusts the screen size so it works perfectly on phones.</li>
            <li><strong>Dynamic Navigation:</strong> A custom hamburger menu that appears only on smaller screens.</li>
          </ul>
        </div>
      </div>

      {/* Bottom Section: System Challenges */}
      <div className="bg-green-50 p-8 md:p-10 rounded-3xl shadow-md border border-green-100">
        <h2 className="text-3xl font-bold text-green-800 mb-8 text-center border-b border-green-200 pb-4">
          System Challenges & Technical Solutions
        </h2>
        
        <div className="space-y-8">
          
          {/* Challenge 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-orange-100 p-4 rounded-full flex-shrink-0">
              <Zap className="text-orange-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Concurrency & Race Conditions</h3>
              <div className="mb-3">
                <span className="font-bold text-red-600 mr-2">The Challenge:</span> 
                <span className="text-gray-700">In a real-time system, two volunteers might try to "claim" the same donation at the exact same millisecond.</span>
              </div>
              <div>
                <span className="font-bold text-green-600 mr-2">The Solution:</span> 
                <span className="text-gray-700">We implemented Firebase Transactions. This ensures that the database strictly checks the "status" of a donation before updating it, preventing a single meal from being assigned to multiple people.</span>
              </div>
            </div>
          </div>

          {/* Challenge 2: Security & Blacklisting */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-red-100 p-4 rounded-full flex-shrink-0">
              <Shield className="text-red-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Platform Governance & Security</h3>
              <div className="mb-3">
                <span className="font-bold text-red-600 mr-2">The Challenge:</span> 
                <span className="text-gray-700">We needed a secure way to stop spammers and bad actors from accessing the platform without deleting their historical data.</span>
              </div>
              <div>
                <span className="font-bold text-green-600 mr-2">The Solution:</span> 
                <span className="text-gray-700">We built an Admin Dashboard with a dynamic "Bouncer." Admins can flag malicious users, and Firebase Auth instantly intercepts and rejects their login attempts at the gate, while preserving their past records for analytics.</span>
              </div>
            </div>
          </div>

          {/* Challenge 3: UX Feature */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-purple-100 p-4 rounded-full flex-shrink-0">
              <Sparkles className="text-purple-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Frictionless Data Entry</h3>
              <div className="mb-3">
                <span className="font-bold text-red-600 mr-2">The Challenge:</span> 
                <span className="text-gray-700">Donors and Receivers had to manually type their phone number and address every single time they filled out a form, creating a frustrating user experience.</span>
              </div>
              <div>
                <span className="font-bold text-green-600 mr-2">The Solution:</span> 
                <span className="text-gray-700">We built a smart "Autofill" system. Upon loading a dashboard, React securely fetches the logged-in user's profile document and instantly injects their saved contact details into the form state, saving time while still allowing manual edits.</span>
              </div>
            </div>
          </div>

          {/* Challenge 4: LocationIQ integration */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-blue-100 p-4 rounded-full flex-shrink-0">
              <MapPin className="text-blue-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Geographical Accuracy</h3>
              <div className="mb-3">
                <span className="font-bold text-red-600 mr-2">The Challenge:</span> 
                <span className="text-gray-700">Users often provide vague, misspelled addresses that make it nearly impossible for receivers to locate the food pickup spot.</span>
              </div>
              <div>
                <span className="font-bold text-green-600 mr-2">The Solution:</span> 
                <span className="text-gray-700">Integrated the LocationIQ Autocomplete API to enforce standardized address formats. It provides users with a smart drop-down list as they type and converts the selection into precise GPS coordinates behind the scenes.</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}