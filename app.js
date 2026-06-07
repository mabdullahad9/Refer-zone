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

document.addEventListener("DOMContentLoaded", async function () {
    const tg = window.Telegram?.WebApp;
    const isTelegram = tg && tg.initData && tg.initDataUnsafe && tg.initDataUnsafe.user;[span_2](start_span)[span_2](end_span)

    // 🌟 SAFARI & OUTSIDE BROWSER BLOCKER DETECTOR
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isDirectBrowser = !userAgent.includes("Telegram");

    // Agar user direct Safari/Chrome se aaye ya invalid Telegram context ho
    if (!isTelegram || isDirectBrowser) {[span_3](start_span)[span_3](end_span)
        document.getElementById("main-viewport").style.display = "none";[span_4](start_span)[span_4](end_span)
        document.getElementById("master-nav").style.display = "none";[span_5](start_span)[span_5](end_span)
        document.getElementById("denied-screen").style.display = "flex";[span_6](start_span)[span_6](end_span)
        return;[span_7](start_span)[span_7](end_span)
    }

    // Sirf Telegram par chalne par hi screens layout normal show hoga
    document.getElementById("denied-screen").style.display = "none";[span_8](start_span)[span_8](end_span)
    document.getElementById("main-viewport").style.display = "block";[span_9](start_span)[span_9](end_span)
    document.getElementById("master-nav").style.display = "flex";[span_10](start_span)[span_10](end_span)

    tg.ready();[span_11](start_span)[span_11](end_span)
    tg.expand();[span_12](start_span)[span_12](end_span)

    telegramUser = tg.initDataUnsafe.user;[span_13](start_span)[span_13](end_span)
    const userId = telegramUser.id.toString();[span_14](start_span)[span_14](end_span)
    const username = telegramUser.username || telegramUser.first_name || "Player";[span_15](start_span)[span_15](end_span)

    document.getElementById("player-id").innerText = `@${username}`;[span_16](start_span)[span_16](end_span)
    userRef = doc(db, "users", userId);[span_17](start_span)[span_17](end_span)

    // Deep link parameters handle karna referral tracking ke liye
    const urlParams = new URLSearchParams(window.location.search);
    let referrerId = tg.initDataUnsafe.start_param || urlParams.get("tgWebAppStartParam") || null;

    try {
        const docSnap = await getDoc(userRef);[span_18](start_span)[span_18](end_span)
        
        if (docSnap.exists()) {
            // Existing User Tracking update
            currentCoins = docSnap.data().coins || 0;[span_19](start_span)[span_19](end_span)
            document.getElementById("player-pph").innerText = docSnap.data().pph || 0;[span_20](start_span)[span_20](end_span)
            
            await updateDoc(userRef, { lastActive: serverTimestamp() });
        } else {
            // New User Registration Process + Reward Logic
            let initialBonus = 0;
            let referredByField = null;

            if (referrerId && referrerId !== userId) {
                referredByField = referrerId;
                initialBonus = 10000; // New user reward chunk

                // Referrer (Purane Dost) ke wallet nodes me +10k save karna
                const referrerRef = doc(db, "users", referrerId);
                const referrerSnap = await getDoc(referrerRef);
                if (referrerSnap.exists()) {
                    const referrerCoins = referrerSnap.data().coins || 0;
                    await updateDoc(referrerRef, { coins: referrerCoins + 10000 });
                }
            }

            currentCoins = initialBonus;
            await setDoc(userRef, {[span_21](start_span)[span_21](end_span)
                username: username,[span_22](start_span)[span_22](end_span)
                coins: currentCoins,[span_23](start_span)[span_23](end_span)
                pph: 0,[span_24](start_span)[span_24](end_span)
                referredBy: referredByField,
                createdAt: serverTimestamp(),[span_25](start_span)[span_25](end_span)
                lastActive: serverTimestamp()
            });

            if (initialBonus > 0) {
                alert("🎉 Welcome! You received 10,000 $RZ Referral Bonus.");
            }
        }
        
        updateGlobalUI();[span_26](start_span)[span_26](end_span)
        updateEnergyUI();[span_27](start_span)[span_27](end_span)
        bindCoinTapLogic();[span_28](start_span)[span_28](end_span)

        // 🌟 MONETAG IN-APP INTERSTITIAL AUTOMATION HOOK
        if (window.show_11112958) {
            window.show_11112958({
              type: 'inApp',
              inAppSettings: {
                frequency: 2,       // Maximum 2 ads dikhein ek specific session framework me
                capping: 0.1,       // 6 minutes ke dauran capping framework active rahe
                interval: 30,       // Har ad popup loop me 30 seconds ka safe gap ho
                timeout: 5,         // App start hone ke exact 5 seconds baad pehli ad auto render ho
                everyPage: false    // Single-page router configuration optimization setup (False)
              }
            });
        }
        
        setInterval(() => {[span_29](start_span)[span_29](end_span)
            if (currentEnergy < maxEnergy) {[span_30](start_span)[span_30](end_span)
                currentEnergy = Math.min(maxEnergy, currentEnergy + 5);[span_31](start_span)[span_31](end_span)
                updateEnergyUI();[span_32](start_span)[span_32](end_span)
            }
        }, 3000);[span_33](start_span)[span_33](end_span)

    } catch (error) {
        console.error("Critical core sync error:", error);[span_34](start_span)[span_34](end_span)
    }
});

function updateGlobalUI() {[span_35](start_span)[span_35](end_span)
    const counterDisplay = document.getElementById("master-coin-counter");[span_36](start_span)[span_36](end_span)
    if (counterDisplay) counterDisplay.innerText = currentCoins;[span_37](start_span)[span_37](end_span)
}

function updateEnergyUI() {[span_38](start_span)[span_38](end_span)
    const energyText = document.getElementById("energy-current-val");[span_39](start_span)[span_39](end_span)
    const energyFill = document.getElementById("energy-fill-indicator");[span_40](start_span)[span_40](end_span)
    
    if (energyText && energyFill) {[span_41](start_span)[span_41](end_span)
        energyText.innerText = currentEnergy;[span_42](start_span)[span_42](end_span)
        const percentage = (currentEnergy / maxEnergy) * 100;[span_43](start_span)[span_43](end_span)
        energyFill.style.width = `${percentage}%`;[span_44](start_span)[span_44](end_span)
    }
}

window.switchRoutingEngine = async function(pageName, element = null) {[span_45](start_span)[span_45](end_span)
    if (element) {
        document.querySelectorAll('.tab-trigger').forEach(el => el.classList.remove('active'));[span_46](start_span)[span_46](end_span)
        element.classList.add('active');[span_47](start_span)[span_47](end_span)
    }

    const homeView = document.getElementById("built-in-home");[span_48](start_span)[span_48](end_span)
    const dynamicContainer = document.getElementById("tab-content-container");[span_49](start_span)[span_49](end_span)

    if (pageName === 'home') {[span_50](start_span)[span_50](end_span)
        dynamicContainer.style.display = "none";[span_51](start_span)[span_51](end_span)
        homeView.style.display = "flex";[span_52](start_span)[span_52](end_span)
        updateGlobalUI();[span_53](start_span)[span_53](end_span)
        updateEnergyUI();[span_54](start_span)[span_54](end_span)
    } else {
        homeView.style.display = "none";[span_55](start_span)[span_55](end_span)
        dynamicContainer.style.display = "block";[span_56](start_span)[span_56](end_span)
        
        try {
            const response = await fetch(`${pageName}.html`);[span_57](start_span)[span_57](end_span)
            if (!response.ok) throw new Error(`Status validation error: ${response.status}`);[span_58](start_span)[span_58](end_span)
            
            const htmlContent = await response.text();[span_59](start_span)[span_59](end_span)
            dynamicContainer.innerHTML = htmlContent;[span_60](start_span)[span_60](end_span)

            if (pageName === 'tasks') {[span_61](start_span)[span_61](end_span)
                bindMonetagTriggers(); // Monetag runtime trigger hook
            }
            if (pageName === 'share') {
                renderReferralNetwork(); // Live dynamic user friend network trace engine
            }
        } catch (err) {
            console.error("View distribution breaking routing matrix stack:", err);[span_62](start_span)[span_62](end_span)
        }
    }
};

function bindCoinTapLogic() {[span_63](start_span)[span_63](end_span)
    const tapBtn = document.getElementById("coin-interaction-node");[span_64](start_span)[span_64](end_span)
    if (!tapBtn) return;[span_65](start_span)[span_65](end_span)

    tapBtn.addEventListener("click", async function () {[span_66](start_span)[span_66](end_span)
        if (currentEnergy <= 0) return;[span_67](start_span)[span_67](end_span)

        currentCoins += 1;[span_68](start_span)[span_68](end_span)
        currentEnergy -= 1;[span_69](start_span)[span_69](end_span)
        
        updateGlobalUI();[span_70](start_span)[span_70](end_span)
        updateEnergyUI();[span_71](start_span)[span_71](end_span)

        try {
            await updateDoc(userRef, { coins: currentCoins, lastActive: serverTimestamp() });
        } catch (err) {
            console.error("Cloud data writing sequence interrupted:", err);[span_72](start_span)[span_72](end_span)
        }
    });
}

// 🌟 LIVE NETWORK VISUALIZER (Dost ki Earning aur Activity)
async function renderReferralNetwork() {
    const networkBox = document.getElementById("friends-network-list");
    if (!networkBox || !telegramUser) return;

    networkBox.innerHTML = "<p style='color:#94a3b8; font-size:13px;'>Scanning blockchain registry...</p>";

    try {
        const userId = telegramUser.id.toString();
        // Firestore queries to find children references
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
            
            // Last active time 5 minutes se kam ho to live active status display ho
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

// 🌟 MONETAG REWARDED AD VIDEO INTERFACE FOR TASKS TAB
function bindMonetagTriggers() {
    const watchBtn = document.getElementById("adsgram-bounty-trigger"); // keeping id same to ensure view rendering doesn't crash[span_73](start_span)[span_73](end_span)
    if (!watchBtn) return;

    watchBtn.addEventListener("click", function() {
        if (!window.show_11112958) {
            alert("Monetag Ad SDK Core Engine offline. Try reloading app layout.");
            return;
        }

        watchBtn.innerText = "Streaming...";
        watchBtn.disabled = true;

        // Monetag dynamic async promise handler call loop
        window.show_11112958().then(() => {
            // Reward verified callback function loop executions
            currentCoins += 10000; 
            updateGlobalUI();
            
            updateDoc(userRef, { coins: currentCoins, lastActive: serverTimestamp() })
                .then(() => alert("Bounty Credited! 💰 +10,000 $RZ successfully validated into your central cloud node stack."))
                .catch(e => console.error("Cloud dynamic tracking write mismatch error:", e));

            watchBtn.innerText = "Watch";
            watchBtn.disabled = false;
        }).catch((err) => {
            console.error("Monetag ad rendering interrupted exception context:", err);
            alert("Playback interrupted or no matching ad configurations currently match location matrix.");
            watchBtn.innerText = "Watch";
            watchBtn.disabled = false;
        });
    });
}
