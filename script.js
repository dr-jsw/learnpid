// Counter functionality

let count = 0;

const counter = document.getElementById("counter");
const incrementBtn = document.getElementById("incrementBtn");
const resetBtn = document.getElementById("resetBtn");

incrementBtn.addEventListener("click", () => {
    count++;
    counter.textContent = count;
});

resetBtn.addEventListener("click", () => {
    count = 0;
    counter.textContent = count;
});

// Simple pygame-style animation

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let x = 50;
let speed = 2;

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw moving robot
    ctx.fillStyle = "#2563eb";
    ctx.fillRect(x, 120, 50, 50);

    x += speed;

    if (x > canvas.width - 50 || x < 0) {
        speed *= -1;
    }

    requestAnimationFrame(animate);
}

animate();
