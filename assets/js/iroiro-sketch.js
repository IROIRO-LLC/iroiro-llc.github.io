// assets/js/iroiro-sketch.js - Modified to handle responsive background images

let img;
let particles = [];
let canvas;
// --- Controls ---
let skipRate = 10; // Create particle for every Nth pixel (lower = more dense, higher = less dense)
let mouseRadius = 80; // Area of mouse influence
let pushForce = 0.8; // How strongly mouse pushes particles
let returnForce = 0.02; // How strongly particles return to origin
let driftSpeed = 0.1; // How fast particles naturally drift
let maxSpeed = 1.5; // Max speed of particle movement
// --- End Controls ---

let imgLoaded = false;
let targetWidth, targetHeight; // Dimensions to scale image to fit canvas
let isMobile = false;

function preload() {
    // Check if device is mobile
    isMobile = window.innerWidth <= 768;

    // Choose appropriate background image based on device
    const imgPath = isMobile ? '/assets/images/background_mobile.png' : '/assets/images/background.jpg';
    console.log(`Loading ${imgPath} for ${isMobile ? 'mobile' : 'desktop'} device`);

    // Load the selected image
    img = loadImage(imgPath, onImageLoaded, onImageError);
}

function onImageLoaded() {
    console.log(`Background image loaded successfully. Size: ${img.width}x${img.height}`);
    imgLoaded = true;
    // We'll initialize particles in setup after canvas is created
}

function onImageError(e) {
    console.error("Error loading background image:", e);
    // Handle error - maybe draw a plain background?
}

function setup() {
    // Create canvas with the willReadFrequently attribute set
    let canvasOptions = {
        willReadFrequently: true
    };
    canvas = createCanvas(windowWidth, windowHeight, canvasOptions); // Pass options here
    canvas.style('display', 'block');
    // CSS positions canvas fixed behind everything
    colorMode(RGB, 255);
    imageMode(CENTER); // Keep this if you're using image()
    noStroke();
    ellipseMode(CENTER); // Keep this if using ellipse() for particles
    frameRate(30); // Keep or adjust as needed

    if (imgLoaded) {
        initializeParticles();
    } else {
        console.warn("Image not loaded by setup, check path/preload.");
    }
}

function initializeParticles() {
    particles = []; // Clear existing particles if any (e.g., on resize)
    if (!img || !img.width || !img.height) return; // Need a valid image

    // Calculate scaling to ensure image width fits viewport
    // This now ensures the image always fits width-wise
    targetWidth = width;
    targetHeight = (width / img.width) * img.height;

    // If the scaled height is less than canvas height, scale by height instead
    if (targetHeight < height) {
        targetHeight = height;
        targetWidth = (height / img.height) * img.width;
    }

    // Center the scaled image coords
    let startX = (width - targetWidth) / 2;
    let startY = (height - targetHeight) / 2;

    img.loadPixels(); // Load pixel data
    if (!img.pixels || img.pixels.length === 0) {
        console.error("Failed to load image pixels.");
        return; // Can't proceed without pixel data
    }

    console.log(`Initializing particles. Sampling every ${skipRate} pixels.`);
    console.log(`Image Original: ${img.width}x${img.height}, Scaled Target: ${targetWidth}x${targetHeight}`);
    console.log(`Canvas Size: ${width}x${height}`);

    // Adjust skip rate based on device to maintain performance
    const effectiveSkipRate = isMobile ? skipRate * 2 : skipRate;

    for (let y = 0; y < img.height; y += effectiveSkipRate) {
        for (let x = 0; x < img.width; x += effectiveSkipRate) {
            let index = (x + y * img.width) * 4; // Pixel index (RGBA)

            // Check if pixel data exists at this index
            if (index + 3 >= img.pixels.length) continue; // Avoid accessing out of bounds

            let r = img.pixels[index];
            let g = img.pixels[index + 1];
            let b = img.pixels[index + 2];
            let a = img.pixels[index + 3];

            // Only create particle if pixel is somewhat visible
            if (a > 50) {
                // Map image coords (x, y) to scaled canvas coords
                let originX = map(x, 0, img.width, startX, startX + targetWidth);
                let originY = map(y, 0, img.height, startY, startY + targetHeight);

                particles.push(new Particle(originX, originY, color(r, g, b, 200))); // Start slightly transparent
            }
        }
    }
    console.log(`Created ${particles.length} particles.`);
    img.updatePixels(); // Good practice, though maybe not strictly needed here

    // Make the initializeParticles function globally available for the navDots.js script
    window.initializeParticles = initializeParticles;
}

function draw() {
    // Use a slightly transparent background for subtle trails/blur
    background(0, 0, 0, 50);

    let mouseVec = createVector(mouseX, mouseY);

    for (let i = 0; i < particles.length; i++) {
        particles[i].applyForces(mouseVec);
        particles[i].update();
        particles[i].display();
    }
}

function windowResized() {
    // Check if device type changed (e.g., rotation from portrait to landscape)
    const wasIsMobile = isMobile;
    isMobile = window.innerWidth <= 768;

    // If device type changed, reload the appropriate image
    if (wasIsMobile !== isMobile) {
        const imgPath = isMobile ? '/assets/images/background_mobile.png' : '/assets/images/background.jpg';
        console.log(`Device type changed. Loading ${imgPath}`);
        img = loadImage(imgPath, () => {
            imgLoaded = true;
            resizeCanvas(windowWidth, windowHeight);
            initializeParticles();
        }, onImageError);
    } else {
        // Just resize and reinitialize with existing image
        resizeCanvas(windowWidth, windowHeight);
        if (imgLoaded) {
            initializeParticles();
        }
    }
}

// --- Particle Class ---
class Particle {
    constructor(originX, originY, clr) {
        this.origin = createVector(originX, originY); // Original position from image
        this.pos = createVector(originX, originY); // Current position starts at origin
        // Start slightly offset from origin for initial visual interest
        this.pos.add(p5.Vector.random2D().mult(random(5)));

        this.vel = createVector(0, 0); // Initial velocity
        this.acc = createVector(0, 0); // Initial acceleration
        this.clr = clr; // Store particle's color
        this.maxSpeed = random(0.5, maxSpeed); // Vary max speed slightly per particle
        this.noiseOffset = createVector(random(1000), random(1000)); // For Perlin noise drift
        this.baseSize = random(2, 4); // Base size of the particle
    }

    applyForce(force) {
        this.acc.add(force);
    }

    applyForces(mouse) {
        // 1. Return Force (Steering towards origin)
        let seek = p5.Vector.sub(this.origin, this.pos); // Desired vector
        let distToOrigin = seek.mag();
        seek.normalize();
        seek.mult(this.maxSpeed); // Scale by max speed
        let steer = p5.Vector.sub(seek, this.vel); // Steering force = desired - velocity
        steer.limit(returnForce * (distToOrigin * 0.05 + 1)); // Limit return force, stronger when further away
        this.applyForce(steer);

        // 2. Mouse Repulsion Force
        let mouseDist = dist(this.pos.x, this.pos.y, mouse.x, mouse.y);
        if (mouseDist < mouseRadius) {
            let repel = p5.Vector.sub(this.pos, mouse); // Vector pointing away from mouse
            // Scale force based on distance (stronger when closer)
            let strength = map(mouseDist, 0, mouseRadius, pushForce, 0);
            repel.setMag(strength);
            this.applyForce(repel);
        }

        // 3. Subtle Drift Force (Perlin Noise)
        let angle = noise(this.pos.x * 0.005, this.pos.y * 0.005, frameCount * 0.001 + this.noiseOffset.x) * TWO_PI * 2;
        let drift = p5.Vector.fromAngle(angle);
        drift.setMag(driftSpeed);
        this.applyForce(drift);
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0); // Reset acceleration each frame
    }

    display() {
        fill(this.clr); // Use the particle's stored color
        // Optional: Vary size based on speed or distance from origin
        // let size = this.baseSize + this.vel.mag() * 0.5;
        ellipse(this.pos.x, this.pos.y, this.baseSize, this.baseSize);
    }
}