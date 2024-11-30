import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export default defineNuxtPlugin(() => {

    const firebaseConfig = {
        apiKey: "AIzaSyC0IrWgtmWEZvGmF6f-PemD_p0X1agMV8w",
        authDomain: "medi-link-6ca34.firebaseapp.com",
        projectId: "medi-link-6ca34",
        storageBucket: "medi-link-6ca34.firebasestorage.app",
        messagingSenderId: "1004930224267",
        appId: "1:1004930224267:web:facbd686c58045b960848e"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    return {
        provide: {
            firebaseApp: app,
            db,
            // the above is the same as saying db:db
        }
    }

})

// const { $db } = useNuxtApp()
// the dollar sign marks this as a globally provided variable and to differentiate it from a local variables in a file/componenet