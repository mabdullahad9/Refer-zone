import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
let AdController = null; // Adsgram fallback controller if needed

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

    const urlParams = new URLSearchParams(window.location.search);
    let referrerId = tg.initDataUnsafe.start_param || urlParams.get("tgWebAppStartParam") || null;

    try {
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
            currentCoins = docSnap.data().coins || 0;
            document.getElementById("player-pph").innerText = docSnap.data().pph || 0;
            
            await updateDoc(userRef, { lastActive: serverTimestamp() });
        } else {
            let initialBonus = 0;
            let referredByField = null;

            if (referrerId && referrerId !== userId) {
                referredByField = referrerId;
                initialBonus = 10000;

                const referrerRef = doc(db, "users", referrerId);
                const referrerSnap = await getDoc(referrerRef);
                if (referrerSnap.exists()) {
                    const referrerCoins = referrerSnap.data().coins || 0;
                    await updateDoc(referrerRef, { coins: referrerCoins + 10000 });
                }
            }

            currentCoins = initialBonus;
            await setDoc(userRef, {
                username: username,
                coins: currentCoins,
                pph: 0,
                referredBy: referredByField,
                createdAt: serverTimestamp(),
                lastActive: serverTimestamp()
            });

            if (initialBonus > 0) {
                alert("🎉 Welcome! You received 10,000 $RZ Referral Bonus.");
            }
        }
        
        updateGlobalUI();
        updateEnergyUI();
        bindCoinTapLogic();

        // 🌟 MONETAG IN-APP INTERSTITIAL AUTOMATION INITIALIZATION
        // Is config se pure session me ads auto-manage hongi (User experience kharab nahi hoga)
        if (window.show_11112958) {
            window.show_11112958({
              type: 'inApp',
              inAppSettings: {
                frequency: 2,       // Max 2 ads dikhein
                capping: 0.1,       // 6 minutes ke interval ke andar
                interval: 30,       // Har ad ke beech kam se kam 30 seconds ka gap ho
                timeout: 5,         // App khulne ke 5 seconds baad pehli ad try kare
                everyPage: false    // Single page app ke liye session save rakhe (False)
              }
            });
        }
        
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

window.switchRoutingEngine = async function(pageName, element = null) {
    if (element) {
        document.querySelectorAll('.tab-trigger').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
    }

    const homeView = document.getElementById("built-in-home");
    const dynamicContainer = document.getElementById("tab-content-container");

    if (pageName === 'home') {
        dynamicContainer.style.display = "none";
        homeView.style.display = "flex";
        updateGlobalUI();
        updateEnergyUI();
    } else {
        homeView.style.display = "none";
        dynamicContainer.style.display = "block";
        
        try {
            const response = await fetch(`${pageName}.html`);
            if (!response.ok) throw new Error(`Status validation error: ${response.status}`);
            
            const htmlContent = await response.text();
            dynamicContainer.innerHTML = htmlContent;

            if (pageName === 'tasks') {
                bindMonetagTriggers(); // Monetag triggered runtime injection
            }
            if (pageName === 'share') {
                renderReferralNetwork();
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
            await updateDoc(userRef, { coins: currentCoins, lastActive: serverTimestamp() });
        } catch (err) {
            console.error("Cloud data writing sequence interrupted:", err);
        }
    });
}

async function renderReferralNetwork() {
    const networkBox = document.getElementById("friends-network-list");
    if (!networkBox || !telegramUser) return;

    networkBox.innerHTML = "<p style='color:#94a3b8; font-size:13px;'>Scanning blockchain registry...</p>";

    try {
        const userId = telegramUser.id.toString();
        const q = query(collection(db, "users"), where("referredBy", "==", userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            networkBox.innerHTML = "<p style='color:#64748b; font-size:13px; margin-top:15px;'>No nodes deployed yet. Invite friends to build pipeline.</p>";
            return;
        }

        let htmlRows = "";
        const now = Date.now();

        querySnapshot.forEach((friendDoc) => {
            const data = friendDoc.data();
            const fName = data.username || "Anonymous Node";
            const fBalance = data.coins || 0;
            
            let statusBadge = "<span style='color:#ef4444; font-size:11px;'>● Offline</span>";
            if (data.lastActive) {
                const lastActiveMs = data.lastActive.seconds * 1000;
                if (now - lastActiveMs < 5 * 60 * 1000) { 
                    statusBadge = "<span style='color:#10b981; font-size:11px; font-weight:bold;'>● Active</span>";
                }
            }

            htmlRows += `
                <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <div>
                        <div style="font-size:14px; font-weight:600; color:#fff;">@${fName}</div>
                        <div style="margin-top:2px;">${statusBadge}</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="color:#f3ba2f; font-weight:bold; font-size:14px;">${fBalance.toLocaleString()} $RZ</div>
                        <div style="font-size:11px; color:#94a3b8;">Earned</div>
                    </div>
                </div>
            `;
        });

        networkBox.innerHTML = htmlRows;
    } catch (err) {
        console.error("Failed to load friend network mapping:", err);
        networkBox.innerHTML = "<p style='color:#ef4444; font-size:12px;'>Network synchronization error.</p>";
    }
}

// 🌟 NEW: MONETAG REWARDED TASK INTEGRATION ENGINE
function bindMonetagTriggers() {
    const watchBtn = document.getElementById("adsgram-bounty-trigger"); // keeping id same to map html layout seamlessly
    if (!watchBtn) return;

    watchBtn.addEventListener("click", function() {
        if (!window.show_11112958) {
            alert("Monetag SDK Gateway offline. Try reloading.");
            return;
        }

        watchBtn.innerText = "Streaming...";
        watchBtn.disabled = true;

        // Monetag Rewarded Interstitial Trigger execution loop
        window.show_11112958().then(() => {
            // Success Reward handler
            currentCoins += 10000; 
            updateGlobalUI();
            
            updateDoc(userRef, { coins: currentCoins, lastActive: serverTimestamp() })
                .then(() => alert("Bounty Credited! 💰 +10,000 $RZ directly verified into your cloud wallet node."))
                .catch(e => console.error("Cloud tracking write error:", e));

            watchBtn.innerText = "Watch";
            watchBtn.disabled = false;
        }).catch((err) => {
            console.error("Monetag delivery exception status:", err);
            alert("Playback interrupted or no ads matching configuration criteria currently available.");
            watchBtn.innerText = "Watch";
            watchBtn.disabled = false;
        });
    });
}
