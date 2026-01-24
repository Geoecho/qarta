
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAdgcdCI2VGG1eHttnJuQ2u0SZ1M6atTi8",
    authDomain: "qarta-13864.firebaseapp.com",
    projectId: "qarta-13864",
    storageBucket: "qarta-13864.firebasestorage.app",
    messagingSenderId: "318807206504",
    appId: "1:318807206504:web:e4f26511f865689776e9dd",
    measurementId: "G-HVMD7M88JH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function checkOrders() {
    console.log("Signing in anonymously...");
    await signInAnonymously(auth);
    console.log("Signed in. Fetching last 10 orders...");
    try {
        const q = query(collection(db, "orders"), orderBy("updatedAt", "desc"), limit(10));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No orders found in 'orders' collection.");
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("------------------------------------------------");
            console.log(`ID: ${doc.id}`);
            console.log(`Status: ${data.status}`);
            if (data.items && data.items.length > 0) {
                console.log("First Item Structure:", JSON.stringify(data.items[0], null, 2));
            } else {
                console.log("Items: Empty or Missing");
            }
        });
    } catch (error) {
        console.error("Error fetching orders:", error);

        // If sorting fails, try without sort
        console.log("Retrying without sort...");
        try {
            const q2 = query(collection(db, "orders"), limit(10)); // Just get any
            const snap2 = await getDocs(q2);
            snap2.forEach((doc) => {
                console.log(`[Unsorted] ID: ${doc.id}, Slug: ${doc.data().restaurantSlug}, Status: ${doc.data().status}`);
            });
        } catch (e) {
            console.error("Fatal Error:", e);
        }
    }
}

checkOrders();
