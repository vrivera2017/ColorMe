/* Code in this file is adapted from the code in the Affectiva Javascript SDK for analyzing the camera stream.
See: https://knowledge.affectiva.com/v3.2/docs/analyze-the-camera-stream-3

Veronica Rivera
CMPS 261 Advanced Visualization
University of California, Santa Cruz
Spring 2018, 05/28/2018

*/

var detector = null;
$(document).ready(function(){
  // SDK Needs to create video and canvas nodes in the DOM in order to function
  // Here we are adding those nodes a predefined div.
  var divRoot = $("#affdex_elements")[0];
  var width = 640;
  var height = 480;
  var faceMode = affdex.FaceDetectorMode.LARGE_FACES;

  var canvas = document.getElementById("canvas");
  canvas.width = 300;
  canvas.height = 300; 
  var context = canvas.getContext("2d");

  //Construct a CameraDetector and specify the image width / height and face detector mode.
  detector = new affdex.CameraDetector(divRoot, width, height, faceMode);

  //Enable detection of all Expressions, Emotions and Emojis classifiers.
  detector.detectAllEmotions();
  detector.detectAllExpressions();
  detector.detectAllEmojis();
  detector.detectAllAppearance();

  //Add a callback to notify when the detector is initialized and ready for runing.
  detector.addEventListener("onInitializeSuccess", function() {
    log('#logs', "The detector reports initialized");
    //Display canvas instead of video feed because we want to draw the feature points on it
    $("#face_video_canvas").css("display", "block");
    $("#face_video").css("display", "none");
  });

  //Add a callback to notify when camera access is allowed
  detector.addEventListener("onWebcamConnectSuccess", function() {
    log('#logs', "Webcam access allowed");
  });

  //Add a callback to notify when camera access is denied
  detector.addEventListener("onWebcamConnectFailure", function() {
    log('#logs', "webcam denied");
    console.log("Webcam access denied");
  });

  //Add a callback to notify when detector is stopped
  detector.addEventListener("onStopSuccess", function() {
    log('#logs', "The detector reports stopped");
    $("#results").html("");
  });

  //Add a callback to receive the results from processing an image.
  //The faces object contains the list of the faces detected in an image.
  //Faces object contains probabilities for all the different expressions, emotions and appearance metrics
  detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) {
    $('#results').html("");
    if (faces.length > 0) {
      drawFeaturePoints(image, faces[0].featurePoints);


      // Begin code to change background of page depending on detected emotion
      if(faces[0].emotions.joy > 50 && faces[0].emotions.engagement > 20){
      $('#overlay').css("background", "yellow");
      smileEmoji();
      }
      else if(faces[0].emotions.joy < 50 && faces[0].emotions.valence < -10 && faces[0].emotions.anger < 10){
      $('#overlay').css("background", "#0112FE");
      sadEmoji();
      }
      else if(faces[0].emotions.joy < 50 && faces[0].emotions.anger > 10 && faces[0].emotions.engagement > 20){
      $('#overlay').css("background", "red");
      angryEmoji();
      }
      else if (faces[0].emotions.engagement < 10){
      $('#overlay').css("background", "#3AC824");
      neutralEmoji();
      }
    }
    
  });

function smileEmoji(){
  var canvas = document.getElementById("canvas");
  canvas.width = 500;
  canvas.height = 500;
  var context = canvas.getContext("2d");
  context.font = '250px serif'
  smiley = String.fromCodePoint(0x1F60A);
  context.fillText(smiley, 50, 300)
}

function sadEmoji(){
  var canvas = document.getElementById("canvas");
  canvas.width = 500;
  canvas.height = 500;
  var context = canvas.getContext("2d");
  context.font = '250px serif'
  sad = String.fromCodePoint(0x1F61E);
  context.fillText(sad, 50, 300)
}

function angryEmoji(){
  var canvas = document.getElementById("canvas");
  canvas.width = 500;
  canvas.height = 500;
  var context = canvas.getContext("2d");
  context.font = '250px serif'
  angry = String.fromCodePoint(0x1F621);
  context.fillText(angry, 50, 300)
}

function neutralEmoji(){
  var canvas = document.getElementById("canvas");
  canvas.width = 500;
  canvas.height = 500;
  var context = canvas.getContext("2d");
  context.font = '250px serif'
  neutral = String.fromCodePoint(0x1F610);
  context.fillText(neutral, 50, 300)
}

  //Draw the detected facial feature points on the image
  function drawFeaturePoints(img, featurePoints) {
    var contxt = $('#face_video_canvas')[0].getContext('2d');

    var hRatio = contxt.canvas.width / img.width;
    var vRatio = contxt.canvas.height / img.height;
    var ratio = Math.min(hRatio, vRatio);

    contxt.strokeStyle = "#FFFFFF";
    for (var id in featurePoints) {
      contxt.beginPath();
      contxt.arc(featurePoints[id].x,
        featurePoints[id].y, 2, 0, 2 * Math.PI);
      contxt.stroke();

    }
  }
});

function log(node_name, msg) {
  $(node_name).append("<span>" + msg + "</span><br />")
}

//function executes when Start button is pushed.
function onStart() {
  if (detector && !detector.isRunning) {
    $("#logs").html("");
    detector.start();
    //colorOverlay();
  }
  log('#logs', "Clicked the start button");
}

//function executes when the Stop button is pushed.
function onStop() {
  log('#logs', "Clicked the stop button");
  $('#overlay').css("background", "transparent");
  if (detector && detector.isRunning) {
    detector.removeEventListener();
    detector.stop();
  }
};
