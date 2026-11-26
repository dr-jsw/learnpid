// =======================================
// Stars
// =======================================

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

    const visualScroll =
        velocity *
        6 *
        CONFIG.dt;

    for (const star of stars) {

        star.y -= visualScroll;

        if (star.y < 0) {

            star.y =
                canvas.height;

            star.x =
                Math.random() *
                canvas.width;
        }
    }
}

// =======================================
// Moon Surface
// =======================================

function drawMoonSurface() {

    const landerY =
        canvas.height * 0.7;

    const surfaceY =
        canvas.height *0.7 + 50 + (altitude * 15);

    ctx.fillStyle =
        "#666666";

    ctx.fillRect(
        0,
        surfaceY,
        canvas.width,
        canvas.height - surfaceY
    );
}

// =======================================
// Fuel Gauge
// =======================================

function drawFuelBar() {

    ctx.strokeStyle =
        "#ffffff";

    ctx.strokeRect(
        20,
        20,
        200,
        20
    );

    ctx.fillStyle =
        fuel > 20
            ? "limegreen"
            : "red";

    ctx.fillRect(
        20,
        20,
        fuel * 2,
        20
    );

    ctx.fillStyle =
        "#ffffff";

    ctx.fillText(
        "Fuel",
        230,
        35
    );
}

// =======================================
// Lander
// =======================================

function drawLander() {

    const x =
        canvas.width / 2;

    const y =
        canvas.height * 0.7;

    // Body

    ctx.fillStyle =
        "#2563eb";

    ctx.fillRect(
        x - 20,
        y,
        40,
        40
    );

    // Legs

    ctx.strokeStyle =
        "#ffffff";

    ctx.beginPath();

    ctx.moveTo(
        x - 15,
        y + 40
    );

    ctx.lineTo(
        x - 25,
        y + 50
    );

    ctx.moveTo(
        x + 15,
        y + 40
    );

    ctx.lineTo(
        x + 25,
        y + 50
    );

    ctx.stroke();

    // Engine Flame

    if (
        currentThrust > 0.1 &&
        fuel > 0 &&
        running
    ) {

        const flameLength =
            5 +
            Math.random() +
            currentThrust * 2;

        ctx.fillStyle =
            "orange";

        ctx.fillRect(
            x - 5,
            y + 40,
            10,
            flameLength
        );
    }
}

// =======================================
// Main Render
// =======================================

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