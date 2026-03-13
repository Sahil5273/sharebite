import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { collection, query, where, onSnapshot, doc, runTransaction } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function ReceiverDashboard() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We only want to see food that hasn't been claimed yet
    const q = query(collection(db, "donations"), where("status", "==", "available"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDonations(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleClaimFood = async (foodId) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in to claim food");
      return;
    }

    const foodDocRef = doc(db, "donations", foodId);

    try {
      // --- START OF FIREBASE TRANSACTION ---
      // This is the "Referee" that prevents two people claiming at once
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(foodDocRef);
        
        if (!sfDoc.exists()) {
          throw "Document does not exist!";
        }

        const currentStatus = sfDoc.data().status;

        // The "Strict Check": If it's not available anymore, stop!
        if (currentStatus !== "available") {
          throw "Too late! Someone else just claimed this meal.";
        }

        // The "Atomic Update": Mark it claimed and link it to this user
        transaction.update(foodDocRef, { 
          status: "claimed",
          claimedBy: user.uid,
          claimedByName: user.displayName || "NGO Partner"
        });
      });
      // --- END OF TRANSACTION ---

      toast.success("Success! You have claimed this donation.");
    } catch (error) {
      console.error("Transaction failed: ", error);
      toast.error(error.toString());
    }
  };

  if (loading) return <div className="p-10 text-center">Loading available food...</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Available Food Donations</h1>
      
      {donations.length === 0 ? (
        <div className="bg-gray-100 p-10 rounded-xl text-center">
          <p className="text-gray-600 text-lg">No food available in your area right now. Check back soon!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((food) => (
            <div key={food.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-green-700">{food.foodName}</h3>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded uppercase">
                  {food.foodType || 'Meal'}
                </span>
              </div>
              
              <p className="text-gray-600 mb-2"><strong>Quantity:</strong> {food.quantity} servings</p>
              <p className="text-gray-600 mb-4"><strong>Address:</strong> {food.address}</p>
              
              <button 
                onClick={() => handleClaimFood(food.id)}
                className="mt-auto bg-green-600 text-white font-bold py-2 rounded-xl hover:bg-green-700 transition-colors"
              >
                Claim This Food
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}