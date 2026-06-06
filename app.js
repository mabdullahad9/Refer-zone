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

// Global State Variables
let currentCoins = 0;
let telegramUser = null;
let userRef = null;

document.addEventListener("DOMContentLoaded", async function () {
    // 3. Telegram Security Verification Check
    const tg = window.Telegram?.WebApp;
    const isTelegram = tg && tg.initData && tg.initDataUnsafe && tg.initDataUnsafe.user;

    if (!isTelegram) {
        // Agar real webapp container nahi hai toh block screen active rakho
        document.getElementById("denied-screen").style.display = "flex";
        return;
    }

    // Telegram UI aur full screen set karna
    tg.ready();
    tg.expand();

    // User Data extract karna jo Telegram ne bheja
    telegramUser = tg.initDataUnsafe.user;
    const userId = telegramUser.id.toString(); 
    const username = telegramUser.username || telegramUser.first_name || "Player";

    // Layout Screens mapping toggle karna (Naye IDs ke mutabik)
    document.getElementById("denied-screen").style.display = "none";
    document.getElementById("main-viewport").style.display = "block";
    document.getElementById("master-nav").style.display = "flex";
    
    // User tag set karna
    document.getElementById("player-id").innerText = `@${username}`;

    // 4. Firestore Document Reference Tracking
    userRef = doc(db, "users", userId);

    try {
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            // Purana user hai toh coins load karo
            currentCoins = docSnap.data().coins || 0;
            const currentPPH = docSnap.data().pph || 0;
            document.getElementById("player-pph").innerText = currentPPH;
        } else {
            // Naya user hai toh entry banao
            currentCoins = 0;
            await setDoc(userRef, {
                username: username,
                coins: 0,
                pph: 0,
                createdAt: serverTimestamp()
            });
        }
        // Top Global Header screen par balance sync karna
        updateGlobalUI();
        
        // Pehli dafa default 'home.html' module load karna
        loadTabModule('home');
        
    } catch (error) {
        console.error("Firebase data fetch engine failure:", error);
    }
});

// UI Balance Update Utility
function updateGlobalUI() {
    const counterDisplay = document.getElementById("master-coin-counter");
    if (counterDisplay) {
        counterDisplay.innerText = currentCoins;
    }
}

// 5. Multi-File Routing Engine (Async HTML Module Fetcher)
window.loadTabModule = async function(pageName, element = null) {
    // Agar custom navigation bar button se trigger hua hai toh active status toggle karo
    if (element) {
        document.querySelectorAll('.tab-trigger').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
    }

    try {
        // External file load karna
        const response = await fetch(`${pageName}.html`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const htmlContent = await response.text();
        document.getElementById("content-loader").innerHTML = htmlContent;

        // Agar HOME screen load hui hai toh tap handler event dubara bind karo
        if (pageName === 'home') {
            bindCoinTapLogic();
        }
    } catch (err) {
        console.error("Module loading routing crash:", err);
    }
};

// 6. Home Tab Coin Interaction Handler
function bindCoinTapLogic() {
    const tapBtn = document.getElementById("coin-interaction-node");
    if (!tapBtn) return;

    tapBtn.addEventListener("click", async function () {
        // Frontend rendering fast karne ke liye direct value update
        currentCoins += 1;
        updateGlobalUI();

        // Background Cloud Firestore update request push hook
        try {
            await updateDoc(userRef, {
                coins: currentCoins
            });
        } catch (err) {
            console.error("Database cloud write error:", err);
        }
    });
}
