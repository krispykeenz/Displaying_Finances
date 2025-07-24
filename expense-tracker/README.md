# Expense Tracker Mobile App

A cross-platform mobile application for personal expense tracking built with React Native, Firebase, Redux, and Chart.js.

## Features

- **User Authentication**: Secure login and registration with Firebase Auth
- **Expense Tracking**: Add, edit, and delete income and expenses
- **Categories**: Organize transactions by customizable categories
- **Data Visualization**: Interactive charts showing spending patterns
- **Real-time Sync**: Data synced across devices using Firebase Firestore
- **Cross-Platform**: Works on both iOS and Android

## Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build tool
- **TypeScript**: Type-safe JavaScript
- **Firebase**: Backend services (Auth, Firestore)
- **Redux Toolkit**: State management
- **React Navigation**: Navigation between screens
- **React Native Chart Kit**: Data visualization
- **React Native Paper**: UI components

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd expense-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Authentication and Firestore
   - Copy your Firebase config and replace the placeholder in `src/services/firebase.ts`

4. Start the development server:
```bash
npm start
```

5. Run on your device:
   - Install Expo Go app on your mobile device
   - Scan the QR code from the terminal
   - Or run on simulator: `npm run ios` or `npm run android`

## Project Structure

```
src/
├── components/          # Reusable UI components
├── navigation/         # Navigation configuration
├── screens/           # Screen components
├── services/          # Firebase and API services
├── store/            # Redux store and slices
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Firebase Configuration

Replace the Firebase configuration in `src/services/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## Available Scripts

- `npm start`: Start the Expo development server
- `npm run android`: Run on Android device/emulator
- `npm run ios`: Run on iOS device/simulator
- `npm run web`: Run in web browser
- `npm run eject`: Eject from Expo (not recommended)

## Features Overview

### Authentication
- Email/password authentication
- User registration and login
- Secure logout functionality

### Expense Management
- Add income and expenses
- Categorize transactions
- Set custom amounts and descriptions
- Date selection for transactions

### Data Visualization
- Pie chart showing expenses by category
- Line chart showing monthly spending trends
- Summary statistics and totals

### User Profile
- View account information
- Transaction statistics
- App settings and logout

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
