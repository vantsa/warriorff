import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAaWLKm4yDcNfRLZARdOOD1-pG4utBbNXQ",
    authDomain: "warriorfunctionalfitnesstest.firebaseapp.com",
    projectId: "warriorfunctionalfitnesstest",
    storageBucket: "warriorfunctionalfitnesstest.appspot.com",
    messagingSenderId: "371897807623",
    appId: "1:371897807623:web:256d45dcd476e66f884ba2",
    measurementId: "G-9Y4SBPFER9"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }