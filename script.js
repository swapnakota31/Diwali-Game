const gameContainer = document.getElementById("gameContainer");
const basket = document.getElementById("basket");
const scoreboard = document.getElementById("scoreboard");
const livesDisplay = document.getElementById("lives");
const timerDisplay = document.getElementById("timer");
const gameOverScreen = document.getElementById("gameOver");
const finalScoreText = document.getElementById("finalScore");

let score = 0;
let lives = 3;
let basketX = window.innerWidth / 2 - basket.offsetWidth / 2;
let diyaInterval, gameTimer, countdownTimer;
let speed = 2; // starting fall speed

basket.style.left = basketX + "px";
livesDisplay.textContent = "❤".repeat(lives);
scoreboard.textContent = "Score: " + score;

// --- Basket movement ---
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") basketX -= 35;
  if (e.key === "ArrowRight") basketX += 35;
  if (basketX < 0) basketX = 0;
  if (basketX > window.innerWidth - basket.offsetWidth)
    basketX = window.innerWidth - basket.offsetWidth;
  basket.style.left = basketX + "px";
});

// Touch movement (for mobile)
document.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const touchX = e.touches[0].clientX;
  basketX = touchX - basket.offsetWidth / 2;
  if (basketX < 0) basketX = 0;
  if (basketX > window.innerWidth - basket.offsetWidth)
    basketX = window.innerWidth - basket.offsetWidth;
  basket.style.left = basketX + "px";
}, { passive: false });

// --- Create diyas ---
function createDiya() {
  const diya = document.createElement("div");
  diya.classList.add("diya");
  
  // Random spacing logic to avoid overlap
  const randomX = Math.random() * (window.innerWidth - 50);
  diya.style.left = `${randomX}px`;
  diya.style.top = "0px";
  gameContainer.appendChild(diya);

  let diyaY = 0;
  const fallSpeed = speed + Math.random() * 1.5; // adds randomness

  const fall = setInterval(() => {
    diyaY += fallSpeed;
    diya.style.top = diyaY + "px";

    const basketRect = basket.getBoundingClientRect();
    const diyaRect = diya.getBoundingClientRect();

    if (
      diyaRect.bottom >= basketRect.top &&
      diyaRect.top <= basketRect.bottom &&
      diyaRect.right >= basketRect.left &&
      diyaRect.left <= basketRect.right
    ) {
      score++;
      scoreboard.textContent = "Score: " + score;
      diya.remove();
      clearInterval(fall);
    } else if (diyaY > window.innerHeight) {
      lives--;
      livesDisplay.textContent = "❤".repeat(lives);
      diya.remove();
      clearInterval(fall);
      if (lives <= 0) endGame(false);
    }
  }, 15);
}

// --- Fireworks ---
function showFireworks() {
  for (let i = 0; i < 25; i++) {
    const fire = document.createElement("div");
    fire.classList.add("firework");
    fire.style.top = Math.random() * window.innerHeight + "px";
    fire.style.left = Math.random() * window.innerWidth + "px";
    gameContainer.appendChild(fire);
    setTimeout(() => fire.remove(), 2000);
  }
}

// --- Timer ---
function startTimer(duration) {
  let timeLeft = duration;
  countdownTimer = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `⏳ ${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    if (timeLeft <= 0) {
      clearInterval(countdownTimer);
      endGame(true);
    }
  }, 1000);
}

// --- End Game ---
function endGame(timeUp = false) {
  clearInterval(diyaInterval);
  clearInterval(countdownTimer);
  gameOverScreen.style.display = "flex";
  finalScoreText.textContent = timeUp
    ? `⏰ Time's up! You caught ${score} diyas! 🎇`
    : `You lost all lives! You caught ${score} diyas! 💔`;
  showFireworks();
}

// --- Restart ---
function restartGame() {
  location.reload();
}

// --- Start Game ---
function startGame() {
  diyaInterval = setInterval(() => {
    createDiya();
    // gradually increase difficulty
    if (score % 10 === 0 && score > 0) speed += 0.3;
  }, 800);
  startTimer(120); // 2 minutes = 120s
}

startGame();