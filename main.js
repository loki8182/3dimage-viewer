
let camera_button = document.querySelector("#start-camera");
let video = document.querySelector("#video");
let start_button = document.querySelector("#start-record");
let stop_button = document.querySelector("#stop-record");
let download_link = document.querySelector("#download-video");

let camera_stream = null;
let media_recorder = null;
let blobs_recorded = [];
let imagescaptured=[];
let imagescaptured1=[];
let textureArr = []; 
let babylonEnabled = false;
var foo = 1;
var playvideo =document.getElementById("videoPlayer");

window.onload = function () {
  
  document.getElementById('videoPlayer').style.visibility = "hidden"; 
  document.getElementById('capture').style.visibility = "hidden"; 
  document.getElementById('core').style.visibility = "hidden"; 
  document.getElementById('overlay').style.visibility="hidden";
};
function captureVideo(){
    document.getElementById('mainmenu').style.visibility="hidden";
    document.getElementById('overlay').style.visibility="visible";
    document.getElementById("start-camera").click();
}
camera_button.addEventListener('click', async function() {
   	camera_stream = await navigator.mediaDevices.getUserMedia({ video:{facingMode:'environment'} , audio: false });
	video.srcObject = camera_stream;
});


start_button.addEventListener('click', function() {
    // set MIME type of recording as video/webm
    media_recorder = new MediaRecorder(camera_stream, { mimeType: 'video/webm' });

    // event : new recorded video blob available 
    media_recorder.addEventListener('dataavailable', function(e) {
		blobs_recorded.push(e.data);
    });

    // event : recording stopped & all blobs sent
    media_recorder.addEventListener('stop', function() {
    	// create local object URL from the recorded video blobs
    	let video_local = URL.createObjectURL(new Blob(blobs_recorded, { type: 'video/webm' }));
    	download_link.href = video_local;
      convertBlobURLToVideoVariable(video_local);
    });

    // start recording with each recorded blob having 1 second video
    media_recorder.start(1000);
    start_button.disabled = true;
    stop_button.disabled = false;
});

stop_button.addEventListener('click', function() {
	media_recorder.stop();
    start_button.disabled = false;
    stop_button.disabled = true; 
   // automaticCapture();
    document.getElementById('videoPlayer').style.visibility = "visible"; 
    document.getElementById('capture').style.visibility = "visible"; 
    document.getElementById('core').style.visibility = "visible"; 
});
//converting the bloburl to video to stream and capture.
async function convertBlobURLToVideoVariable(blobURL) {
  try {
    // Fetch the blob data
    const response = await fetch(blobURL);
    const blobData = await response.blob();
    var container = document.getElementById('video');
    container.remove();
    var container1 = document.getElementById('start-record');
    container1.remove();
    var container2 = document.getElementById('stop-record');
    container2.remove();
    var container3 = document.getElementById('download-video');
    container3.remove();
    var container4 = document.getElementById('start-camera');
    container4.remove();
    // Create an object URL for the blob
    const videoObjectURL = URL.createObjectURL(blobData);
     
    // Set the video source to the object URL
    const videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.src = videoObjectURL;
    // Optionally, you can also save the blob or object URL in a variable
     const savedBlob = blobData;
    // const savedObjectURL = videoObjectURL;
    console.log('Blob and object URL retrieved successfully.');
  } catch (error) {
    console.error('Error converting blob URL:', error);
  }
}
//capturing the image fom the video
function capture() {
  var canvas = document.getElementById("canvas");
  var video1 = document.getElementById("videoPlayer");
  canvas.width = video1.videoWidth;
  canvas.height = video1.videoHeight;
   canvas
    .getContext("2d")
    .drawImage(video1, 0, 0, video1.videoWidth, video1.videoHeight);
    var canvasDataUrl = canvas.toDataURL("image/jpeg");
    console.log(video1.duration);
    imagescaptured.push(canvasDataUrl);
    console.log(imagescaptured.length);
    console.log(typeof canvasDataUrl);
}
//setting up the babylon engine and rendering the scene
function BabylonCore () {
    var container = document.getElementById('videoPlayer');
    container.remove();
    var container1 = document.getElementById('core');
    container1.remove();
    var container2 = document.getElementById('capture');
    container2.remove();
    var container3=document.getElementById('canvas');
    container3.remove();
    document.getElementById('renderCanvas').style.visibility="visible";
  const RenderCanvas = document.getElementById('renderCanvas');
  const Engine = new BABYLON.Engine(RenderCanvas);  
  
  BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = function () {
      if (document.getElementById('customLoadingScreenDiv')) {
          document.getElementById('customLoadingScreenDiv').style.display = "initial";
          return;
      }
      this._loadingDiv = document.createElement("div");
      this._loadingDiv.id = "customLoadingScreenDiv";
      this._loadingDiv.innerHTML = "Loading...";
      var customLoadingScreenCSS = document.createElement('style');
      customLoadingScreenCSS.type = 'text/css';
      customLoadingScreenCSS.innerHTML = `
      #customLoadingScreenDiv {
          background-color: #ffffffff;
          color: red;
          font-size:50px;
          text-align:center;
          margin: 0;
      }
      `;
      document.getElementsByTagName('head')[0].appendChild (customLoadingScreenCSS);
      this._resizeLoadingUI();
      window.addEventListener('resize', this._resizeLoadingUI);
      document.body.appendChild(this._loadingDiv);
  }
  
  BABYLON.DefaultLoadingScreen.prototype.hideLoadingUI = function(){
      document.getElementById("customLoadingScreenDiv").style.display = "none";
      console.log("scene is now loaded");
  }
  
  const CreateScene = function() {
      Engine.displayLoadingUI();
      const scene = new BABYLON.Scene(Engine);
      var camera = new BABYLON.ArcRotateCamera('Camera', 3.42 * Math.PI/2, Math.PI/2, 50, BABYLON.Vector3.Zero(), scene);
      // camera.inputs.addMouseWheel();
  
      camera.setTarget(BABYLON.Vector3.Zero());
      camera.attachControl(true);
  
      var light = new BABYLON.HemisphericLight('Light', new BABYLON.Vector3(50,50,5), scene);
      light.intensity = 2;
      
      var plane = new BABYLON.MeshBuilder.CreatePlane('Plane', {
                  'width' : 10,
                  'height' : 10,
                  'depth' : 0.0001,
                  }, scene);
      
      plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
      
      const TexMaterial = new BABYLON.StandardMaterial();
      plane.material = TexMaterial;
      TexMaterial.backFaceCulling = false;
      TexMaterial.diffuseColor = new BABYLON.Color3(1,1,1);
  
      var Length = imagescaptured1.length;
        
      for (var i = 0; i < Length; i++)
      {
        var texture = new BABYLON.Texture(imagescaptured1[i], scene);
        textureArr.push(texture);
      }
      console.log ("VALUE :" + textureArr[0]);
      textureArr[0].hasAlpha = true;
      TexMaterial.diffuseTexture = textureArr[0];
      plane.rotation = new BABYLON.Vector3(0,0,0);
      camera.setTarget(plane);
      camera.lowerAlphaLimit = 5.372;
      camera.upperAlphaLimit = 5.372;
      camera.lowerBetaLimit = 1.59;
      camera.upperBetaLimit = 1.59;
      camera.upperRadiusLimit = 15;
      camera.lowerRadiusLimit = 3;
      var counter = 1;
      var value = 0;
      const TriggerRotValue = 24;
      var pointerActive = false;
      scene.clearColor = new BABYLON.Color3(1, 1, 1);
      const asynchronousFunc = async function () {
          await BABYLON.Tools.DelayAsync(500);
          Engine.hideLoadingUI();
      };
      asynchronousFunc();
      
      scene.onPointerObservable.add((kbInfo) => {
          if (kbInfo.type == BABYLON.PointerEventTypes.POINTERDOWN)
          {
              pointerActive = true;
          }
          else if (kbInfo.type == BABYLON.PointerEventTypes.POINTERUP)
          {
              pointerActive = false;
          }
          if (kbInfo.type == BABYLON.PointerEventTypes.POINTERMOVE)
          {
              
              if (pointerActive)
              {                
                  if (kbInfo.event.movementX < 0) {
                      // console.log('Left value' + value);
                      value = value + kbInfo.event.movementX;
                      if (value < -TriggerRotValue)
                      {
                          value = 0
                          if (counter >= Length)
                              counter = 1;
                          else
                              counter++;                        
                          //var path = "./assets/Test/Shoe_"+counter+".jpg";
                          //texture = new BABYLON.Texture(path, scene)
                          // texture = textureArr[counter-1];
                          textureArr[counter-1].hasAlpha = true;
                          TexMaterial.diffuseTexture = textureArr[counter-1];
                      }
                  }
                  else if (kbInfo.event.movementX > 0) {
                      // console.log('RIGHT value' + value);
                      value = (value < 0) ? 0 : value;
                      value += kbInfo.event.movementX;
                      if (value > TriggerRotValue)
                      {
                          value = 0;
                          if (counter <= 1)
                              counter = Length;
                          else
                              counter--;
                          //var path = "./assets/Test/Shoe_"+counter+".jpg";                        
                          //texture = new BABYLON.Texture(path, scene)
                          // texture = textureArr[counter-1];
                          textureArr[counter-1].hasAlpha = true;
                          TexMaterial.diffuseTexture = textureArr[counter-1];
                      }                    
                  }
              }
          }
      });
      return scene;
  }
  
  const Scene = CreateScene();
  Engine.runRenderLoop(function() {
          Scene.render();
  });
  
  window.addEventListener('resize', function() {
      Engine.resize();
  });
}

//automatically capturing the image for creating 3d viewer
playvideo.addEventListener('play', () => {
            const captureFrame = () => {
                if (playvideo.paused || playvideo.ended) {
                    return imageEditing();
                    //BabylonCore();
                }
                const canvas = document.getElementById('canvas');
                const ctx = canvas.getContext('2d');
                ctx.drawImage(playvideo, 0, 0, canvas.width, canvas.height);
                //to save the imagedata in the variable
                // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
               var canvasDataUrl = canvas.toDataURL("image/jpeg");
                //var canvasDataUrl=canvas.toBuffer("image/jpeg");
                imagescaptured.push(canvasDataUrl);
                console.log(imagescaptured.length);
                console.log(typeof canvasDataUrl);
                // Access imageData.data to get pixel data
                // Each pixel consists of four values: red, green, blue, and alpha (transparency)
                // You can manipulate or save this data as needed

                // Move to the next frame
                setTimeout(captureFrame, (1000/7) / playvideo.playbackRate);
            };
            captureFrame();
            // Set canvas dimensions to match video
        });   
 function uploadVideo(){
    document.getElementById('mainmenu').style.visibility="hidden";
    document.getElementById('videoPlayer').style.visibility = "visible"; 
    document.getElementById('capture').style.visibility = "visible"; 
    document.getElementById('core').style.visibility = "visible";
    var fileItem = document.getElementById('file');
    var file = fileItem.files[0];
    var url = URL.createObjectURL(file);
    convertBlobURLToVideoVariable(url);
//     videoPlayer2.src = url;
//    await videoPlayer2.load();
//     videoPlayer2.onloadeddata = function() {
//         videoPlayer2.play();
//     }
}

async function imageEditing(){
    var Length = imagescaptured.length;
    for (var i = 0; i < Length; i++)
    {
        try {
        const base64Data=imagescaptured[i];
        const response = await fetch('http://localhost:3000/remove-background', {
            method: 'POST',
            mode: "cors", // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: base64Data })
        });
    
        if (!response.ok) {
            throw new Error('Failed to upload image.');
        }
    
        const result = await response.text();
        // Handle the result, such as displaying it in an <img> element
        console.log('Processed image:', result);
        imagescaptured1.push(result);
     } catch (error) {
         console.error('Error:', error);
     }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust delay time as needed
    }
    //   await Promise.all(uploadFile(imagescaptured[i]));
    
     console.log(imagescaptured1.length);
     BabylonCore();
}
