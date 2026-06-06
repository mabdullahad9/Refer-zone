import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Accurate Verified System Configuration Mapping
const firebaseConfig = {
  apiKey: "AIzaSyDkc84Awm5Jv6S886jeztxVX-ISq7gNlpE",
  authDomain: "refer-zone-213bf.firebaseapp.com",
  projectId: "refer-zone-213bf",
  storageBucket: "refer-zone-213bf.firebasestorage.app",
  messagingSenderId: "985924046754",
  appId: "1:985924046754:web:95a33081ec1029792cacfb",
  measurementId: "G-EW3Q3QYYH1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Global Runtime Core State Management Variables
let currentCoins = 0;
const maxEnergy = 6000;
let currentEnergy = maxEnergy; // Set full energy at default initial states
let telegramUser = null;
let userRef = null;
let AdController = null; // Adsgram Active Reference Framework Node

document.addEventListener("DOMContentLoaded", async function () {
    const tg = window.Telegram?.WebApp;
    const isTelegram = tg && tg.initData && tg.initDataUnsafe && tg.initDataUnsafe.user;

    if (!isTelegram) {
        document.getElementById("denied-screen").style.display = "flex";
        return;
    }

    document.getElementById("denied-screen").style.display = "none";
    document.getElementById("main-viewport").style.display = "block";
    document.getElementById("master-nav").style.display = "flex";

    tg.ready();
    tg.expand();

    telegramUser = tg.initDataUnsafe.user;
    const userId = telegramUser.id.toString();
    const username = telegramUser.username || telegramUser.first_name || "Player";

    document.getElementById("player-id").innerText = `@${username}`;
    userRef = doc(db, "users", userId);

    try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            currentCoins = docSnap.data().coins || 0;
            document.getElementById("player-pph").innerText = docSnap.data().pph || 0;
        } else {
            currentCoins = 0;
            await setDoc(userRef, {
                username: username,
                coins: 0,
                pph: 0,
                createdAt: serverTimestamp()
            });
        }
        updateGlobalUI();
        
        // --- ADSGRAM CONTROLLER ACTIVE INITIALIZATION ---
        // Real Rewarded Ad Unit Block ID Connected Successfully
        if (window.Adsgram) {
            AdController = window.Adsgram.init({ blockId: "34273" });
        }

        loadTabModule('home'); 
        
        // --- HOURLY SMOOTH REGENERATION LOOP ENGINE ---
        // Adds +5 stamina points every 3 seconds (Fills exactly 6000/hr)
        setInterval(() => {
            if (currentEnergy < maxEnergy) {
                currentEnergy = Math.min(maxEnergy, currentEnergy + 5);
                updateEnergyUI();
            }
        }, 3000);

    } catch (error) {
        console.error("Critical core sync error:", error);
    }
});

function updateGlobalUI() {
    const counterDisplay = document.getElementById("master-coin-counter");
    if (counterDisplay) counterDisplay.innerText = currentCoins;
}

// Energy Interface Element Dynamic Syncer
function updateEnergyUI() {
    const energyText = document.getElementById("energy-current-val");
    const energyFill = document.getElementById("energy-fill-indicator");
    
    if (energyText && energyFill) {
        energyText.innerText = currentEnergy;
        const percentage = (currentEnergy / maxEnergy) * 100;
        energyFill.style.width = `${percentage}%`;
    }
}

window.loadTabModule = async function(pageName, element = null) {
    if (element) {
        document.querySelectorAll('.tab-trigger').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
    }

    try {
        const response = await fetch(`${pageName}.html`);
        if (!response.ok) throw new Error(`Status verification error: ${response.status}`);
        
        const htmlContent = await response.text();
        document.getElementById("content-loader").innerHTML = htmlContent;

        if (pageName === 'home') {
            bindCoinTapLogic();
            updateEnergyUI(); // Direct execution frame sync focus
        }
        if (pageName === 'tasks') {
            bindAdsgramTriggers();
        }
    } catch (err) {
        console.error("Module deployment crashing logic stack trace:", err);
    }
};

function bindCoinTapLogic() {
    const tapBtn = document.getElementById("coin-interaction-node");
    if (!tapBtn) return;

    tapBtn.addEventListener("click", async function () {
        if (currentEnergy <= 0) return; // Disallow system inputs if dry

        currentCoins += 1;
        currentEnergy -= 1;
        
        updateGlobalUI();
        updateEnergyUI();

        try {
            await updateDoc(userRef, { coins: currentCoins });
        } catch (err) {
            console.error("Cloud async sync trace interruption:", err);
        }
    });
}

// --- ADSGRAM REWARD ENGINE INTEGRATION EVENT HOOKS ---
function bindAdsgramTriggers() {
    const watchBtn = document.getElementById("adsgram-bounty-trigger");
    if (!watchBtn) return;

    watchBtn.addEventListener("click", function() {
        if (!AdController) {
            alert("Adsgram Network Framework offline. Reloading recommended.");
            return;
        }

        watchBtn.innerText = "Processing...";
        watchBtn.disabled = true;

        AdController.show().then((result) => {
            // Success handler: Ad completed fully
            currentCoins += 10000; 
            updateGlobalUI();
            
            updateDoc(userRef, { coins: currentCoins })
                .then(() => alert("Bounty Credited! 💰 +10,000 $RZ added."))
                .catch(e => console.error("Database cloud write error:", e));

            watchBtn.innerText = "Watch";
            watchBtn.disabled = false;
        }).catch((result) => {
            // Failure/Skipped handler
            alert("Playback terminated or connection failure.");
            watchBtn.innerText = "Watch";
            watchBtn.disabled = false;
        });
    });
}
