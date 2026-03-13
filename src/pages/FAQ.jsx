// src/pages/FAQ.jsx
export default function FAQ() {
  const faqs = [
    {
      question: "Is ShareByte free to use?",
      answer: "Yes! ShareByte is a 100% free platform created to help the community."
    },
    {
      question: "What kind of food can I donate?",
      answer: "You can donate fresh, untouched food from events, packaged goods, or freshly cooked meals. Please ensure the food is safe to eat and not spoiled."
    },
    {
      question: "Do you provide delivery?",
      answer: "Currently, we do not provide delivery. Receivers must go to the Donor's address to pick up the food."
    },
    {
      question: "Who can sign up as a Receiver?",
      answer: "Anyone in need can sign up, including orphanages, NGOs, shelters, or even individuals."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">Frequently Asked Questions</h1>
      
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{faq.question}</h3>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}