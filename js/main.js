function animate() {

    console.log("frame");

    updatePhysics();

    updateStars();

    render();

    drawVelocityGraph();

    drawAltitudeGraph();

    updateDisplay();

    requestAnimationFrame(animate);
}


animate();