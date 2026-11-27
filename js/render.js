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

            star.y = canvas.height;

            star.x =
                Math.random() *
                canvas.width;
        }

        if (star.y > canvas.height) {

            star.y = 0;

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

// Make Explosion Particles

function createExplosion() {

    explosionParticles = [];

    explosionRadius = 10;

    explosionFrame = 0;

    screenShake = 20;

    const x = canvas.width / 2;
    const y = canvas.height * 0.7 + 20;

    for (let i = 0; i < 60; i++) {

        explosionParticles.push({

            x: x,
            y: y,

            vx:
                (Math.random() - 0.5) * 12,

            vy:
                (Math.random() - 0.5) * 12,

            radius:
                Math.random() * 6 + 2,

            life:
                60 + Math.random() * 30

        });

    }
}

// Explosion

function drawExplosion() {

    const x =
        canvas.width / 2;

    const y =
        canvas.height * 0.7 + 20;

    explosionFrame++;

    explosionRadius += 4;

    // Flash

    if (explosionFrame < 5) {

        ctx.fillStyle =
            "rgba(255,255,255,0.4)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    // Fireball

    ctx.fillStyle =
        "rgba(255,120,0,0.8)";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        explosionRadius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Hot core

    ctx.fillStyle =
        "rgba(255,255,0,0.9)";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        explosionRadius * 0.5,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Particles

    explosionParticles.forEach(
        particle => {

            particle.x +=
                particle.vx;

            particle.y +=
                particle.vy;

            particle.vy +=
                0.05;

            particle.life--;

            const alpha =
                Math.max(
                    0,
                    particle.life / 90
                );

            ctx.fillStyle =
                `rgba(255,170,0,${alpha})`;

            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.radius,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }
    );

    explosionParticles =
        explosionParticles.filter(
            p => p.life > 0
        );

    if (
        explosionParticles.length === 0 &&
        explosionFrame > 30
    ) {

        exploded = false;
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

    ctx.save();

    drawStars();

    drawMoonSurface();

    drawFuelBar();

    if(exploded) {

        drawExplosion();

    } else {

        drawLander();

    }

    ctx.restore();
}