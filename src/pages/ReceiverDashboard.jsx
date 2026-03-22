// src/pages/ReceiverDashboard.jsx
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { collection, query, where, onSnapshot, doc, getDoc, runTransaction } from 'firebase/firestore';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function ReceiverDashboard() {
  const [availableDonations, setAvailableDonations] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [claimForm, setClaimForm] = useState({
    name: '',
    claimType: 'Organization',
    orgName: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const fetchMyProfileData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const myData = userSnap.data();
          setClaimForm((prevData) => ({
            ...prevData,
            name: myData.name || prevData.name,
            phone: myData.phone || prevData.phone,
            address: myData.address || prevData.address,
            orgName: myData.organization || prevData.orgName,
            claimType: myData.organization ? 'Organization' : 'Self Use'
          }));
        }
      }
    };
    fetchMyProfileData();
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const qAvailable = query(collection(db, "donations"), where("status", "==", "available"));
    const unsubAvailable = onSnapshot(qAvailable, (snapshot) => {
      setAvailableDonations(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qMyClaims = query(collection(db, "donations"), where("claimedBy", "==", user.uid));
    const unsubMyClaims = onSnapshot(qMyClaims, (snapshot) => {
      setMyClaims(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
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

      toast.dismiss(loadingToast);
      setClaimModalOpen(false);

      // ─── UPGRADED SAFETY NOTIFICATION ───
      Swal.fire({
        html: `
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
            .sw-wrap { font-family: 'Plus Jakarta Sans', sans-serif; text-align: left; margin: -1.25rem; }
            .sw-header { background: #0D3320; padding: 36px 36px 28px; border-radius: 8px 8px 0 0; }
            .sw-header-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 18px; }
            .sw-icon-ring { width: 54px; height: 54px; border-radius: 50%; background: rgba(134,239,172,0.15); border: 2px solid rgba(134,239,172,0.25); display: flex; align-items: center; justify-content: center; font-size: 26px; }
            .sw-claimed-badge { background: rgba(134,239,172,0.15); border: 1px solid rgba(134,239,172,0.3); border-radius: 999px; padding: 5px 14px; font-size: 11px; font-weight: 700; color: #86efac; letter-spacing: 0.06em; text-transform: uppercase; font-family: 'Syne', sans-serif; }
            .sw-header h1 { font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 800; color: #f0fdf4; line-height: 1.2; margin: 0 0 8px; }
            .sw-header p { font-size: 14px; color: #86efac; margin: 0; line-height: 1.55; }
            .sw-food-pill { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); border-radius: 10px; padding: 10px 16px; font-size: 14px; font-weight: 600; color: #dcfce7; margin-top: 18px; }
            .sw-food-pill .lbl { color: rgba(255,255,255,0.45); font-weight: 400; font-size: 13px; }
            .sw-body { padding: 28px 36px 32px; background: #fff; }
            .sw-section { display: flex; align-items: center; gap: 10px; margin: 0 0 16px; }
            .sw-section .ln { flex: 1; height: 1px; background: #e5e7eb; }
            .sw-section span { font-family: 'Syne', sans-serif; font-size: 10.5px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #9ca3af; white-space: nowrap; }
            .sw-steps { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 24px; }
            .sw-step { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 14px; padding: 16px; }
            .sw-step-top { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
            .sw-step-ico { width: 42px; height: 42px; border-radius: 11px; background: #dcfce7; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
            .sw-step-num { font-family: 'Syne', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; color: #9ca3af; text-transform: uppercase; margin-bottom: 2px; }
            .sw-step-title { font-family: 'Syne', sans-serif; font-size: 14.5px; font-weight: 700; color: #111827; line-height: 1.2; }
            .sw-step-desc { font-size: 12.5px; color: #6b7280; line-height: 1.55; }
            .sw-dodo { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 22px; }
            .sw-do { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; padding: 18px; }
            .sw-dont { background: #fff1f2; border: 1px solid #fecdd3; border-radius: 14px; padding: 18px; }
            .sw-dodo-hd { display: flex; align-items: center; gap: 8px; margin-bottom: 13px; }
            .sw-badge-g { background: #dcfce7; color: #166534; font-size: 10.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 3px 9px; border-radius: 5px; font-family: 'Syne', sans-serif; }
            .sw-badge-r { background: #fee2e2; color: #991b1b; font-size: 10.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 3px 9px; border-radius: 5px; font-family: 'Syne', sans-serif; }
            .sw-dodo-title-g { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #14532d; }
            .sw-dodo-title-r { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #7f1d1d; }
            .sw-dodo-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 8px; }
            .sw-dodo-list li { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; line-height: 1.45; }
            .sw-dodo-list li.g { color: #166534; }
            .sw-dodo-list li.r { color: #991b1b; }
            .dot-g { width: 6px; height: 6px; border-radius: 50%; background: #16a34a; flex-shrink: 0; margin-top: 5px; }
            .dot-r { width: 6px; height: 6px; border-radius: 50%; background: #ef4444; flex-shrink: 0; margin-top: 5px; }
            .sw-phone { display: flex; align-items: center; gap: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; padding: 18px 20px; margin-bottom: 22px; }
            .sw-phone-circle { width: 48px; height: 48px; border-radius: 50%; background: #dcfce7; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
            .sw-phone-label { font-size: 12px; color: #4d7c5c; font-weight: 500; margin-bottom: 3px; }
            .sw-phone-num { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #14532d; }
            .sw-phone-hint { font-size: 12px; color: #6b9c7a; margin-top: 2px; }
            .sw-cta { width: 100%; background: #16a34a; color: #fff; border: none; border-radius: 13px; padding: 17px; font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; cursor: pointer; letter-spacing: 0.01em; }
            .sw-cta:hover { background: #15803d; }
            .sw-footer { text-align: center; font-size: 12px; color: #9ca3af; margin-top: 14px; padding-bottom: 4px; }
          </style>

          <div class="sw-wrap">
            <div class="sw-header">
              <div class="sw-header-top">
                <div class="sw-icon-ring">🎉</div>
                <div class="sw-claimed-badge">Claimed!</div>
              </div>
              <h1>Food Successfully Claimed!</h1>
              <p>Follow the steps below to safely collect your donation and help it reach the right hands.</p>
              <div class="sw-food-pill">
                <span style="font-size:18px">🍱</span>
                <span class="lbl">You claimed:</span>
                <strong>${selectedFood.foodName}</strong>
              </div>
            </div>

            <div class="sw-body">

              <div class="sw-section"><div class="ln"></div><span>What to do next</span><div class="ln"></div></div>

              <div class="sw-steps">
                <div class="sw-step">
                  <div class="sw-step-top">
                    <div class="sw-step-ico">📞</div>
                    <div>
                      <div class="sw-step-num">Step 1</div>
                      <div class="sw-step-title">Call the Donor</div>
                    </div>
                  </div>
                  <div class="sw-step-desc">Contact the donor right away to confirm your pickup time and ensure the food is still ready.</div>
                </div>
                <div class="sw-step">
                  <div class="sw-step-top">
                    <div class="sw-step-ico">📸</div>
                    <div>
                      <div class="sw-step-num">Step 2</div>
                      <div class="sw-step-title">Request a Photo</div>
                    </div>
                  </div>
                  <div class="sw-step-desc">Ask for a fresh WhatsApp photo of the food before you travel — confirms it's ready and safe.</div>
                </div>
                <div class="sw-step">
                  <div class="sw-step-top">
                    <div class="sw-step-ico">📍</div>
                    <div>
                      <div class="sw-step-num">Step 3</div>
                      <div class="sw-step-title">Get Live Location</div>
                    </div>
                  </div>
                  <div class="sw-step-desc">Ask the donor to share their WhatsApp Live Location so you can navigate directly without confusion.</div>
                </div>
                <div class="sw-step">
                  <div class="sw-step-top">
                    <div class="sw-step-ico">🔍</div>
                    <div>
                      <div class="sw-step-num">Step 4</div>
                      <div class="sw-step-title">Inspect on Arrival</div>
                    </div>
                  </div>
                  <div class="sw-step-desc">Check appearance, smell, and temperature before accepting. You can decline if anything seems off.</div>
                </div>
              </div>

              <div class="sw-section"><div class="ln"></div><span>Food safety rules</span><div class="ln"></div></div>

              <div class="sw-dodo">
                <div class="sw-do">
                  <div class="sw-dodo-hd">
                    <span class="sw-badge-g">✓ Do</span>
                    <span class="sw-dodo-title-g">Safe practices</span>
                  </div>
                  <ul class="sw-dodo-list">
                    <li class="g"><span class="dot-g"></span>Check expiry date and packaging integrity</li>
                    <li class="g"><span class="dot-g"></span>Keep food covered and sealed in transit</li>
                    <li class="g"><span class="dot-g"></span>Refrigerate perishables within 2 hours</li>
                    <li class="g"><span class="dot-g"></span>Reheat all food thoroughly before serving</li>
                    <li class="g"><span class="dot-g"></span>Taste a small portion before distributing</li>
                  </ul>
                </div>
                <div class="sw-dont">
                  <div class="sw-dodo-hd">
                    <span class="sw-badge-r">✕ Don't</span>
                    <span class="sw-dodo-title-r">Avoid these</span>
                  </div>
                  <ul class="sw-dodo-list">
                    <li class="r"><span class="dot-r"></span>Accept food that is open or unsealed</li>
                    <li class="r"><span class="dot-r"></span>Ignore unusual smells or discoloration</li>
                    <li class="r"><span class="dot-r"></span>Leave food sitting in a hot vehicle</li>
                    <li class="r"><span class="dot-r"></span>Serve food without reheating it first</li>
                    <li class="r"><span class="dot-r"></span>Accept if the donor appears visibly unwell</li>
                  </ul>
                </div>
              </div>

              <div class="sw-section" style="margin-bottom:16px"><div class="ln"></div><span>Donor contact</span><div class="ln"></div></div>

              <div class="sw-phone">
                <div class="sw-phone-circle">📞</div>
                <div>
                  <div class="sw-phone-label">Call this number to coordinate your pickup</div>
                  <div class="sw-phone-num">${selectedFood.phoneNumber}</div>
                  <div class="sw-phone-hint">Tap to call · Available 8 AM – 9 PM</div>
                </div>
              </div>

              <button class="sw-cta" onclick="this.textContent='✓ Great, heading out now!'; setTimeout(() => Swal.close(), 600)">
              ✓ &nbsp; Understood, I'm ready to go!
              </button>
              <div class="sw-footer">ShareBite · Connecting donors &amp; receivers across your city</div>
            </div>
          </div>
        `,
        showConfirmButton: false,
        showCloseButton: true,
        width: '740px',
        padding: '0',
        background: '#fff',
        customClass: {
          popup: 'rounded-3xl',
          closeButton: 'text-white hover:text-gray-300'
        }
      });

    } catch (error) {
      toast.error(error.toString(), { id: loadingToast });
    }
  };

  if (loading) return <div className="p-10 text-center text-xl">Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 pb-20 relative">

      {/* --- CLAIM MODAL --- */}
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
                  Confirm &amp; Claim Food
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