***

# ShareBite 🍲
**A MERN-Firebase Integrated Solution for Surplus Food Redistribution.**

ShareBite is a centralized platform connecting restaurants, grocery stores, and individuals (Donors) with local shelters and NGOs (Receivers). Our mission is to streamline the donation process, making it as easy to donate food as it is to order it, thereby reducing the environmental footprint of food waste while solving local hunger.

## 🌟 Key Features
* **Role-Based Routing:** Distinct, secure interfaces for Donors to post food, Receivers to claim it, and Admins to govern the platform.
* **Smart Location Search:** Integrated LocationIQ API for forward-geocoding, allowing users to select highly accurate, autocomplete drop-down addresses.
* **Real-Time Database:** Utilizes Firebase Firestore to update donation requests and claim statuses instantly across all connected clients.
* **Interactive Safety Protocols:** Features a beautiful, custom UI checklist that enforces food safety guidelines and provides instant donor contact info upon claiming a meal.
* **Admin Governance:** A dedicated dashboard for platform managers to monitor user growth, search profiles, and instantly blacklist bad actors.

## ✨ Special Technical Features
* **Race Condition Prevention:** Uses Firebase Transactions to act like a strict "referee." If two receivers try to claim the exact same meal at the exact same millisecond, the system safely processes only one request and prevents double-booking.
* **Advanced Firestore Security Rules:** Employs a custom `isAdmin()` security rule that acts as a VIP pass, strictly isolating regular users to their own data while allowing authenticated admins to securely read and manage the entire user base.
* **Dynamic Admin "Bouncer":** The platform features active user-status checking. If a user is flagged as "Blacklisted" via the Admin Dashboard, the Firebase Auth system instantly rejects their login attempts at the gate.
* **Smart UI & Error Handling:** Built with `react-hot-toast` for real-time loading states and `SweetAlert2` for complex, interactive modals, ensuring users never feel "lost" during a transaction.

## 🛠️ Technology Stack
* **Frontend:** React.js (Bootstrapped with Vite)
* **Styling & Animations:** Tailwind CSS & SweetAlert2
* **Mapping & Geocoding:** LocationIQ API
* **Routing:** React Router DOM
* **Backend & Database:** Firebase (Firestore & Authentication)
* **Hosting:** Firebase Hosting

## 🚀 How to Run the Project Locally

Follow these steps to test the project on your own computer:

**1. Install Dependencies**
Ensure you have Node.js installed, then run:
```bash
npm install
```

**2. Configure Environment Variables**
Create a `.env` file in the root of your project and add your LocationIQ token to enable the address autocomplete features:
```env
VITE_LOCATIONIQ_TOKEN=your_locationiq_api_token_here
```

**3. Configure Firebase**
* Create a project on the [Firebase Console](https://console.firebase.google.com/).
* Enable **Authentication** (Google Sign-In) and **Firestore Database**.
* Update the configuration keys inside `src/firebase/config.js` with your specific project details.

**4. Start the Development Server**
```bash
npm run dev
```
*Open `http://localhost:5173` in your browser to view the app.*

## 📦 Deployment

To build and deploy this application live on the internet using Firebase Hosting:

```bash
npm run build
firebase deploy
```

## 👨‍💻 Developer
* Sahil Kumar (23BA110224)

***
