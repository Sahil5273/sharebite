import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 1. Check if the user already exists in our database
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // 2. If they have a role, send them to their dashboard
        if (userData.role === 'donor') {
          navigate('/donor');
          toast.success("Welcome back, Donor!");
        } else if (userData.role === 'receiver') {
          navigate('/receiver');
          toast.success("Welcome back, Receiver!");
        } else {
          // If they logged in before but never picked a role
          navigate('/');
        }
      } else {
        // 3. Brand new user? Send to Home so the Welcome Screen shows up
        // We also create their basic profile here
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          createdAt: new Date().toISOString()
        });
        navigate('/');
        toast.success("Welcome to ShareBite!");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center max-w-md w-full">
        <div className="text-5xl mb-6">🍲</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Join ShareBite</h1>
        <p className="text-gray-600 mb-8">Sign in to start donating or receiving surplus food in your community.</p>
        
        <button 
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full bg-white border-2 border-gray-200 hover:border-green-500 py-3 rounded-xl font-bold transition-all transform hover:-translate-y-1"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/0/google.svg" alt="Google" className="w-6 h-6" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}