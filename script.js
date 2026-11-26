// =======================================
// Lunar Lander PID Velocity Challenge
// =======================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// =======================================
// Create UI
// =======================================

document.querySelector(".panel").innerHTML = `
<h2>Lunar Lander PID Challenge</h2>

<label>
    P Gain:
    <span id="pVal">1.0</span>
</label><br>
<input id="pGain" type="range"
       min="0" max="20"
       step="0.1" value="1">

<br><br>

<label>
    I Gain:
    <span id="iVal">0.00</span>
</label><br>
<input id="iGain" type="range"
       min="0" max="5"
       step="0.01" value="0">

<br><br>

<label>
    D Gain:
    <span id="dVal">0.0</span>
</label><br>
<input id="dGain" type="range"
       min="0" max="20"
       step="0.1" value="0">

<br><br>

<button id="startBtn">Start</button>
<button id="resetBtn">Reset</button>

<hr>

<p>Altitude: <span id="altitudeDisplay">0</span> m</p>

<p>Velocity: <span id="velocityDisplay">0</span> m/s</p>

<p>Target Velocity:
<span id="targetVelocityDisplay">0</span> m/s</p>

<p>Fuel: <span id="fuelDisplay">0</span> %</p>

<p>Thrust: <span id="thrustDisplay">0</span></p>

<h3 id="status">Ready</h3>
`;

// =======================================
// Simulation Parameters
// =======================================

const gravity = 1.62;      // Moon gravity
const dt = 0.05;

let altitude;
let velocity;
let fuel;

let integral;
let previousError;

let running = false;

let currentThrust = 0;

// PID gains

let kp = 1.0;
let ki = 0.0;
let kd = 0.0;

// =======================================
// Controls
// =======================================

const pSlider = document.getElementById("pGain");
const iSlider = document.getElementById("iGain");
const dSlider = document.getElementById("dGain");

pSlider.addEventListener("input", () => {
    kp = parseFloat(pSlider.value);
    document.getElementById("pVal").innerText = kp.toFixed(1);
});

iSlider.addEventListener("input", () => {
    ki = parseFloat(iSlider.value);
    document.getElementById("iVal").innerText = ki.toFixed(2);
});

dSlider.addEventListener("input", () => {
    kd = parseFloat(dSlider.value);
    document.getElementById("dVal").innerText = kd.toFixed(1);
});

document.getElementById("startBtn").addEventListener("click", () => {
    running = true;
    document.getElementById("status").innerText = "Mission Running";
});

document.getElementById("resetBtn").addEventListener("click", resetSimulation);

// =======================================
// Reset
// =======================================

function resetSimulation() {

    altitude = 100;
    velocity = 0;

    fuel = 100;

    integral = 0;
    previousError = 0;

    currentThrust = 0;

    running = false;

    document.getElementById("status").innerText = "Ready";
}

resetSimulation();

// =======================================
// Target Velocity Profile
// =======================================

function getTargetVelocity() {

    if (altitude > 75)
        return 15;

    if (altitude > 25)
        return 8;

    if (altitude > 10)
        return 3;

    return 1;
}

// =======================================
// PID
// =======================================

function computePID(error) {

    integral += error * dt;

    const derivative =
        (error - previousError) / dt;

    previousError = error;

    return (
        kp * error +
        ki * integral +
        kd * derivative
    );
}

// =======================================
// Physics
// =======================================

function updatePhysics() {

    if (!running)
        return;

    const targetVelocity =
        getTargetVelocity();

    const error =
        targetVelocity - velocity;

    let thrust =
        computePID(error);

    thrust =
        Math.max(0, thrust);

    thrust =
        Math.min(15, thrust);

    if (fuel > 0) {

        fuel -= thrust * 0.03;

        if (fuel < 0)
            fuel = 0;

    } else {

        thrust = 0;
    }

    currentThrust = thrust;

    const acceleration =
        gravity - thrust;

    velocity += acceleration * dt;

    altitude -= velocity * dt;

    // Landing

    if (altitude <= 0) {

        altitude = 0;

        running = false;

        currentThrust = 0;

        if (velocity <= 5) {

            document.getElementById("status").innerText =
                "✅ Safe Landing";

        } else {

            document.getElementById("status").innerText =
                `💥 Crash Landing (${velocity.toFixed(1)} m/s)`;
        }
    }
}

// =======================================
// Drawing
// =======================================

function drawMoonSurface() {

    ctx.fillStyle = "#787878";

    ctx.fillRect(
        0,
        canvas.height - 40,
        canvas.width,
        40
    );
}

function drawFuelBar() {

    ctx.strokeStyle = "black";
    ctx.strokeRect(20, 20, 200, 20);

    ctx.fillStyle =
        fuel > 20 ? "limegreen" : "red";

    ctx.fillRect(
        20,
        20,
        fuel * 2,
        20
    );

    ctx.fillStyle = "black";
    ctx.fillText(
        "Fuel",
        230,
        35
    );
}

function drawLander() {

    const scale = 3;

    let y =
        canvas.height -
        40 -
        altitude * scale;

    y = Math.max(20, y);

    const x =
        canvas.width / 2;

    // body

    ctx.fillStyle = "#2563eb";

    ctx.fillRect(
        x - 20,
        y,
        40,
        40
    );

    // legs

    ctx.strokeStyle = "white";

    ctx.beginPath();

    ctx.moveTo(x - 15, y + 40);
    ctx.lineTo(x - 25, y + 50);

    ctx.moveTo(x + 15, y + 40);
    ctx.lineTo(x + 25, y + 50);

    ctx.stroke();

    // flame

    if (currentThrust > 0.1 &&
        fuel > 0 &&
        running) {

        const flameLength =
            5 + currentThrust * 2;

        ctx.fillStyle = "orange";

        ctx.fillRect(
            x - 5,
            y + 40,
            10,
            flameLength
        );
    }
}

// =======================================
// Display
// =======================================

function updateDisplay() {

    document.getElementById(
        "altitudeDisplay"
    ).innerText =
        altitude.toFixed(1);

    document.getElementById(
        "velocityDisplay"
    ).innerText =
        velocity.toFixed(2);

    document.getElementById(
        "fuelDisplay"
    ).innerText =
        fuel.toFixed(1);

    document.getElementById(
        "targetVelocityDisplay"
    ).innerText =
        getTargetVelocity().toFixed(1);

    document.getElementById(
        "thrustDisplay"
    ).innerText =
        currentThrust.toFixed(2);
}

// =======================================
// Draw
// =======================================

function render() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawMoonSurface();
    drawFuelBar();
    drawLander();
}

// =======================================
// Main Loop
// =======================================

function animate() {

    updatePhysics();

    render();

    updateDisplay();

    requestAnimationFrame(
        animate
    );
}

animate();