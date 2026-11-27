document.querySelector(".panel").innerHTML = `
<h2> PID Dials </h2>

<div class="pid-control-row">

    <div class="knob-container">
        <svg class="knob" id="pKnob" width="110" height="110"></svg>
        <div class="knob-label">Proportionate</div>
        <div class="knob-value" id="pVal">1.0</div>
    </div>

    <div class="knob-container">
        <svg class="knob" id="iKnob" width="110" height="110"></svg>
        <div class="knob-label">Integral</div>
        <div class="knob-value" id="iVal">0.00</div>
    </div>

    <div class="knob-container">
        <svg class="knob" id="dKnob" width="110" height="110"></svg>
        <div class="knob-label">Derivative</div>
        <div class="knob-value" id="dVal">0.0</div>
    </div>

</div>

<button id="startBtn">Start</button>

<hr>

<hr>

<label for="targetAltitude">
    Target Altitude (m)
</label>

<input
    type="number"
    id="targetAltitude"
    value="500"
    min="0"
    max="1000"
    step="10">

<hr>

<div class="telemetry">

<p>Altitude: <span id="altitudeDisplay">0</span> m</p>
<p>Velocity: <span id="velocityDisplay">0</span> m/s</p>
<p>Target Altitude:<span id="targetAltitudeDisplay">500</span>m</p>
<p>Fuel: <span id="fuelDisplay">0</span> %</p>
<p>Thrust: <span id="thrustDisplay">0</span></p>

</div>

<h3 id="status">Ready</h3>
`;

document.getElementById(
    "graphPanel"
).innerHTML = `

<h2>Control System Response</h2>

<h4>Velocity Response</h4>

<canvas
    id="velocityGraph"
    width="400"
    height="190">
</canvas>

<h4>Altitude Profile</h4>

<canvas
    id="altitudeGraph"
    width="400"
    height="190">
</canvas>

`;

velocityCanvas =
    document.getElementById(
        "velocityGraph"
    );

velocityCtx =
    velocityCanvas.getContext(
        "2d"
    );

altitudeCanvas =
    document.getElementById(
        "altitudeGraph"
    );

altitudeCtx =
    altitudeCanvas.getContext(
        "2d"
    );

console.log("Velocity canvas:", velocityCanvas);
console.log("Altitude canvas:", altitudeCanvas);

// =======================================
// Display
// =======================================

function updateDisplay() {
    
    console.log(
    altitude,
    velocity,
    fuel,
    currentThrust);

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
        "targetAltitudeDisplay"
    ).innerText =
        targetAltitude.toFixed(1);

    document.getElementById(
        "thrustDisplay"
    ).innerText =
        currentThrust.toFixed(2);
    
}