// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDPH20_SKRIDdhhewUUvLlbhSGot0UxMj8",
  authDomain: "promptbook-3e8ae.firebaseapp.com",
  projectId: "promptbook-3e8ae",
  storageBucket: "promptbook-3e8ae.firebasestorage.app",
  messagingSenderId: "434608762522",
  appId: "1:434608762522:web:1192a4e26eee3ea58e7923",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
