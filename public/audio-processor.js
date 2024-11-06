// let audioContext;
// let analyser;
// const bufferLength = 256;
// const dataArray = new Uint8Array(bufferLength);

// function initAudio() {
//     if (!audioContext) {
//         audioContext = new (window.AudioContext || window.webkitAudioContext)();
//         analyser = audioContext.createAnalyser();
//         analyser.fftSize = 256;

//         navigator.mediaDevices.getUserMedia({ audio: true })
//             .then((stream) => {
//                 const source = audioContext.createMediaStreamSource(stream);
//                 source.connect(analyser);
//                 processAudio();
//             })
//             .catch((err) => {
//                 console.error('Error accessing microphone', err);
//             });
//     }
// }

// function processAudio() {
//     analyser.getByteFrequencyData(dataArray);
//     socket.send(dataArray);
//     requestAnimationFrame(processAudio);
// }

// window.addEventListener('click', () => {
//     console.log(dataArray);
//     const micButton = document.getElementById("instructions");
//     micButton.style.display = "none";

//     if (!audioContext) {
//         initAudio(); // Initialize audio on first click
//     } else if (audioContext.state === 'suspended') {
//         audioContext.resume().then(() => {
//             console.log('Audio context resumed');
//             processAudio(); // Start processing after resuming
//         });
//     }
// });
