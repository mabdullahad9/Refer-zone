
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Refer-Zone | Launching Soon</title>
    
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        :root {
            --bg1: #050816;
            --bg2: #0b1026;
            --glass: rgba(255, 255, 255, 0.04);
            --border: rgba(255, 255, 255, 0.08);
            --text: #ffffff;
            --muted: #9fb0ff;
            --primary: #00e5ff;
            --secondary: #8a2be2;
            --success: #00ff99;
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            background:
                radial-gradient(circle at top left, rgba(0, 229, 255, 0.15), transparent 45%),
                radial-gradient(circle at bottom right, rgba(138, 43, 226, 0.15), transparent 45%),
                linear-gradient(135deg, var(--bg1), var(--bg2));
            color: var(--text);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow-x: hidden;
        }
        
        .container {
            width: 100%;
            max-width: 480px;
            text-align: center;
        }
        
        .glass-panel {
            background: var(--glass);
            border: 1px solid var(--border);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 32px;
            padding: 40px 25px;
            box-shadow:
                0 0 40px rgba(0, 229, 255, 0.05),
                inset 0 0 25px rgba(255, 255, 255, 0.02);
        }
        
        .logo-box {
            margin-bottom: 25px;
        }
        
        .logo {
            font-family: 'Orbitron', sans-serif;
            font-size: 2.3rem;
            font-weight: 900;
            letter-spacing: 2px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 30px rgba(0, 229, 255, 0.2);
        }
        
        .badge {
            display: inline-block;
            padding: 6px 16px;
            background: rgba(0, 229, 255, 0.1);
            border: 1px solid rgba(0, 229, 255, 0.2);
            color: var(--primary);
            font-family: 'Orbitron', sans-serif;
            font-size: 0.75rem;
            font-weight: 700;
            border-radius: 50px;
            margin-top: 5px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        
        h2 {
            font-size: 1.4rem;
            font-weight: 600;
            margin-bottom: 10px;
            color: #fff;
        }
        
        .subtitle {
            color: var(--muted);
            font-size: 0.9rem;
            margin-bottom: 35px;
            line-height: 1.5;
        }
        
        /* COUNTDOWN GRID DESIGN */
        .countdown-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 35px;
        }
        
        .time-box {
            background: rgba(5, 8, 22, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.05);
            padding: 15px 5px;
            border-radius: 18px;
            box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.5);
            position: relative;
            overflow: hidden;
        }
        
        .time-box::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
        }
        
        .num {
            font-family: 'Orbitron', sans-serif;
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--success);
            text-shadow: 0 0 10px rgba(0, 255, 153, 0.3);
            display: block;
            margin-bottom: 2px;
        }
        
        .label {
            font-size: 0.65rem;
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 500;
        }
        
        /* FOOTER BRANDING */
        .footer-note {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.3);
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            padding-top: 20px;
        }
        
        .footer-note span {
            color: var(--primary);
            font-family: 'Orbitron', sans-serif;
        }

        @media (max-width: 400px) {
            .num { font-size: 1.5rem; }
            .label { font-size: 0.6rem; }
            .logo { font-size: 1.9rem; }
        }
    </style>
</head>

<body>

    <div class="container">
        <div class="glass-panel">
            
            <div class="logo-box">
                <div class="logo">REFER-ZONE</div>
                <span class="badge">Next-Gen Earning</span>
            </div>
            
            <h2>We Are Launching Soon! 🚀</h2>
            <p class="subtitle">Our professional high-yield referral & multi-server ad rewarding ecosystem is currently under development.</p>
            
            <div class="countdown-grid">
                <div class="time-box">
                    <span class="num" id="days">00</span>
                    <span class="label">Days</span>
                </div>
                <div class="time-box">
                    <span class="num" id="hours">00</span>
                    <span class="label">Hours</span>
                </div>
                <div class="time-box">
                    <span class="num" id="mins">00</span>
                    <span class="label">Mins</span>
                </div>
                <div class="time-box">
                    <span class="num" id="secs">00</span>
                    <span class="label">Secs</span>
                </div>
            </div>
            
            <div class="footer-note">
                <p>© 2026 <span>REFER-ZONE</span>. All Rights Reserved.</p>
            </div>
            
        </div>
    </div>

    <script>
        // Target Launch Date Configuration: June 14, 2026
        const launchDate = new Date("June 14, 2026 00:00:00").getTime();

        const timerEngine = setInterval(() => {
            const now = new Date().getTime();
            const distance = launchDate - now;

            // Mathematical calculation logic blocks for time units
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Output strings dynamically inside DOM structure with dual digits handling
            document.getElementById("days").textContent = days < 10 ? "0" + days : days;
            document.getElementById("hours").textContent = hours < 10 ? "0" + hours : hours;
            document.getElementById("mins").textContent = minutes < 10 ? "0" + minutes : minutes;
            document.getElementById("secs").textContent = seconds < 10 ? "0" + seconds : seconds;

            // Rule block handler for post launch event state
            if (distance < 0) {
                clearInterval(timerEngine);
                document.getElementById("days").textContent = "00";
                document.getElementById("hours").textContent = "00";
                document.getElementById("mins").textContent = "00";
                document.getElementById("secs").textContent = "00";
                document.querySelector("h2").textContent = "We Are Live! 🎉";
            }
        }, 1000);
    </script>
</body>

</html>
