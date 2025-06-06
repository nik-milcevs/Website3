let handPose;
let video;
let hands = [];

function preload() {
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  handPose.detectStart(video, gotHands);
}

function isMiddleFingerGesture(hand) {
  // Middle finger checks (fully extended)
  const middleTip = hand.keypoints[12];
  const middleJoint = hand.keypoints[10];
  const middleBase = hand.keypoints[9];
  const middleExtended = (middleTip.y < middleJoint.y) && (middleTip.y < middleBase.y);

  // Other fingers checks (folded)
  const indexFolded = hand.keypoints[8].y > hand.keypoints[6].y;  // Index
  const ringFolded = hand.keypoints[16].y > hand.keypoints[14].y; // Ring
  const pinkyFolded = hand.keypoints[20].y > hand.keypoints[18].y; // Pinky

  return middleExtended && indexFolded && ringFolded && pinkyFolded;
}

function draw() {
  background(255);
  
  // Draw mirrored video
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0);
  pop();

  if (hands.length > 0) {
    for (let hand of hands) {
      if (isMiddleFingerGesture(hand)) {
        // Get middle fingertip (keypoint 12)
        const tip = hand.keypoints[10];
        const mirroredX = width - tip.x;
        
        // Draw black rectangle
        rectMode(CENTER);
        fill(0);
        noStroke();
        rect(mirroredX, tip.y, 100, 200);

        // Debug: Green dot on middle fingertip
        //fill(0, 255, 0);
        //circle(mirroredX, tip.y, 8);
      }
    }
  }
}

function gotHands(results) {
  hands = results;
}