# Fix Mate

This project is **Fix Mate**, a service platform built using **React Native** with **Expo** and integrated with **Firebase** for backend services. The system incorporates **Expo Map** for displaying repair shop locations and calculating distances between customers and shops, making service discovery easier.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Firebase Setup](#firebase-setup)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Map Integration**: Displays all repair shop locations on an interactive map using **Expo Map**.
- **Distance Calculation**: Real-time distance generation between customers and each shop for better service access.
- **Shop Location Management**: Manage repair shop locations and display them on the map.
- **User Authentication**: Secure Firebase authentication for user account management.

## Tech Stack

- **React Native** with Expo
- **Firebase** (Authentication, Firestore, Storage)
- **Expo Map** for map functionality and distance calculations
- **Zustand** for state management
- **Node.js** (for any backend services, if applicable)

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

You need to have the following installed on your machine:

- **Node.js**: [Download here](https://nodejs.org/)
- **Expo CLI**: `npm install -g expo-cli`
- **Firebase Account**: [Firebase Console](https://console.firebase.google.com/)

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/your-username/fix-mate.git
   ```

2. Navigate to the project directory:
   ```sh
   cd fix-mate
   ```

3. Install the dependencies:
   ```sh
   npm install
   ```

### Usage

Start the Expo server:

```sh
npx expo start
```

Open the Expo Go app on your mobile device and scan the QR code to run the app.

### Firebase Setup

1. Create a new project in [Firebase](https://console.firebase.google.com/).
2. Enable **Firebase Authentication**, **Cloud Firestore**, and **Storage**.
3. Get your Firebase configuration details (API key, Auth domain, etc.) from the Firebase console.
4. Create a `Firebase_Config.ts` file in the `fix-mate/Firebase_Config.ts` folder.
Replace the placeholders with your actual Firebase configuration keys:

```typescript
// Firebase_Config.ts

import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const Firebase_Config = {
    apiKey: "your_api_key",
    authDomain: "your_project_id.firebaseapp.com",
    projectId: "your_project_id",
    storageBucket: "your_project_id.appspot.com",
    messagingSenderId: "your_sender_id",
    appId: "your_app_id"
};

const FIREBASE_APP = initializeApp(Firebase_Config);
const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
     persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const FIREBASE_DB = getFirestore(FIREBASE_APP);

export { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB };
```

Save the file, and your Firebase setup is complete!

### License

Distributed under the MIT License. See `LICENSE` for more information.
