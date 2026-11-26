// --------------------
// Canvas Setup
// --------------------

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --------------------
// Simulation Variables
// --------------------

const gravity = 1.62; // Moon gravity (m/s²)

let altitude;
let velocity;
let fuel;
let integral;
let previousError;
let running;

// PID values
let kp = 1.0;
let ki = 0.0;
let kd = 0.0;

// timing
const dt = 0.05;

// --------------------
// Create Control Panel
// --------------------

const panel = document.querySelector(".panel");

panel.innerHTML = `
<h2>Lunar Lander PID Challenge</h2>

<label>P Gain: <span id="pVal">1.0</span></label>
<input type="range" id="pGain" min="0" max="20" step="0.1" value="1">

<br><br>

<label>I Gain: <span id="iVal">0.0</span></label>
<input type="range" id="iGain" min="0" max="5" step="0.05" value="0">

<br><br>

<label>D Gain: <span id="dVal">0.0</span></label>
<input type="range" id="dGain" min="0" max="20" step="0.1" value="0">

<br><br>

<button id="startBtn">Start</button>
<button id="resetBtn">Reset</button>

<hr>

<p>Altitude: <span id="altitudeDisplay"></span> m</p>
<p>Velocity: <span id="velocityDisplay"></span> m/s</p>
<p>Fuel: <span id="fuelDisplay"></span>%</p>

<h3 id="status">Ready</h3>
`;

// --------------------
// Controls
// --------------------

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
});

document.getElementById("resetBtn").addEventListener("click", resetSimulation);

// --------------------
// Reset
// --------------------

function resetSimulation() {
    altitude = 100;
    velocity = 0;

    fuel = 100;

    integral = 0;
    previousError = altitude;

    running = false;

    document.getElementById("status").innerText = "Ready";
}

resetSimulation();

// --------------------
// PID Controller
// --------------------

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

// --------------------
// Physics Update
// --------------------

function updatePhysics() {

    if (!running) return;

    const targetAltitude = 0;

    const error = targetAltitude - altitude;

    let thrust = -computePID(error);

    thrust = Math.max(0, thrust);
    thrust = Math.min(15, thrust);

    // Fuel usage proportional to thrust
    if (fuel > 0) {

        fuel -= thrust * 0.03;

        if (fuel < 0)
            fuel = 0;

    } else {

        thrust = 0;
    }

    const acceleration =
        thrust - gravity;

    velocity += acceleration * dt;

    altitude -= velocity * dt;

    if (altitude <= 0) {

        altitude = 0;

        running = false;

        if (Math.abs(velocity) <= 5) {

            document.getElementById("status")
                .innerText = "✅ Safe Landing";

        } else {

            document.getElementById("status")
                .innerText = "💥 Crash Landing";
        }
    }
}

// --------------------
// Drawing
// --------------------

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Moon surface

    ctx.fillStyle = "#888";

    ctx.fillRect(
        0,
        canvas.height - 40,
        canvas.width,
        40
    );

    // altitude mapping

    const y =
        canvas.height -
        40 -
        (altitude * 2);

    // Lander

    ctx.fillStyle = "#2563eb";

    ctx.fillRect(
        canvas.width / 2 - 20,
        y,
        40,
        40
    );

    // Thrust flame

    if (running && fuel > 0) {

        ctx.fillStyle = "orange";

        ctx.fillRect(
            canvas.width / 2 - 5,
            y + 40,
            10,
            15
        );
    }

    // Fuel Bar

    ctx.fillStyle = "black";

    ctx.strokeRect(20, 20, 200, 20);

    ctx.fillStyle =
        fuel > 20 ? "limegreen" : "red";

    ctx.fillRect(
        20,
        20,
        fuel * 2,
        20
    );
}

// --------------------
// Update Display
// --------------------

function updateDisplay() {

    document.getElementById("altitudeDisplay")
        .innerText = altitude.toFixed(1);

    document.getElementById("velocityDisplay")
        .innerText = velocity.toFixed(2);

    document.getElementById("fuelDisplay")
        .innerText = fuel.toFixed(1);
}

// --------------------
// Main Loop
// --------------------

function loop() {

    updatePhysics();

    draw();

    updateDisplay();

    requestAnimationFrame(loop);
}

loop();