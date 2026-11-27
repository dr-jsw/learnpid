console.log("physics.js loaded");

// =======================================
// Physics
// =======================================

function updatePhysics() {

    if (!running) {
        return;
    }

    const error =
        targetAltitude -
        altitude;

    const hoverThrust =
        CONFIG.gravity;

    let thrust =
        hoverThrust +
        computePID(error);

    thrust =
        Math.max(0, thrust);

    thrust =
        Math.min(
            CONFIG.maxThrust,
            thrust
        );

    if (fuel > 0) {

        fuel -=
            thrust *
            CONFIG.fuelBurnRate;

        if (fuel < 0) {
            fuel = 0;
        }

    } else {

        thrust = 0;
    }

    currentThrust = thrust;

    const acceleration =
        CONFIG.gravity - thrust;

    velocity +=
        acceleration *
        CONFIG.dt;

    altitude -=
        velocity *
        CONFIG.dt;

    recordHistory();

    if (altitude <= 0) {
        handleTouchdown();
    }
}

// =======================================
// PID Controller
// =======================================

function computePID(error) {

    integral +=
        error *
        CONFIG.dt;

    const derivative =
        (error - previousError) /
        CONFIG.dt;

    previousError = error;

    return (
        kp * error +
        ki * integral +
        kd * derivative
    );
}

// =======================================
// History
// =======================================

function recordHistory() {

    velocityHistory.push(
        velocity
    );

    targetAltitudeHistory.push(
        targetAltitude
    );

    altitudeHistory.push(
        altitude
    );

    if (
        velocityHistory.length >
        CONFIG.maxSamples
    ) {

        velocityHistory.shift();
        targetAltitudeHistory.shift();
        altitudeHistory.shift();
    }
}

// =======================================
// Landing Logic
// =======================================

function handleTouchdown() {

    const touchdownVelocity =
        velocity;

    altitude = 0;
    velocity = 0;

    running = false;

    currentThrust = 0;

    integral = 0;
    previousError = 0;

    const status =
        document.getElementById(
            "status"
        );

    if (
        touchdownVelocity <=
        CONFIG.touchdownLimit
    ) {

        status.innerText =
            `Safe Landing (${touchdownVelocity.toFixed(1)} m/s)`;

    } else {

        exploded = true;

        createExplosion();

        status.innerText =
            `Crash Landing (${touchdownVelocity.toFixed(1)} m/s)`;
    }
}

// =======================================
// Reset
// =======================================

function resetSimulation() {

    altitude =
        CONFIG.startAltitude;

    velocity = 0;

    fuel =
        CONFIG.startFuel;

    integral = 0;
    previousError = 0;

    currentThrust = 0;

    running = false;

    exploded = false;
    explosionParticles = [];
    explosionRadius = 0;
    explosionFrame = 0;

    velocityHistory = [];
    targetHistory = [];
    altitudeHistory = [];
    targetAltitudeHistory = [];

    document.getElementById(
        "status"
    ).innerText = "Ready";
}

resetSimulation();