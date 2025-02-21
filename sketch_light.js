let canvas;
let cameraRadius = 1000;
let cameraAngleX = 0; // Initial horizontal angle
let cameraAngleY = 30; // Initial vertical angle (tilt down slightly)
let targetAngleX = cameraAngleX; // Initialize targets to current values
let targetAngleY = cameraAngleY;
let zoomSpeed = 0.1;
let targetRadius = cameraRadius;
let panSpeed = 0.01;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.parent('p5-canvas'); // Important: Add this line!
    angleMode(DEGREES);
    strokeWeight(5);
    noFill();
    stroke(250, 250, 250);
  
    // Calculate initial camera position to avoid initial blank screen
    cameraRadius = 1000;
    let cameraX = cameraRadius * sin(cameraAngleY) * cos(cameraAngleX);
    let cameraY = cameraRadius * cos(cameraAngleY);
    let cameraZ = cameraRadius * sin(cameraAngleY) * sin(cameraAngleX);
    perspective();
    camera(cameraX, cameraY, cameraZ, 0, 0, 0, 0, 1, 0);
  
}

function draw() {
  background(0, 0, 0);

  // Smooth zooming
  cameraRadius = lerp(cameraRadius, targetRadius, zoomSpeed);

  // Smooth rotation
  cameraAngleX = lerp(cameraAngleX, targetAngleX, panSpeed);
  cameraAngleY = lerp(cameraAngleY, targetAngleY, panSpeed);


  // Calculate camera position based on spherical coordinates
  let cameraX = cameraRadius * sin(cameraAngleY) * cos(cameraAngleX);
  let cameraY = cameraRadius * cos(cameraAngleY);
  let cameraZ = cameraRadius * sin(cameraAngleY) * sin(cameraAngleX);

  perspective();
  camera(cameraX, cameraY, cameraZ, 0, 0, 0, 0, 1, 0);

  for (let zAngle = 0; zAngle < 180; zAngle += 30) {
    for (let xAngle = 0; xAngle < 360; xAngle += 30) {
      push();
      rotateZ(zAngle);
      rotateX(xAngle);
      translate(0, 400, 0);
      let boxSize = min(windowWidth, windowHeight) / 10;
      box(boxSize);
      pop();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Zoom control
function mouseWheel(event) {
  targetRadius -= event.delta * 2; // Adjust zoom sensitivity
  targetRadius = constrain(targetRadius, 200, 3000); // Adjust zoom limits
}

// Rotation (mouse drag)
let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;

function mousePressed() {
  isDragging = true;
  previousMouseX = mouseX;
  previousMouseY = mouseY;
}

function mouseDragged() {
  if (isDragging) {
    let deltaX = mouseX - previousMouseX;
    let deltaY = mouseY - previousMouseY;

    targetAngleX -= deltaX * 0.5; // Adjust rotation sensitivity
    targetAngleY += deltaY * 0.5;

    previousMouseX = mouseX;
    previousMouseY = mouseY;
  }
}

function mouseReleased() {
  isDragging = false;
}


// Mobile controls (combined pan and zoom)
let initialPinchDistance = 0;

function touchStarted() {
  if (touches.length === 2) {
    initialPinchDistance = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
  } else if (touches.length === 1) { // Single touch for rotation on mobile
    isDragging = true;
    previousMouseX = touches[0].x;
    previousMouseY = touches[0].y;
  }
}

function touchMoved() {
  if (touches.length === 2) {
    const currentPinchDistance = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
    const deltaPinch = currentPinchDistance - initialPinchDistance;
    targetRadius -= deltaPinch; // Adjust zoom sensitivity for mobile
    targetRadius = constrain(targetRadius, 200, 3000); // Adjust zoom limits
    initialPinchDistance = currentPinchDistance;
  } else if (isDragging) { // Rotation with single touch
    let deltaX = touches[0].x - previousMouseX;
    let deltaY = touches[0].y - previousMouseY;

    targetAngleX -= deltaX * 0.5; // Adjust rotation sensitivity
    targetAngleY += deltaY * 0.5;

    previousMouseX = touches[0].x;
    previousMouseY = touches[0].y;
  }
}

function touchEnded() {
  isDragging = false;
}