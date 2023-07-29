// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import {
	connectFirestoreEmulator,
	Firestore,
	getFirestore,
	initializeFirestore
} from '@firebase/firestore';
import {
	browserSessionPersistence,
	connectAuthEmulator,
	getAuth,
	setPersistence
} from 'firebase/auth';
import { browser } from '$app/environment';
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
const storage = getStorage();
const analytics = null; // getAnalytics(app);
const auth = getAuth(app);
let db: Firestore;

if (browser && window.location.href.includes('localhost')) {
	db = initializeFirestore(app, { experimentalForceLongPolling: true });

	setPersistence(auth, browserSessionPersistence);

	connectAuthEmulator(auth, 'http://localhost:9099');
	connectFirestoreEmulator(db, 'localhost', 8080);
	connectStorageEmulator(storage, 'localhost', 9199);
} else {
	db = getFirestore(app);
}

export { db, analytics, auth, storage };
