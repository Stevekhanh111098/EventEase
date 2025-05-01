# EventEase

EventEase is a cross-platform mobile application for seamless event planning and management. Built with React Native and Expo, it enables users to create events, manage guest lists, track budgets, assign tasks, and discover vendors—all in one place. Real-time data sync and authentication are powered by Firebase.

## Key Features
- Event creation with step-by-step forms
- Guest list management with RSVP and meal preferences
- Budget tracking and expense management
- Task checklist for event planning
- Vendor discovery and booking
- Real-time updates and secure authentication

## Tech Stack
- React Native & Expo
- Firebase (Firestore & Auth)
- Modular, component-based architecture

## Getting Started

Follow these steps to set up the project locally:

1. **Clone the repository**
   ```sh
   git clone https://github.com/Stevekhanh111098/EventEase.git
   cd EventEase
   ```

2. **Checkout to the `feat/events` branch**
   ```sh
   git checkout feat/events
   ```

3. **Install dependencies**
   ```sh
   npm install
   ```

4. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/), create a new project (or use an existing one).
   - Add a web app to your Firebase project.
   - Copy your Firebase config and update the `firebase.ts` file in the project root with your credentials.
   - Enable Firestore Database and Authentication (Email/Password and Google) in the Firebase console.

5. **Run the project**
   ```sh
   npx expo start
   ```
   - Scan the QR code with Expo Go app on your Android/iOS device, or use an emulator/simulator.