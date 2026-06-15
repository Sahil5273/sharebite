// src/pages/DonorDashboard.jsx
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config'; 
import { collection, query, where, onSnapshot, addDoc, doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import imageCompression from 'browser-image-compression'; 

export default function DonorDashboard() {
  const [myDonations, setMyDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); 
  
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [imageFile, setImageFile] = useState(null); 
  
  // NEW: Loading state for the AI analysis
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    foodName: '',
    quantity: '',
    foodType: 'Fresh Produce',
    address: '',
    phoneNumber: '',
    lat: '', 
    lon: ''  
  });

  // Fetch user profile data to pre-fill phone/address
  useEffect(() => {
    const fetchMyProfileData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const myData = userSnap.data();
          setFormData((prevData) => ({
            ...prevData,
            address: myData.address || prevData.address,
            phoneNumber: myData.phone || prevData.phoneNumber
          }));
        }
      }
    };
    fetchMyProfileData();
  }, []);

  // Fetch user's live donations
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "donations"), where("donorId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMyDonations(snapshot.docs.map(document => ({ id: document.id, ...document.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddressTyping = async (e) => {
    const typedValue = e.target.value;
    setFormData({ ...formData, address: typedValue });

    if (typedValue.length > 2) {
      try {
        const token = import.meta.env.VITE_LOCATIONIQ_TOKEN;
        const response = await fetch(`https://api.locationiq.com/v1/autocomplete?key=${token}&q=${typedValue}&limit=5&countrycodes=in`);
        const data = await response.json();
        
        if (!data.error) {
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Location Search Error:", error);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectAddress = (place) => {
    setFormData({
      ...formData,
      address: place.display_name, 
      lat: place.lat,              
      lon: place.lon               
    });
    setShowSuggestions(false); 
  };

  // NEW: Handle Image Selection and AI Analysis
  const handleImageSelectAndAnalyze = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Save the file so Cloudinary can still upload it later when form is submitted
    setImageFile(file);
    
    // 2. Tell the user AI is working
    setIsAiLoading(true);
    const aiToastId = toast.loading("AI is analyzing your food image...");

    try {
      const data = new FormData();
      data.append('image', file);

      // Make sure this URL matches your Express backend port
      // In development, it's likely http://localhost:5000/api/analyze-food
      const response = await fetch('https://sharebite-6m6l.onrender.com/api/analyze-food', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) throw new Error("Backend failed");

      const aiData = await response.json();
      
      // 3. Auto-fill the form with the AI's guesses
      setFormData(prev => ({
        ...prev,
        foodName: aiData.title || prev.foodName,
        quantity: aiData.quantity || prev.quantity,
        // Ensure the AI's category exactly matches your dropdown options
        foodType: ['Fresh Produce', 'Cooked Meal', 'Packaged Food', 'Beverages'].includes(aiData.category) 
                  ? aiData.category 
                  : prev.foodType 
      }));

      toast.success("Form auto-filled by AI!", { id: aiToastId });

    } catch (error) {
      console.error("AI Analysis failed:", error);
      toast.error("AI couldn't analyze the image. Please fill details manually.", { id: aiToastId });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handlePostFood = async (e) => {
    e.preventDefault(); 
    const user = auth.currentUser;
    if (!user) return;

    if (!formData.lat || !formData.lon) {
      toast.error("Please select a valid address from the dropdown suggestions!");
      return;
    }

    const loadingToast = toast.loading("Preparing your post...");
    
    try {
      let imageUrl = ""; 

      if (imageFile) {
        toast.loading("Shrinking picture...", { id: loadingToast });
        const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1024, useWebWorker: true };
        const compressedFile = await imageCompression(imageFile, options);

        toast.loading("Uploading to Cloudinary...", { id: loadingToast });
        
        const cloudinaryData = new FormData();
        cloudinaryData.append("file", compressedFile);
        cloudinaryData.append("upload_preset", "sharebite_preset"); 
        const cloudName = "dlyqnzrw7"; 

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: cloudinaryData,
        });

        const uploadedImage = await res.json();
        imageUrl = uploadedImage.secure_url; 
      }

      toast.loading("Saving details to Firebase...", { id: loadingToast });

      await addDoc(collection(db, "donations"), {
        foodName: formData.foodName,
        quantity: formData.quantity,
        foodType: formData.foodType,
        address: formData.address,
        lat: formData.lat, 
        lon: formData.lon, 
        phoneNumber: formData.phoneNumber, 
        donorId: user.uid,
        status: "available",
        imageUrl: imageUrl, 
        createdAt: new Date().toISOString()
      });
      
      toast.success("Food posted successfully!", { id: loadingToast });
      setShowForm(false); 
      setImageFile(null); 
      
      setFormData((prevData) => ({ 
        foodName: '', quantity: '', foodType: 'Fresh Produce', 
        address: prevData.address, lat: prevData.lat, lon: prevData.lon, 
        phoneNumber: prevData.phoneNumber 
      })); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to post food.", { id: loadingToast });
    }
  };

  if (loading) return <div className="p-10 text-center text-xl">Loading your donations...</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Food Donations</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition"
        >
          {showForm ? "Cancel" : "+ Post Extra Food"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handlePostFood} className="bg-white p-8 rounded-2xl shadow-lg border border-green-200 mb-10">
          <h2 className="text-2xl font-bold text-green-800 mb-6">Donate New Food</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Food Title (e.g., 5 Plates of Biryani)</label>
              <input required type="text" value={formData.foodName} onChange={e => setFormData({...formData, foodName: e.target.value})} className="w-full border p-3 rounded bg-gray-50" placeholder="What are you donating?" />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Quantity (Servings/Kg)</label>
              <input required type="text" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="w-full border p-3 rounded bg-gray-50" placeholder="e.g., 10 servings" />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Food Type</label>
              <select value={formData.foodType} onChange={e => setFormData({...formData, foodType: e.target.value})} className="w-full border p-3 rounded bg-gray-50">
                <option value="Fresh Produce">Fresh Produce</option>
                <option value="Cooked Meal">Cooked Meal</option>
                <option value="Packaged Food">Packaged Food</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>
            
            <div className="relative">
              <label className="block text-gray-700 font-bold mb-2">Pick-up Address</label>
              <input 
                required 
                type="text" 
                value={formData.address} 
                onChange={handleAddressTyping} 
                className="w-full border p-3 rounded bg-gray-50" 
                placeholder="Start typing your street/area..." 
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 shadow-xl max-h-60 overflow-y-auto mt-1 rounded-lg">
                  {suggestions.map((place, index) => (
                    <li 
                      key={index} 
                      onClick={() => handleSelectAddress(place)}
                      className="p-3 hover:bg-green-50 cursor-pointer border-b border-gray-100 text-sm text-gray-700"
                    >
                      📍 {place.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="md:col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Your Contact Number</label>
              <input required type="tel" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} className="w-full border p-3 rounded bg-gray-50" placeholder="Phone Number for the receiver to call you" />
            </div>

            {/* AI-Powered Image Input block */}
            <div className="md:col-span-1">
              <label className="block text-gray-700 font-bold mb-2">
                Food Picture <span className="text-sm font-normal text-green-600">(AI will auto-fill details!)</span>
              </label>
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageSelectAndAnalyze}
                  disabled={isAiLoading}
                  className={`w-full border p-2 rounded bg-gray-50 ${isAiLoading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                />
                {isAiLoading && (
                  <div className="absolute right-3 top-2 text-green-600 animate-pulse font-bold text-sm">
                    ✨ AI Processing...
                  </div>
                )}
              </div>
            </div>

          </div>
          <button type="submit" className="mt-6 w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition text-lg">
            Post Donation to Live Map
          </button>
        </form>
      )}

      {myDonations.length === 0 && !showForm ? (
        <div className="bg-gray-50 p-10 rounded-xl text-center border">
          <p className="text-gray-600 text-lg">You haven't donated any food yet. Click the button above to start!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myDonations.map((food) => (
            <div key={food.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
              
              {food.imageUrl && (
                <img 
                  src={food.imageUrl} 
                  alt={food.foodName} 
                  className="w-full h-40 object-cover rounded-xl mb-4 border border-gray-100"
                />
              )}

              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{food.foodName}</h3>
                {food.status === 'claimed' ? (
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">CLAIMED</span>
                ) : (
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">AVAILABLE</span>
                )}
              </div>
              <p className="text-gray-600 mb-1"><strong>Quantity:</strong> {food.quantity}</p>
              <p className="text-gray-600 mb-1 text-sm truncate" title={food.address}><strong>Address:</strong> {food.address}</p>
              <p className="text-gray-600 mb-1"><strong>My Phone:</strong> {food.phoneNumber}</p> 
              
              {food.status === 'claimed' && (
                <div className="mt-auto pt-4">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 border-b border-blue-200 pb-2">
                      Who is picking this up?
                    </p>
                    <p className="text-blue-900 font-bold text-lg">{food.claimedByName}</p>
                    <p className="text-blue-700 text-sm font-semibold mb-2 bg-blue-100 inline-block px-2 py-1 rounded">{food.claimedByOrg}</p>
                    <p className="text-blue-800 text-sm flex items-center mt-1"><span className="mr-2">📞</span> {food.claimedByPhone}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}