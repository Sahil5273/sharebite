// src/pages/TechStack.jsx
import { Code, Database, Palette, Smartphone, Zap, MapPin, Shield, Sparkles, Brain, Server } from 'lucide-react';

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
            <h2 className="text-2xl font-bold text-gray-800">Database & Auth</h2>
          </div>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Firebase Authentication:</strong> Secure Google Sign-in so users don't have to remember passwords.</li>
            <li><strong>Firebase Firestore:</strong> A real-time database used to store users, food donations, and messages safely.</li>
            <li><strong>Firestore Security Rules:</strong> Strict backend rules to enforce Role-Based Access Control (RBAC).</li>
          </ul>
        </div>

        {/* NEW: AI & Microservices Section */}
        <div className="bg-white p-8 rounded-xl shadow border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Brain className="text-purple-600 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">AI & Microservices</h2>
          </div>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Node.js & Express:</strong> A standalone backend server deployed on Render to securely process API requests.</li>
            <li><strong>Google Gemini 3.5 API:</strong> Multimodal AI used to analyze uploaded images and extract food metadata.</li>
            <li><strong>Cloudinary:</strong> Advanced cloud media pipeline for fast image hosting, processing, and delivery.</li>
          </ul>
        </div>

        {/* Design Section */}
        <div className="bg-white p-8 rounded-xl shadow border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-pink-100 p-3 rounded-full">
              <Palette className="text-pink-600 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Design & UI</h2>
          </div>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Tailwind CSS:</strong> Used to easily style the website, add colors, and make nice shadow effects.</li>
            <li><strong>SweetAlert2:</strong> Used to build the interactive, highly-styled safety checklist modals.</li>
            <li><strong>React Hot Toast:</strong> Used for the smooth, sliding pop-up notifications.</li>
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

          {/* NEW: Challenge 2: AI Microservice */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-purple-100 p-4 rounded-full flex-shrink-0">
              <Server className="text-purple-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">AI Data Extraction Pipeline</h3>
              <div className="mb-3">
                <span className="font-bold text-red-600 mr-2">The Challenge:</span> 
                <span className="text-gray-700">Manually typing out food details (category, title, quantity) slows down the donation process. We needed AI to analyze photos, but exposing API keys on the React frontend is a massive security risk.</span>
              </div>
              <div>
                <span className="font-bold text-green-600 mr-2">The Solution:</span> 
                <span className="text-gray-700">Architected a standalone Node.js/Express microservice. React sends images to this secure server, which communicates with the Gemini 3.5 API using strict prompt engineering to return formatted JSON directly into the frontend form state.</span>
              </div>
            </div>
          </div>

          {/* Challenge 3: Security & Blacklisting */}
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

          {/* Challenge 4: UX Feature */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-yellow-100 p-4 rounded-full flex-shrink-0">
              <Sparkles className="text-yellow-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Frictionless User Profiles</h3>
              <div className="mb-3">
                <span className="font-bold text-red-600 mr-2">The Challenge:</span> 
                <span className="text-gray-700">Donors and Receivers had to manually type their phone number and address every single time they filled out a form.</span>
              </div>
              <div>
                <span className="font-bold text-green-600 mr-2">The Solution:</span> 
                <span className="text-gray-700">We built a smart state-management system. Upon loading a dashboard, React securely fetches the logged-in user's profile document and instantly injects their saved contact details into the form state, saving time while allowing manual overrides.</span>
              </div>
            </div>
          </div>

          {/* Challenge 5: LocationIQ integration */}
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