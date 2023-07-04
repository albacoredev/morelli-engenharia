// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { connectFirestoreEmulator, getFirestore } from '@firebase/firestore';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyAzL9O8k-2ndB3ZgR4AWxyxivtUuXUMSd4',
	authDomain: 'morelli-engenharia.firebaseapp.com',
	projectId: 'morelli-engenharia',
	storageBucket: 'morelli-engenharia.appspot.com',
	messagingSenderId: '76741618291',
	appId: '1:76741618291:web:d00e476ec6b78d1ee4d806',
	measurementId: 'G-JHS7JJ3TGB'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = null; // getAnalytics(app);
const auth = getAuth(app);

connectAuthEmulator(auth, 'http://localhost:9099');
connectFirestoreEmulator(db, 'localhost', 8080);

export { db, analytics, auth };
