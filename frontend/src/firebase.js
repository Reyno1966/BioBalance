import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Configuración de Firebase del usuario
const firebaseConfig = {
    apiKey: "AIzaSyAgOFDfH-LlUWhdxCgBv63btwf7TMRZMsk",
    authDomain: "biobalance-3f807.firebaseapp.com",
    projectId: "biobalance-3f807",
    storageBucket: "biobalance-3f807.firebasestorage.app",
    messagingSenderId: "983533198814",
    appId: "1:983533198814:web:7a2b3ec948e9be1c5ed14f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
