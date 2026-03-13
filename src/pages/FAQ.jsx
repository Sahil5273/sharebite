// src/pages/FAQ.jsx
import { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FAQ() {
  // This state remembers which question is currently clicked open
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Is ShareByte free to use?",
      answer: "Yes! ShareByte is a 100% free platform created to help the community. We believe fighting hunger shouldn't cost a thing."
    },
    {
      question: "What kind of food can I donate?",
      answer: "You can donate fresh, untouched food from events, packaged goods, or freshly cooked meals. Please ensure the food is safe to eat, properly stored, and not spoiled."
    },
    {
      question: "Do you provide delivery?",
      answer: "Currently, we do not provide delivery. Receivers must go to the Donor's exact address at the agreed-upon time to pick up the food."
    },
    {
      question: "Who can sign up as a Receiver?",
      answer: "Anyone in need can sign up! This includes verified orphanages, NGOs, local shelters, or even individuals facing temporary hardship."
    }
  ];

  // This function handles opening and closing the questions
  const toggleFAQ = (index) => {
    if (openIndex === index) {
      setOpenIndex(null); // Close it if it's already open
    } else {
      setOpenIndex(index); // Open the new one
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 px-4 pb-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-green-700 mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600">Everything you need to know about how ShareByte works.</p>
      </div>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            {/* The Clickable Question Box */}
            <button 
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
            >
              <h3 className="text-lg font-bold text-gray-800">{faq.question}</h3>
              <ChevronDown 
                className={`w-6 h-6 text-green-600 transition-transform duration-300 ${openIndex === index ? 'transform rotate-180' : ''}`} 
              />
            </button>
            
            {/* The Hidden Answer Box (Slides open) */}
            <div 
              className={`px-6 text-gray-600 transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* A nice prompt at the bottom to contact you */}
      <div className="mt-12 bg-green-50 rounded-2xl p-8 text-center border border-green-100">
        <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Still have questions?</h3>
        <p className="text-gray-600 mb-6">We are here to help you make a difference.</p>
        <Link to="/contact" className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-colors shadow-md">
          Contact Our Team
        </Link>
      </div>
    </div>
  );
}