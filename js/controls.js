console.log("controls.js loaded");

// =======================================
// Rotary Knob Widget
// =======================================

function createKnob(
    svgId,
    min,
    max,
    initial,
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

        pointer.setAttribute(
            "x2",
            center +
            Math.cos(radians) * length
        );

        pointer.setAttribute(
            "y2",
            center +
            Math.sin(radians) * length
        );

        callback(value);
    }

    let dragging = false;
    let lastY = 0;

    svg.addEventListener(
        "mousedown",
        e => {

            dragging = true;
            lastY = e.clientY;
        }
    );

    window.addEventListener(
        "mouseup",
        () => dragging = false
    );

    window.addEventListener(
        "mousemove",
        e => {

            if (!dragging) {
                return;
            }

            const delta =
                lastY - e.clientY;

            value +=
                delta *
                (max - min) /
                300;

            value = Math.max(
                min,
                Math.min(
                    max,
                    value
                )
            );

            lastY = e.clientY;

            updateVisual();
        }
    );

    updateVisual();
}

// =======================================
// PID Knobs
// =======================================

createKnob(
    "pKnob",
    0,
    20,
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
    value => {

        kd = value;

        document
            .getElementById("dVal")
            .innerText =
            value.toFixed(1);
    }
);

// =======================================
// Buttons
// =======================================

document
    .getElementById("startBtn")
    .addEventListener(
        "click",
        () => {

            running = true;

            document
                .getElementById("status")
                .innerText =
                "Mission Running";
        }
    );

document
    .getElementById("resetBtn")
    .addEventListener(
        "click",
        resetSimulation
    );