console.log("physics.js loaded");

// =======================================
// Physics
// =======================================

function updatePhysics() {

    if (!running) {
        return;
    }

    const targetVelocity =
        getTargetVelocity();

    const error =
        targetVelocity - velocity;

    const hoverThrust =
        CONFIG.gravity;

    let thrust =
        hoverThrust -
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
// Mission Profiles
// =======================================

function getTargetVelocity() {

    if (altitude > 75) {
        return 15;
    }

    if (altitude > 25) {
        return 8;
    }

    if (altitude > 10) {
        return 3;
    }

    return 1;
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

    targetHistory.push(
        getTargetVelocity()
    );

    altitudeHistory.push(
        altitude
    );

    if (
        velocityHistory.length >
        CONFIG.maxSamples
    ) {

        velocityHistory.shift();
        targetHistory.shift();
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

    velocityHistory = [];
    targetHistory = [];
    altitudeHistory = [];

    document.getElementById(
        "status"
    ).innerText = "Ready";
}

resetSimulation();