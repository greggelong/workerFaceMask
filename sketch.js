let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 10, refineLandmarks: false, flipped: true };

let uvMapImage = [];

let triangulation;
let uvCoords;
let cnv;
let imgInd = 0;

function preload() {
  // Load the faceMesh model
  faceMesh = ml5.faceMesh(options);
  uvMapImage[0] = loadImage("wMask2.png");
  uvMapImage[1] = loadImage("monkey2.png");
  uvMapImage[2] = loadImage("gmask2.png");
  uvMapImage[3] = loadImage("y3.png");
  uvMapImage[4] = loadImage("dmask.png");
}

function setup() {
  cnv = createCanvas(640, 480, WEBGL);
  let cx = (windowWidth - cnv.width) / 2;
  let cy = (windowHeight - cnv.height) / 2;
  cnv.position(cx, cy);
  pixelDensity(1);

  // Create the webcam video and hide it
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();
  // Start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);
  // Get the Coordinates for the uv mapping
  triangulation = faceMesh.getTriangles();
  uvCoords = faceMesh.getUVCoords();
}

function draw() {
  translate(-width / 2, -height / 2);
  image(video, 0, 0);

  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];

    // Draw all the triangles
    noStroke();
    texture(uvMapImage[imgInd]);
    textureMode(NORMAL);
    beginShape(TRIANGLES);
    for (let i = 0; i < triangulation.length; i++) {
      let indexA = triangulation[i][0];
      let indexB = triangulation[i][1];
      let indexC = triangulation[i][2];
      let a = face.keypoints[indexA];
      let b = face.keypoints[indexB];
      let c = face.keypoints[indexC];
      let uvA = { x: uvCoords[indexA][0], y: uvCoords[indexA][1] };
      let uvB = { x: uvCoords[indexB][0], y: uvCoords[indexB][1] };
      let uvC = { x: uvCoords[indexC][0], y: uvCoords[indexC][1] };
      vertex(a.x, a.y, uvA.x, uvA.y);
      vertex(b.x, b.y, uvB.x, uvB.y);
      vertex(c.x, c.y, uvC.x, uvC.y);
    }
    endShape();
  }
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}

function keyPressed() {
  imgInd++;
  imgInd = imgInd % 5;
}
