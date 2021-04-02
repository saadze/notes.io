function showHideVideo(){
    let videoPreview = document.getElementById('video-preview');
    if (videoPreview.style.display == "none"){
        videoPreview.style.display = "block"
    }else{
        videoPreview.style.display = "none";
    }
}
let preview = document.getElementById("video-previewer");
let recording = document.getElementById("video-recorder");
let startButton = document.getElementById("video-record");
let stopButton = document.getElementById("video-stop");
let videoLoading = document.getElementById("video-loader")
let recordingTimeMS = 31000;
var recordNumber = 0;

function wait(delayInMS) {
    return new Promise(resolve => setTimeout(resolve, delayInMS));
}
function startRecording(stream, lengthInMS) {
    let recorder = new MediaRecorder(stream);
    let data = [];
  
    recorder.ondataavailable = event => data.push(event.data);
    recorder.start();
    //
    recording.style.display="none";
    preview.style.display="block";
    startButton.innerText = "Recording";
    //
  
    let stopped = new Promise((resolve, reject) => {
      recorder.onstop = resolve;
      recorder.onerror = event => reject(event.name);
    });
  
    let recorded = wait(lengthInMS).then(() => {
        recorder.state == "recording" && stop(preview.srcObject)
        recordNumber = recordNumber+ 1;
    }
    );
  
    return Promise.all([
      stopped,
      recorded
    ])
    .then(() => data);
}
function stop(stream) {
    videoLoading.style.display = "block";
    preview.style.display="none";
    stream.getTracks().forEach(track => track.stop());
    startButton.innerText="Record";
};
startButton.addEventListener("click", function() {
    if (recordNumber>0){
        preview.style.display = "block";
        recording.style.display = "none";
    }
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
      preview.style.display = "block";
      preview.srcObject = stream;
      preview.captureStream = preview.captureStream || preview.mozCaptureStream;
      return new Promise(resolve => preview.onplaying = resolve);
    }).then(() => startRecording(preview.captureStream(), recordingTimeMS))
    .then (recordedChunks => {
      preview.style.display="none";
      videoLoading.style.display = "block";
      let recordedBlob = new Blob(recordedChunks, { type: "video/mp4" });
      recording.src = URL.createObjectURL(recordedBlob);
      videoLoading.style.display = "none";
      recording.style.display="block";
      startButton.innerText="Record"
    })
    .catch((err)=>console.log(err));
}, false);
stopButton.addEventListener("click", function() {
    stop(preview.srcObject);
}, false);