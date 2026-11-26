// =======================================
// Lunar Lander PID Velocity Challenge
// =======================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const velocityCanvas =
    document.getElementById(
        "velocityGraph"
    );

const velocityCtx =
    velocityCanvas.getContext("2d");

const altitudeCanvas =
    document.getElementById(
        "altitudeGraph"
    );

const altitudeCtx =
    altitudeCanvas.getContext("2d");

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

let velocityHistory = [];
let targetHistory = [];
let altitudeHistory = [];

const maxSamples = 250;

let stars = [];

for (let i = 0; i < 200; i++) {

    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1
    });

}

// PID gains

let kp = 1.0;
let ki = 0.0;
let kd = 0.0;

// =======================================
// Controls
// =======================================

function createKnob(
    svgId,
    min,
    max,
    initial,
    decimals,
    callback
) {

    const svg =
        document.getElementById(svgId);

    let value = initial;

    const radius = 40;
    const center = 55;

    svg.innerHTML = `
        <circle cx="${center}"
                cy="${center}"
                r="${radius}"
                fill="#2d2d2d"
                stroke="#555"
                stroke-width="3"/>

        <line id="${svgId}_pointer"
              x1="${center}"
              y1="${center}"
              x2="${center}"
              y2="20"
              stroke="#4ade80"
              stroke-width="4"
              stroke-linecap="round"/>
    `;

    const pointer =
        document.getElementById(
            `${svgId}_pointer`
        );

    function updateVisual() {

        const fraction =
            (value - min) /
            (max - min);

        const angle =
            -135 + fraction * 270;

        const radians =
            angle * Math.PI / 180;

        const length = 30;

        const x2 =
            center +
            Math.cos(radians) * length;

        const y2 =
            center +
            Math.sin(radians) * length;

        pointer.setAttribute("x2", x2);
        pointer.setAttribute("y2", y2);

        callback(value);
    }

    let dragging = false;
    let lastY = 0;

    svg.addEventListener("mousedown", e => {

        dragging = true;
        lastY = e.clientY;
    });

    window.addEventListener("mouseup", () => {

        dragging = false;
    });

    window.addEventListener("mousemove", e => {

        if (!dragging)
            return;

        const delta =
            lastY - e.clientY;

        value +=
            delta *
            (max - min) /
            300;

        value =
            Math.max(min,
            Math.min(max, value));

        lastY = e.clientY;

        updateVisual();
    });

    updateVisual();
}

createKnob(
    "pKnob",
    0,
    20,
    1,
    1,
    value => {
        kp = value;

        document
            .getElementById("pVal")
            .innerText =
            value.toFixed(1);
    }
);

createKnob(
    "iKnob",
    0,
    5,
    0,
    2,
    value => {
        ki = value;

        document
            .getElementById("iVal")
            .innerText =
            value.toFixed(2);
    }
);

createKnob(
    "dKnob",
    0,
    20,
    0,
    1,
    value => {
        kd = value;

        document
            .getElementById("dVal")
            .innerText =
            value.toFixed(1);
    }
);

document.getElementById("startBtn").addEventListener("click", () => {
    running = true;
    document.getElementById("status").innerText = "Mission Running";
});

document.getElementById("resetBtn").addEventListener("click", resetSimulation);

// =======================================
// Reset
// =======================================

resetSimulation();




// =======================================
// Drawing
// =======================================

function drawVelocityGraph() {

    velocityCtx.clearRect(
        0,
        0,
        velocityCanvas.width,
        velocityCanvas.height
    );

    velocityCtx.fillStyle = "#111";
    velocityCtx.fillRect(
        0,
        0,
        velocityCanvas.width,
        velocityCanvas.height
    );

    const scaleY = 8;

    velocityCtx.strokeStyle =
        "#00ff88";

    velocityCtx.beginPath();

    velocityHistory.forEach(
        (v, i) => {

            const x =
                i *
                velocityCanvas.width /
                maxSamples;

            const y =
                velocityCanvas.height -
                (v * scaleY);

            if (i === 0)
                velocityCtx.moveTo(x, y);
            else
                velocityCtx.lineTo(x, y);

        }
    );

    velocityCtx.stroke();

    velocityCtx.strokeStyle =
        "#ffcc00";

    velocityCtx.beginPath();

    targetHistory.forEach(
        (v, i) => {

            const x =
                i *
                velocityCanvas.width /
                maxSamples;

            const y =
                velocityCanvas.height -
                (v * scaleY);

            if (i === 0)
                velocityCtx.moveTo(x, y);
            else
                velocityCtx.lineTo(x, y);

        }
    );

    velocityCtx.stroke();
}

function drawAltitudeGraph() {

    altitudeCtx.clearRect(
        0,
        0,
        altitudeCanvas.width,
        altitudeCanvas.height
    );

    altitudeCtx.fillStyle = "#111";

    altitudeCtx.fillRect(
        0,
        0,
        altitudeCanvas.width,
        altitudeCanvas.height
    );

    altitudeCtx.strokeStyle =
        "#66aaff";

    altitudeCtx.beginPath();

    altitudeHistory.forEach(
        (a, i) => {

            const x =
                i *
                altitudeCanvas.width /
                maxSamples;

            const y =
                altitudeCanvas.height -
                a;

            if (i === 0)
                altitudeCtx.moveTo(x, y);
            else
                altitudeCtx.lineTo(x, y);

        }
    );

    altitudeCtx.stroke();
}

function drawStars() {

    ctx.fillStyle = "white";

    for (const star of stars) {

        ctx.fillRect(
            star.x,
            star.y,
            star.size,
            star.size
        );

    }

}

function updateStars() {

    const pixelsPerMetre = 6;

    const visualScroll =
        velocity *
        pixelsPerMetre *
        dt;

    for (const star of stars) {

        star.y -= visualScroll;

        if (star.y < 0) {

            star.y = canvas.height;

            star.x =
                Math.random() *
                canvas.width;
        }
    }
}

function drawMoonSurface() {

    const landerY =
        canvas.height * 0.7;

    const pixelsPerMetre = 4;

    const surfaceY =
        landerY + 50 +
        altitude * pixelsPerMetre;

    ctx.fillStyle = "#666666";

    ctx.fillRect(
        0,
        surfaceY,
        canvas.width,
        canvas.height - surfaceY
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

    const y =
    canvas.height * 0.7;

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
            5 + Math.random() + currentThrust * 2;

        ctx.fillStyle = "orange";

        ctx.fillRect(
            x - 5,
            y + 40,
            10,
            flameLength
        );
    }
}

function render() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawStars();
    drawMoonSurface();
    drawFuelBar();
    drawLander();
}