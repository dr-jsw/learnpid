// =======================================
// Canvas
// =======================================

const canvas =
    document.getElementById(
        "gameCanvas"
    );

const ctx =
    canvas.getContext("2d");

// =======================================
// Vehicle State
// =======================================

let altitude;
let velocity;
let fuel;

// =======================================
// Controller State
// =======================================

let integral;
let previousError;

let kp = 1.0;
let ki = 0.0;
let kd = 0.0;

// =======================================
// Simulation State
// =======================================

let running = false;

let currentThrust = 0;

// =======================================
// Telemetry History
// =======================================

let velocityHistory = [];
let targetHistory = [];
let altitudeHistory = [];

// =======================================
// Graph Canvases
// =======================================

let velocityCanvas;
let velocityCtx;

let altitudeCanvas;
let altitudeCtx;

// =======================================
// Visual Effects
// =======================================

let stars = [];

function initialiseStars() {

    stars = [];

    for (
        let i = 0;
        i < CONFIG.starCount;
        i++
    ) {

        stars.push({

            x:
                Math.random() *
                canvas.width,

            y:
                Math.random() *
                canvas.height,

            size:
                Math.random() * 2 + 1

        });

    }

}

initialiseStars();