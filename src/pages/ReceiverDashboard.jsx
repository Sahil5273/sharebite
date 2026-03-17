// src/pages/ReceiverDashboard.jsx
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
// 1. ADDED 'getDoc' here so we can read the user's profile
import { collection, query, where, onSnapshot, doc, getDoc, runTransaction } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function ReceiverDashboard() {
  const [availableDonations, setAvailableDonations] = useState([]);
  const [myClaims, setMyClaims] = useState([]); 
  const [loading, setLoading] = useState(true);

  // --- Controls the Pop-up Form ---
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null); 
  const [claimForm, setClaimForm] = useState({
    name: '',
    claimType: 'Organization', 
    orgName: '',
    phone: '',
    address: ''
  });

  // 2. THE NEW AUTOFILL MAGIC
  useEffect(() => {
    const fetchMyProfileData = async () => {
      const user = auth.currentUser;
      if (user) {
        // Look up their specific ID card in the users database
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const myData = userSnap.data();
          
          // Update the claimForm memory with their saved details!
          setClaimForm((prevData) => ({
            ...prevData,
            name: myData.name || prevData.name,
            phone: myData.phone || prevData.phone,
            address: myData.address || prevData.address,
            orgName: myData.organization || prevData.orgName,
            // Smart feature: If they have an org saved, select "Organization", else select "Self Use"
            claimType: myData.organization ? 'Organization' : 'Self Use'
          }));
        }
      }
    };

    fetchMyProfileData();
  }, []); // Only runs once when the dashboard loads

  // 3. YOUR EXISTING DASHBOARD DATA FETCH
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const qAvailable = query(collection(db, "donations"), where("status", "==", "available"));
    const unsubAvailable = onSnapshot(qAvailable, (snapshot) => {
      setAvailableDonations(snapshot.docs.map(document => ({ id: document.id, ...document.data() })));
    });

    const qMyClaims = query(collection(db, "donations"), where("claimedBy", "==", user.uid));
    const unsubMyClaims = onSnapshot(qMyClaims, (snapshot) => {
      setMyClaims(snapshot.docs.map(document => ({ id: document.id, ...document.data() })));
      setLoading(false);
    });

    return () => { unsubAvailable(); unsubMyClaims(); };
  }, []);

  const openClaimForm = (food) => {
    setSelectedFood(food);
    setClaimModalOpen(true);
  };

  const submitClaim = async (e) => {
    e.preventDefault(); 
    const user = auth.currentUser;
    if (!user) return toast.error("You must be logged in!");

    const loadingToast = toast.loading("Claiming food...");
    const foodDocRef = doc(db, "donations", selectedFood.id);

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(foodDocRef);
        if (sfDoc.data().status !== "available") {
          throw "Too late! Someone else just claimed this meal.";
        }
        
        transaction.update(foodDocRef, { 
          status: "claimed",
          claimedBy: user.uid,
          claimedByEmail: user.email,
          claimedByName: claimForm.name,
          claimedByOrg: claimForm.claimType === 'Self Use' ? 'Self Use' : claimForm.orgName,
          claimedByPhone: claimForm.phone,
          claimedByAddress: claimForm.address
        });
      });
      
      toast.success("Success! You have claimed this donation.", { id: loadingToast });
      
      // Close the pop-up, but KEEP the form data filled out for the next time!
      setClaimModalOpen(false);
    } catch (error) {
      toast.error(error.toString(), { id: loadingToast });
    }
  };

  if (loading) return <div className="p-10 text-center text-xl">Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 pb-20 relative">
      
      {/* --- POP-UP MODAL --- */}
      {claimModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-green-800 mb-2">Claim Confirmation</h2>
            <p className="text-gray-600 mb-6">You are claiming: <strong>{selectedFood?.foodName}</strong></p>
            
            <form onSubmit={submitClaim} className="flex flex-col gap-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Your Full Name</label>
                <input required type="text" value={claimForm.name} onChange={e => setClaimForm({...claimForm, name: e.target.value})} className="w-full border p-3 rounded bg-gray-50" placeholder="John Doe" />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">I am claiming this for:</label>
                <select value={claimForm.claimType} onChange={e => setClaimForm({...claimForm, claimType: e.target.value})} className="w-full border p-3 rounded bg-gray-50">
                  <option value="Organization">An Organization / NGO</option>
                  <option value="Self Use">Self Use / Individual</option>
                </select>
              </div>

              {claimForm.claimType === 'Organization' && (
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Organization Name</label>
                  <input required type="text" value={claimForm.orgName} onChange={e => setClaimForm({...claimForm, orgName: e.target.value})} className="w-full border p-3 rounded bg-gray-50" placeholder="e.g., Hope Shelter" />
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-bold mb-2">Your Phone Number</label>
                <input required type="tel" value={claimForm.phone} onChange={e => setClaimForm({...claimForm, phone: e.target.value})} className="w-full border p-3 rounded bg-gray-50" placeholder="So the donor can contact you" />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">Your Office/Home Address</label>
                <input required type="text" value={claimForm.address} onChange={e => setClaimForm({...claimForm, address: e.target.value})} className="w-full border p-3 rounded bg-gray-50" placeholder="Where are you coming from?" />
              </div>

              <div className="flex gap-4 mt-4">
                <button type="button" onClick={() => setClaimModalOpen(false)} className="w-1/3 bg-gray-200 text-gray-800 font-bold py-3 rounded-xl hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" className="w-2/3 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700">
                  Confirm & Claim Food
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECTION 1: Available Food */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Food Donations</h1>
      {availableDonations.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-xl text-center mb-12 border">
          <p className="text-gray-600">No food available right now. Check back soon!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {availableDonations.map((food) => (
            <div key={food.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
              <h3 className="text-xl font-bold text-green-700 mb-2">{food.foodName}</h3>
              <p className="text-gray-600 mb-1"><strong>Quantity:</strong> {food.quantity}</p>
              <p className="text-gray-600 mb-1"><strong>Address:</strong> {food.address}</p>
              <p className="text-gray-600 mb-4"><strong>Donor Phone:</strong> {food.phoneNumber}</p>
              <button 
                onClick={() => openClaimForm(food)}
                className="mt-auto bg-green-600 text-white font-bold py-2 rounded-xl hover:bg-green-700 transition"
              >
                Claim This Food
              </button>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 2: Food I Have Claimed */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-t pt-10">Food I Have Claimed</h2>
      {myClaims.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-xl text-center border">
          <p className="text-gray-600">You haven't claimed any food yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myClaims.map((food) => (
            <div key={food.id} className="bg-green-50 p-6 rounded-2xl shadow-sm border border-green-200 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-green-800">{food.foodName}</h3>
                <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">CLAIMED</span>
              </div>
              <p className="text-gray-700 mb-1"><strong>Quantity:</strong> {food.quantity}</p>
              <p className="text-gray-700 mb-1"><strong>Pickup Address:</strong> {food.address}</p>
              <p className="text-gray-700 mb-4"><strong>Donor Phone:</strong> {food.phoneNumber}</p>
              <p className="text-sm text-green-700 mt-auto bg-green-100 p-3 rounded-lg text-center font-bold">
                Please contact the donor and pick up your food!
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}