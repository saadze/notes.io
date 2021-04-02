function showHideAudio(){
    let textarea = document.getElementById('audio-recorder');
    if (textarea.style.display == "none"){
        textarea.style.display = "flex";
    }else{
        textarea.style.display = "none";
    }
}
let audioPreview = document.getElementById("audio-preview");
let audioRecording = document.getElementById("audio-bar");
let audioStartButton = document.getElementById("audio-record");
let audioStopButton = document.getElementById("audio-stop");
let audioLoading = document.getElementById("audio-loader");
var audioRecordNumber = 0;
var audioRecordingTimeMS = 31000;

function wait(delayInMS) {
    return new Promise(resolve => setTimeout(resolve, delayInMS));
}
function startAudioRecording(stream, lengthInMS) {
    let recorder = new MediaRecorder(stream);
    let data = [];
  
    recorder.ondataavailable = event => data.push(event.data);
    recorder.start();
    //
    audioRecording.style.display="none";
    audioStartButton.innerText = "Recording";
    //
  
    let stopped = new Promise((resolve, reject) => {
      recorder.onstop = resolve;
      recorder.onerror = event => reject(event.name);
    });
  
    let recorded = wait(lengthInMS).then(
      () => {recorder.state == "recording" && stopAudio(audioPreview.srcObject)
        audioRecordNumber = audioRecordNumber+ 1;
    }
    );
  
    return Promise.all([
      stopped,
      recorded
    ])
    .then(() => data);
}
function stopAudio(stream) {
    audioLoading.style.display = "block";
    stream.getTracks().forEach(track => track.stop());
    audioStartButton.innerText="Record";
}
audioStartButton.addEventListener("click", function() {
    navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true
    }).then(stream => {
      audioPreview.srcObject = stream;
      audioPreview.captureStream = audioPreview.captureStream || audioPreview.mozCaptureStream;
      return new Promise(resolve => audioPreview.onplaying = resolve);
    }).then(() => startAudioRecording(audioPreview.captureStream(), audioRecordingTimeMS))
    .then (recordedChunks => {
      videoLoading.style.display = "block";
      let recordedBlob = new Blob(recordedChunks, { type: "audio/mp3" });
      audioRecording.src = URL.createObjectURL(recordedBlob);
      audioLoading.style.display = "none";
      audioRecording.style.display = "block";
      audioStartButton.innerText = "Record";
    })
    .catch((err)=>console.log(err));
  }, false);
audioStopButton.addEventListener("click", function() {
    stopAudio(audioPreview.srcObject);
}, false);