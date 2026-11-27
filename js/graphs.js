console.log("graphs.js loaded");

function drawVelocityGraph() {

    if (!velocityCtx) return;

    const LEFT = 60;
    const RIGHT = 100;
    const TOP = 20;
    const BOTTOM = 30;

    const plotWidth =
        velocityCanvas.width -
        LEFT -
        RIGHT;

    const plotHeight =
        velocityCanvas.height -
        TOP -
        BOTTOM;

    const maxVelocity = 20;

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

    // AXES

    velocityCtx.strokeStyle = "#666";

    velocityCtx.beginPath();

    velocityCtx.moveTo(
        LEFT,
        TOP
    );

    velocityCtx.lineTo(
        LEFT,
        TOP + plotHeight
    );

    velocityCtx.lineTo(
        LEFT + plotWidth,
        TOP + plotHeight
    );

    velocityCtx.stroke();

    // GRID

    velocityCtx.strokeStyle = "#222";

    for(let i=0;i<=4;i++){

        const y =
            TOP +
            (i/4) *
            plotHeight;

        velocityCtx.beginPath();

        velocityCtx.moveTo(
            LEFT,
            y
        );

        velocityCtx.lineTo(
            LEFT + plotWidth,
            y
        );

        velocityCtx.stroke();
    }

    // LABELS

    velocityCtx.fillStyle = "#AAA";

    velocityCtx.font =
        "12px Segoe UI";

    velocityCtx.fillText(
        "20 m/s",
        5,
        TOP + 5
    );

    velocityCtx.fillText(
        "10 m/s",
        5,
        TOP + plotHeight/2
    );

    velocityCtx.fillText(
        "0 m/s",
        5,
        TOP + plotHeight
    );

    // ACTUAL VELOCITY

    velocityCtx.strokeStyle =
        "#00ff88";

    velocityCtx.lineWidth = 2;

    velocityCtx.beginPath();

    velocityHistory.forEach(
        (v,i)=>{

            const x =
                LEFT +
                (i/CONFIG.maxSamples) *
                plotWidth;

            const y =
                TOP +
                plotHeight -
                (v/maxVelocity) *
                plotHeight;

            if(i===0)
                velocityCtx.moveTo(x,y);
            else
                velocityCtx.lineTo(x,y);

        }
    );

    velocityCtx.stroke();

    // TARGET VELOCITY

    velocityCtx.strokeStyle =
        "#ffcc00";

    velocityCtx.beginPath();

    targetHistory.forEach(
        (v,i)=>{

            const x =
                LEFT +
                (i/CONFIG.maxSamples) *
                plotWidth;

            const y =
                TOP +
                plotHeight -
                (v/maxVelocity) *
                plotHeight;

            if(i===0)
                velocityCtx.moveTo(x,y);
            else
                velocityCtx.lineTo(x,y);

        }
    );

    velocityCtx.stroke();

    // LEGEND

    velocityCtx.fillStyle =
        "#00ff88";

    velocityCtx.fillRect(
        velocityCanvas.width - 80,
        25,
        12,
        12
    );

    velocityCtx.fillStyle =
        "#FFF";

    velocityCtx.fillText(
        "Actual",
        velocityCanvas.width - 60,
        35
    );

    velocityCtx.fillStyle =
        "#ffcc00";

    velocityCtx.fillRect(
        velocityCanvas.width - 80,
        50,
        12,
        12
    );

    velocityCtx.fillStyle =
        "#FFF";

    velocityCtx.fillText(
        "Target",
        velocityCanvas.width - 60,
        60
    );
}

function drawAltitudeGraph() {

    if (!altitudeCtx) return;

    const LEFT = 60;
    const RIGHT = 100;
    const TOP = 20;
    const BOTTOM = 30;

    const plotWidth =
        altitudeCanvas.width -
        LEFT -
        RIGHT;

    const plotHeight =
        altitudeCanvas.height -
        TOP -
        BOTTOM;

    altitudeCtx.clearRect(
        0,
        0,
        altitudeCanvas.width,
        altitudeCanvas.height
    );

    altitudeCtx.fillStyle =
        "#111";

    altitudeCtx.fillRect(
        0,
        0,
        altitudeCanvas.width,
        altitudeCanvas.height
    );

    // AXES

    altitudeCtx.strokeStyle =
        "#666";

    altitudeCtx.beginPath();

    altitudeCtx.moveTo(
        LEFT,
        TOP
    );

    altitudeCtx.lineTo(
        LEFT,
        TOP + plotHeight
    );

    altitudeCtx.lineTo(
        LEFT + plotWidth,
        TOP + plotHeight
    );

    altitudeCtx.stroke();

    // GRID

    altitudeCtx.strokeStyle =
        "#222";

    for(let i=0;i<=4;i++){

        const y =
            TOP +
            (i/4)*plotHeight;

        altitudeCtx.beginPath();

        altitudeCtx.moveTo(
            LEFT,
            y
        );

        altitudeCtx.lineTo(
            LEFT + plotWidth,
            y
        );

        altitudeCtx.stroke();
    }

    // LABELS

    altitudeCtx.fillStyle =
        "#AAA";

    altitudeCtx.font =
        "12px Segoe UI";

    altitudeCtx.fillText(
        `${CONFIG.startAltitude} m`,
        5,
        TOP + 5
    );

    altitudeCtx.fillText(
        `${CONFIG.startAltitude/2} m`,
        5,
        TOP + plotHeight/2
    );

    altitudeCtx.fillText(
        "0 m",
        5,
        TOP + plotHeight
    );

    // ALTITUDE TRACE

    altitudeCtx.strokeStyle =
        "#66aaff";

    altitudeCtx.lineWidth = 2;

    altitudeCtx.beginPath();

    altitudeHistory.forEach(
        (a,i)=>{

            const x =
                LEFT +
                (i/CONFIG.maxSamples) *
                plotWidth;

            const y =
                TOP +
                plotHeight -
                (a / CONFIG.startAltitude) *
                plotHeight;

            if(i===0)
                altitudeCtx.moveTo(x,y);
            else
                altitudeCtx.lineTo(x,y);

        }
    );

    altitudeCtx.stroke();

    // LEGEND

    altitudeCtx.fillStyle =
        "#66aaff";

    altitudeCtx.fillRect(
        altitudeCanvas.width - 80,
        25,
        12,
        12
    );

    altitudeCtx.fillStyle =
        "#FFF";

    altitudeCtx.fillText(
        "Altitude",
        altitudeCanvas.width - 60,
        35
    );
}