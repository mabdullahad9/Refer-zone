import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

let currentCoins = 0;
const maxEnergy = 6000;
let currentEnergy = maxEnergy;
let telegramUser = null;
let userRef = null;
let AdController = null;

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
        
        // Front-load counters directly on application start frame
        updateGlobalUI();
        updateEnergyUI();
        bindCoinTapLogic(); // Shuru mein hi coin tap logic active kar do

        // Adsgram runtime module verification
        if (window.Adsgram) {
            AdController = window.Adsgram.init({ blockId: "34273" });
        }
        
        // Smooth stamina increment configuration loop
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

function updateEnergyUI() {
    const energyText = document.getElementById("energy-current-val");
    const energyFill = document.getElementById("energy-fill-indicator");
    
    if (energyText && energyFill) {
        energyText.innerText = currentEnergy;
        const percentage = (currentEnergy / maxEnergy) * 100;
        energyFill.style.width = `${percentage}%`;
    }
}

// --- Dynamic View Routing Layout Engine ---
window.switchRoutingEngine = async function(pageName, element = null) {
    if (element) {
        document.querySelectorAll('.tab-trigger').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
    }

    const homeView = document.getElementById("built-in-home");
    const dynamicContainer = document.getElementById("tab-content-container");

    if (pageName === 'home') {
        // Real-time toggle: Home layout show, rest hide
        dynamicContainer.style.display = "none";
        homeView.style.display = "flex";
        updateGlobalUI();
        updateEnergyUI();
    } else {
        // Fetch external views into container layout frame
        homeView.style.display = "none";
        dynamicContainer.style.display = "block";
        
        try {
            const response = await fetch(`${pageName}.html`);
            if (!response.ok) throw new Error(`Status validation error: ${response.status}`);
            
            const htmlContent = await response.text();
            dynamicContainer.innerHTML = htmlContent;

            if (pageName === 'tasks') {
                bindAdsgramTriggers();
            }
        } catch (err) {
            console.error("View distribution breaking routing matrix stack:", err);
        }
    }
};

function bindCoinTapLogic() {
    const tapBtn = document.getElementById("coin-interaction-node");
    if (!tapBtn) return;

    tapBtn.addEventListener("click", async function () {
        if (currentEnergy <= 0) return;

        currentCoins += 1;
        currentEnergy -= 1;
        
        updateGlobalUI();
        updateEnergyUI();

        try {
            await updateDoc(userRef, { coins: currentCoins });
        } catch (err) {
            console.error("Cloud data writing sequence interrupted:", err);
        }
    });
}

function bindAdsgramTriggers() {
    const watchBtn = document.getElementById("adsgram-bounty-trigger");
    if (!watchBtn) return;

    watchBtn.addEventListener("click", function() {
        if (!AdController && window.Adsgram) {
            AdController = window.Adsgram.init({ blockId: "34273" });
        }

        if (!AdController) {
            alert("Adsgram Network Framework offline. Reloading recommended.");
            return;
        }

        watchBtn.innerText = "Processing...";
        watchBtn.disabled = true;

        AdController.show().then((result) => {
            currentCoins += 10000; 
            updateGlobalUI();
            
            updateDoc(userRef, { coins: currentCoins })
                .then(() => alert("Bounty Credited! 💰 +10,000 $RZ added."))
                .catch(e => console.error("Cloud state exception handling sync:", e));

            watchBtn.innerText = "Watch";
            watchBtn.disabled = false;
        }).catch((result) => {
            alert("Playback terminated or connection failure.");
            watchBtn.innerText = "Watch";
            watchBtn.disabled = false;
        });
    });
}
