// 1. Firebase Modules ko Import karna (Latest SDK v9+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. Aap Ka Exact Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkc84Awm5Jv6S886jeztxVX-ISq7gNlpE",
  authDomain: "refer-zone-213bf.firebaseapp.com",
  projectId: "refer-zone-213bf",
  storageBucket: "refer-zone-213bf.firebasestorage.app",
  messagingSenderId: "985924046754",
  appId: "1:985924046754:web:95a33081ec1029792cacfb",
  measurementId: "G-EW3Q3QYYH1"
};

// Firebase aur Firestore ko Initialize karna
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Global Variables
let currentCoins = 0;
let telegramUser = null;

document.addEventListener("DOMContentLoaded", async function () {
    // 3. Telegram Security Check
    const tg = window.Telegram?.WebApp;
    const isTelegram = tg && tg.initData && tg.initDataUnsafe && tg.initDataUnsafe.user;

    if (!isTelegram) {
        // Agar normal browser (Chrome/Safari) hai toh block screen dikhao
        document.body.innerHTML = `
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; background-color: #121212; color: white; text-align: center; padding: 20px; font-family: Arial;">
                <h2 style="color: #f44336;">Access Denied! ❌</h2>
                <p style="font-size: 18px;">Yeh game sirf Telegram Bot ke andar chalti hai.</p>
                <a href="https://t.me/ReferZoneTap_bot" style="margin-top: 20px; padding: 12px 24px; background-color: #2481cc; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Open in Telegram</a>
            </div>
        `;
        return;
    }

    // Telegram UI ko full screen karna
    tg.ready();
    tg.expand();

    // User Data extract karna jo Telegram ne bheja
    telegramUser = tg.initDataUnsafe.user;
    const userId = telegramUser.id.toString(); 
    const username = telegramUser.username || telegramUser.first_name || "Player";

    document.getElementById("welcome-msg").innerText = `Welcome, @${username}!`;
    document.getElementById("game-container").style.display = "block";

    // 4. Firestore Document Reference (Latest Method)
    const userRef = doc(db, "users", userId);

    try {
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            // Purana user hai toh coins load karo
            currentCoins = docSnap.data().coins || 0;
        } else {
            // Naya user hai toh entry banao
            currentCoins = 0;
            await setDoc(userRef, {
                username: username,
                coins: 0,
                createdAt: serverTimestamp()
            });
        }
        // Screen par balance dikhana
        document.getElementById("coin-balance").innerText = currentCoins;
    } catch (error) {
        console.error("Data load karne mein error aya:", error);
    }

    // 5. Tap Button ki Click Logic
    const tapBtn = document.getElementById("tap-button");
    const balanceDisplay = document.getElementById("coin-balance");

    tapBtn.addEventListener("click", async function () {
        // 1 Coin plus karo frontend par foran
        currentCoins += 1;
        balanceDisplay.innerText = currentCoins;

        // Background mein Firestore Database mein update bhejna (Latest Method)
        try {
            await updateDoc(userRef, {
                coins: currentCoins
            });
        } catch (err) {
            console.error("Database automatic save failed:", err);
        }
    });
});
