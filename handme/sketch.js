let handPose;
let video;
let hands = [];
let circleSize = 100; // Fixed size of the white ball
let circlePos; // Position of the white ball
let circleVel; // Velocity of the white ball
let maxDistance = 0; // Track the maximum distance between thumb and index finger
let isIncreasing = false; // Track if the distance is increasing
let friction = 0.98; // Friction to gradually slow down the ball
let particleFriction = 0.85; // Further reduced friction for particles (makes them bounce more)
let particles = []; // Array to store particles
let col;

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height)); // Random position
    this.vel = p5.Vector.random2D().mult(random(1, 3)); // Small initial velocity
    this.size = random(5, 25); // Random size
    this.color = color(random(255), random(255), random(255)); // Random color
  }

  update() {
    // Update position
    this.pos.add(this.vel);

    // Apply friction to gradually slow down the particle
    this.vel.mult(particleFriction);

    // Bounce off edges
    if (this.pos.x < this.size / 2 || this.pos.x > width - this.size / 2) {
      this.vel.x *= -1;
    }
    if (this.pos.y < this.size / 2 || this.pos.y > height - this.size / 2) {
      this.vel.y *= -1;
    }

    // Constrain within canvas
    this.pos.x = constrain(this.pos.x, this.size / 2, width - this.size / 2);
    this.pos.y = constrain(this.pos.y, this.size / 2, height - this.size / 2);
  }

  display() {
    fill(this.color); // Use the particle's random color
    noStroke();
    circle(this.pos.x, this.pos.y, this.size);
  }

  // Check collision with the white ball (outer edge collision)
  checkCollision(ballPos, ballVel, ballSize) {
    // Calculate the distance between the particle and the white ball
    let distance = dist(this.pos.x, this.pos.y, ballPos.x, ballPos.y);
    // Calculate the sum of their radii (outer edge collision)
    let sumOfRadii = this.size / 2 + ballSize / 2;

    if (distance <= sumOfRadii) {
      // Calculate the collision normal (direction from ball to particle)
      let collisionNormal = p5.Vector.sub(this.pos, ballPos).normalize();

      // Transfer even more momentum from the white ball to the particle
      let momentumTransfer = p5.Vector.mult(collisionNormal, ballVel.mag() * 1.2); // Increase momentum transfer
      this.vel.add(momentumTransfer);

      // Move the particle to the outer edge of the white ball to prevent sticking
      let overlap = sumOfRadii - distance;
      this.pos.add(p5.Vector.mult(collisionNormal, overlap));
    }
  }
}

function preload() {
  // Load the handPose model
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  col = color(255, 248, 220, 204);
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();
  // Start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);

  // Initialize circle position to the center of the canvas
  circlePos = createVector(width / 2, height / 2);
  // Initialize circle velocity to zero
  circleVel = createVector(0, 0);

  // Create particles
  for (let i = 0; i < 800; i++) { // Increase the number of particles
    particles.push(new Particle());
  }
}

function draw() {
  // Set the background to black
  background(col);
  
  // Update and display particles first
  for (let particle of particles) {
    particle.update();
    particle.display();
    particle.checkCollision(circlePos, circleVel, circleSize); // Check collision with white ball
  }

  // Draw all the tracked hands
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    
    // Get thumb and index finger keypoints
    let thumbTip = hand.keypoints.find(point => point.name === 'thumb_tip');
    let indexTip = hand.keypoints.find(point => point.name === 'index_finger_tip');

    // Mirror the x-coordinates of the keypoints
    let mirroredThumbX = width - thumbTip.x;
    let mirroredIndexX = width - indexTip.x;

    // Calculate the midpoint between thumb tip and index finger tip
    let midpoint = createVector(
      (mirroredThumbX + mirroredIndexX) / 2,
      (thumbTip.y + indexTip.y) / 2
    );

    // Calculate the distance between thumb tip and index finger tip
    let distance = dist(mirroredThumbX, thumbTip.y, mirroredIndexX, indexTip.y);

    // Track the maximum distance
    if (distance > maxDistance) {
      maxDistance = distance; // Update max distance
      isIncreasing = true; // Distance is increasing
    } else if (isIncreasing) {
      // Distance has started decreasing
      isIncreasing = false;
    }

    // Map the distance to a new circle size (e.g., min size = 20, max size = 100)
    let newCircleSize = map(distance, 0, 200, 20, 100); // Adjust the range as needed

    // Draw the new circle at the midpoint with dynamic size
    fill(255, 100, 50, 150); // White color with some transparency
    noStroke();
    circle(midpoint.x, midpoint.y, newCircleSize);

    // Check if thumb is touching index finger
    if (isThumbTouchingIndex(hand)) {
      // Calculate the direction vector from the white ball to the midpoint
      let direction = p5.Vector.sub(midpoint, circlePos);
      // Normalize the direction vector and scale it by the max distance
      direction.normalize();
      direction.mult(maxDistance * 0.1); // Speed proportional to max distance

      // Add the direction to the ball's velocity (momentum)
      circleVel.add(direction);

      // Reset max distance after assigning momentum
      maxDistance = 0;
    }
  }

  // Apply friction to gradually slow down the ball
  circleVel.mult(friction);

  // Update the position of the white ball
  circlePos.add(circleVel);

  // Bounce off the edges of the canvas
  if (circlePos.x < circleSize / 2 || circlePos.x > width - circleSize / 2) {
    circleVel.x *= -1; // Reverse x velocity
  }
  if (circlePos.y < circleSize / 2 || circlePos.y > height - circleSize / 2) {
    circleVel.y *= -1; // Reverse y velocity
  }

  // Constrain the white ball within the canvas borders
  circlePos.x = constrain(circlePos.x, circleSize / 2, width - circleSize / 2);
  circlePos.y = constrain(circlePos.y, circleSize / 2, height - circleSize / 2);

  // Draw the white ball (fixed size)
  fill(255, 100, 50); // White color for the white ball
  noStroke();
  circle(circlePos.x, circlePos.y, circleSize);

  // Add a usage note at the bottom of the canvas
  textSize(16);
  textAlign(CENTER, BOTTOM);
  text("Tap your thumb and index finger to interact!", width / 2, height - 10);
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // Save the output to the hands variable
  hands = results;
}

// Function to check if thumb is touching index finger
function isThumbTouchingIndex(hand) {
  // Get the keypoints for the thumb tip and index finger tip
  let thumbTip = hand.keypoints.find(point => point.name === 'thumb_tip');
  let indexTip = hand.keypoints.find(point => point.name === 'index_finger_tip');

  // Calculate the distance between the thumb tip and index finger tip
  let distance = dist(thumbTip.x, thumbTip.y, indexTip.x, indexTip.y);

  // Define a threshold for touching (you may need to adjust this)
  let threshold = 40;

  // Return true if the distance is below the threshold
  return distance < threshold;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(windowWidth, windowHeight);
}