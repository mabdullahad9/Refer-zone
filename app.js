import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ==========================================
// 1. FIREBASE CONFIGURATION & INITIALIZATION
// ==========================================
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

// Global Variables
let currentCoins = 0;
const maxEnergy = 6000;
let currentEnergy = maxEnergy;
let telegramUser = null;
let userRef = null;

// ==========================================
// 2. BOOTSTRAPPER & ANTI-BROWSER EXPLORER LOCK
// ==========================================
document.addEventListener("DOMContentLoaded", async function () {
    const tg = window.Telegram?.WebApp;
    
    // Strict Telegram validation handshake
    const hasValidTgContext = tg && tg.initData && tg.initDataUnsafe && tg.initDataUnsafe.user;

    // FIX FOR APPLE (iOS): standard navigation parsing method
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Safely validates standalone external browsers while passing Telegram iOS WebKit environments
    const isExternalBrowser = !hasValidTgContext && (userAgent.includes("Safari") || userAgent.includes("Chrome") || userAgent.includes("Opera"));

    // Dynamic Blocker Fire wall
    if (!hasValidTgContext || isExternalBrowser) {
        document.getElementById("main-viewport").style.display = "none";
        document.getElementById("master-nav").style.display = "none";
        document.getElementById("denied-screen").style.display = "flex";
        return;
    }

    // Telegram UI Interface Authorization Granted
    document.getElementById("denied-screen").style.display = "none";
    document.getElementById("main-viewport").style.display = "block";
    if(document.getElementById("master-nav")) {
        document.getElementById("master-nav").style.display = "flex";
    }

    tg.ready();
    tg.expand(); // Maximizes application layout area

    telegramUser = tg.initDataUnsafe.user;
    const userId = telegramUser.id.toString();
    const username = telegramUser.username || telegramUser.first_name || "Player";

    const playerIdEl = document.getElementById("player-id");
    if (playerIdEl) playerIdEl.innerText = `@${username}`;
    
    userRef = doc(db, "users", userId);

    // Deep link validation parsing engine
    const urlParams = new URLSearchParams(window.location.search);
    let referrerId = tg.initDataUnsafe.start_param || urlParams.get("tgWebAppStartParam") || null;

    try {
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
            // Existing node data restoration tracking
            currentCoins = docSnap.data().coins || 0;
            const pphEl = document.getElementById("player-pph");
            if (pphEl) pphEl.innerText = docSnap.data().pph || 0;
            
            await updateDoc(userRef, { lastActive: serverTimestamp() });
        } else {
            // Strategic Referral Distribution Framework
            let initialBonus = 0;
            let referredByField = null;

            if (referrerId && referrerId !== userId) {
                referredByField = referrerId;
                initialBonus = 10000; // Registration incentive bonus node

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

        // 🌟 MONETAG RUNTIME CORE AUTOMATION AUTOMATION INTERSTITIAL
        if (window.show_11112958) {
            window.show_11112958({
              type: 'inApp',
              inAppSettings: {
                frequency: 2,       
                capping: 0.1,       
                interval: 30,       
                timeout: 5,         
                everyPage: false    
              }
            });
        }
        
        // Energy Recovery Chronological Clock Loop
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

// ==========================================
// 3. UI RENDERING AND DATA PIPELINES
// ==========================================
function updateGlobalUI() {
    const counterDisplay = document.getElementById("master-coin-counter");
    if (counterDisplay) {
        counterDisplay.innerText = currentCoins.toLocaleString();
    }
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

// ==========================================
// 4. INTER-APPLICATION ROTATING NAVIGATION ROUTER
// ==========================================
window.switchRoutingEngine = async function(pageName, element = null) {
    if (element) {
        document.querySelectorAll('.tab-trigger').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
    }

    const homeView = document.getElementById("built-in-home");
    const dynamicContainer = document.getElementById("tab-content-container");

    if (pageName === 'home') {
        if (dynamicContainer) dynamicContainer.style.display = "none";
        if (homeView) homeView.style.display = "flex";
        updateGlobalUI();
        updateEnergyUI();
    } else {
        if (homeView) homeView.style.display = "none";
        if (dynamicContainer) {
            dynamicContainer.style.display = "block";
            dynamicContainer.innerHTML = "<div style='text-align:center; padding:50px; color:#94a3b8;'>Loading Matrix Node...</div>";
        }
        
        try {
            const response = await fetch(`${pageName}.html`);
            if (!response.ok) throw new Error(`Status validation error: ${response.status}`);
            
            const htmlContent = await response.text();
            if (dynamicContainer) {
                dynamicContainer.innerHTML = htmlContent;
            }

            if (pageName === 'tasks') {
                bindMonetagTriggers(); 
            }
            if (pageName === 'share') {
                renderReferralNetwork(); 
            }
        } catch (err) {
            console.error("View distribution breaking routing matrix stack:", err);
            if (dynamicContainer) {
                dynamicContainer.innerHTML = "<div style='text-align:center; padding:50px; color:#ef4444;'>Sync error. Reload interface.</div>";
            }
        }
    }
};

// ==========================================
// 5. ADVANCED 3D CLICK ROTATION & VECTOR COIN ENGINE
// ==========================================
function bindCoinTapLogic() {
    const tapBtn = document.getElementById("coin-interaction-node");
    if (!tapBtn) return;

    tapBtn.addEventListener("click", async function (event) {
        if (currentEnergy <= 0) return;

        // Balance State Changes
        currentCoins += 1;
        currentEnergy -= 1;
        
        updateGlobalUI();
        updateEnergyUI();

        // Elastic 3D Transformation Feedback Loop
        tapBtn.style.transform = "scale(0.93) rotate(-2deg)";
        setTimeout(() => {
            tapBtn.style.transform = "scale(1) rotate(0deg)";
        }, 60);

        // Render Dynamic Floating Point Label Vector
        renderVectorLabel(event);

        try {
            await updateDoc(userRef, { coins: currentCoins, lastActive: serverTimestamp() });
        } catch (err) {
            console.error("Cloud data writing sequence interrupted:", err);
        }
    });
}

function renderVectorLabel(event) {
    const floatTextNode = document.createElement('span');
    floatTextNode.innerText = '+1 RZ';
    
    // Apply floating structural properties
    floatTextNode.style.position = 'absolute';
    floatTextNode.style.color = '#00f0ff'; // Neon Cyan Highlight
    floatTextNode.style.fontSize = '24px';
    floatTextNode.style.fontWeight = '900';
    floatTextNode.style.pointerEvents = 'none';
    floatTextNode.style.zIndex = '10000';
    floatTextNode.style.left = `${event.clientX}px`;
    floatTextNode.style.top = `${event.clientY}px`;
    floatTextNode.style.animation = 'floatUpAndFade 0.7s ease-out forwards';
    
    document.body.appendChild(floatTextNode);
    
    // Garbage cleanup array loop sequence
    setTimeout(() => {
        floatTextNode.remove();
    }, 700);
}

// ==========================================
// 6. DYNAMIC DEPLOYED REFERRAL NETWORK SENSOR
// ==========================================
async function renderReferralNetwork() {
    const networkBox = document.getElementById("friends-network-list");
    if (!networkBox || !telegramUser) return;

    networkBox.innerHTML = "<p style='color:#94a3b8; font-size:13px;'>Scanning tracking registry...</p>";

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

// ==========================================
// 7. MONETAG VIDEO AD ACQUISITION LOGIC Engine
// ==========================================
function bindMonetagTriggers() {
    const watchBtn = document.getElementById("adsgram-bounty-trigger"); 
    if (!watchBtn) return;

    watchBtn.addEventListener("click", function() {
        if (!window.show_11112958) {
            alert("Monetag Ad SDK Core Engine offline. Try reloading app layout.");
            return;
        }

        watchBtn.innerText = "Streaming...";
        watchBtn.disabled = true;

        window.show_11112958().then(() => {
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

// ==========================================
// 8. CUSTOM CPAGRIP ROUTING ENGINE CALLBACK HOOK
// ==========================================
window.triggerCpaGripWall = function() {
    if (!telegramUser) {
        alert("Security handshake context validation error.");
        return;
    }
    const userId = telegramUser.id.toString();
    const trackingBaseUrl = "https://filestrue.com/help/ablk.php?lkt=4";
    const targetPayloadUrl = `${trackingBaseUrl}&tracking_id=${userId}`;
    
    if (window.Telegram?.WebApp?.openLink) {
        window.Telegram.WebApp.openLink(targetPayloadUrl);
    } else {
        window.open(targetPayloadUrl, '_blank');
    }
};
