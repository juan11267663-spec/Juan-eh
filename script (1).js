const quotes = [
  "Smile! It makes you look younger 😄",
  "A smile is the prettiest thing you can wear 💙",
  "Smiling is contagious — spread it! 😊",
  "Your smile can light up the darkest day 🌞",
  "Keep smiling, because life is beautiful! 🌸"
];

const quoteEl = document.getElementById("quote");
const startBtn = document.getElementById("start-btn");
const cameraSection = document.getElementById("camera-section");
const video = document.getElementById("video");
const meterFill = document.getElementById("fill");
const meterText = document.getElementById("meter-text");

quoteEl.textContent = quotes[Math.floor(Math.random() * quotes.length)];

startBtn.addEventListener("click", async () => {
  document.getElementById("quote-section").style.display = "none";
  cameraSection.style.display = "block";

  // Load face-api models
  await faceapi.nets.tinyFaceDetector.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js/models");
  await faceapi.nets.faceExpressionNet.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js/models");

  // Start video
  navigator.mediaDevices.getUserMedia({ video: {} })
    .then(stream => {
      video.srcObject = stream;
    });

  video.addEventListener("playing", () => {
    const canvas = document.getElementById("overlay");
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
      const resized = faceapi.resizeResults(detections, displaySize);
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resized);

      if (detections.length > 0) {
        const smileScore = detections[0].expressions.happy;
        const percentage = Math.round(smileScore * 100);
        meterFill.style.width = percentage + "%";
        meterText.textContent = "Smile Meter: " + percentage + "%";

        if (percentage >= 100) {
          meterText.textContent = "🎉 100%! Your smile is perfect! 💙";
        }
      }
    }, 500);
  });
});