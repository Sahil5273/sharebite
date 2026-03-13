'''
# ShareBite 🍲
**A MERN-Firebase Integrated Solution for Surplus Food Redistribution.**

ShareBite is a centralized platform connecting restaurants, grocery stores, and individuals (Donors) with local shelters and NGOs (Recipients). Our mission is to streamline the donation process, making it as easy to donate food as it is to order it, thereby reducing the environmental footprint of food waste while solving local hunger.

## 🌟 Key Features
* **Role-Based Dashboards:** Distinct interfaces for Donors to post food, Receivers to claim it, and Admins to monitor the platform.
* **Real-Time Database:** Utilizes Firebase Firestore to update donation requests instantly without refreshing the page.
* **Secure Authentication:** Seamless Google Sign-In powered by Firebase Authentication.
* **Mobile-Responsive UI:** Built with Tailwind CSS to ensure the platform works perfectly on both desktops and mobile phones.

## ✨ Special Technical Features
* **Race Condition Prevention:** Uses Firebase Transactions to act like a "strict referee." If two NGOs try to claim the exact same meal at the exact same millisecond, the system safely processes only one request and prevents the meal from being double-booked.
* **Secure Admin "Bouncer":** Features a hidden Admin Control Center that actively checks a user's logged-in email. If an unauthorized user tries to guess the URL and enter the admin page, they are blocked by an "Access Denied" security screen.
* **Smart Contact Cards & Modals:** Uses interactive pop-up forms (modals) to collect a receiver's organization name, phone number, and address. This data instantly appears on the Donor's private dashboard so they know exactly who is picking up the food.
* **Geographical Accuracy Design:** Designed to utilize standardized address formats to ensure pickup locations are precise and easy to find.

## 🛠️ Technology Stack
* **Frontend:** React.js (Bootstrapped with Vite)
* **Styling:** Tailwind CSS & Lucide React (for icons)
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

**2. Configure Firebase**

* Create a project on the [Firebase Console](https://console.firebase.google.com/).
* Enable **Authentication** (Google Sign-In) and **Firestore Database**.
* Update the configuration keys inside `src/firebase/config.js` with your specific project details.

**3. Start the Development Server**

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

