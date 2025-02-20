let canvas; // Declare canvas variable globally

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL); // Use windowWidth and windowHeight
  angleMode(DEGREES);
  strokeWeight(5);
  noFill();
  stroke(0, 0, 0);
  describe(
    'Users can click on the screen and drag to adjust their perspective in 3D space. The space contains a sphere of dark purple cubes on a light pink background.'
  );
}

function draw() {
  background(250, 250, 250);

  // Call every frame to adjust camera based on mouse/touch
  orbitControl();

  // Rotate rings in a half circle to create a sphere of cubes
  for (let zAngle = 0; zAngle < 180; zAngle += 30) {
    // Rotate cubes in a full circle to create a ring of cubes
    for (let xAngle = 0; xAngle < 360; xAngle += 30) {
      push();

      // Rotate from center of sphere
      rotateZ(zAngle);
      rotateX(xAngle);

      // Then translate down 400 units  (Adjust this value if needed)
      translate(0, 500, 0);

      // Control box size relative to screen size (optional, but good for scaling)
      let boxSize = min(windowWidth, windowHeight) / 10; // Example: 1/10th of the smaller dimension
      box(boxSize); 
      pop();
    }
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Resize canvas when window is resized
}