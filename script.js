const gameContainer = document.getElementById("gameContainer");
const basket = document.getElementById("basket");
const scoreboard = document.getElementById("scoreboard");
const livesDisplay = document.getElementById("lives");
const gameOverScreen = document.getElementById("gameOver");
const finalScoreText = document.getElementById("finalScore");

let score = 0;
let lives = 5;
let basketX = window.innerWidth / 2 - 50;
let diyaInterval;
let gameTimer;

// Basket movement
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && basketX > 0) basketX -= 30;
  if (e.key === "ArrowRight" && basketX < window.innerWidth - 100) basketX += 30;
  basket.style.left = basketX + "px";
});
 d0cocument.addEventListener("touchmove", (e) => {
    const touchX = e.touches[0].clientX;
    basketX = touchX - basket.offsetWidth / 2;
    if (basketX < 0) basketX = 0;
    if (basketX > window.innerWidth - basket.offsetWidth) basketX = window.innerWidth - basket.offsetWidth;
    basket.style.left = basketX + "px";
});

// Create falling diyas
function createDiya() {
  const diya = document.createElement("div");
  diya.classList.add("diya");
  diya.style.left = Math.random() * (window.innerWidth - 40) + "px";
  gameContainer.appendChild(diya);

  let diyaY = 0;
  const fall = setInterval(() => {
    diyaY += 2;
    diya.style.top = diyaY + "px";

    const basketRect = basket.getBoundingClientRect();
    const diyaRect = diya.getBoundingClientRect();

    if (
      diyaRect.bottom >= basketRect.top &&
      diyaRect.left >= basketRect.left &&
      diyaRect.right <= basketRect.right
    ) {
      score++;
      scoreboard.textContent = "Score: " + score;
      diya.remove();
      clearInterval(fall);
    } else if (diyaY > window.innerHeight - 40) {
      lives--;
      livesDisplay.textContent = "❤".repeat(lives);
      diya.remove();
      clearInterval(fall);
      if (lives <= 0) endGame();
    }
  }, 20);
}

// Fireworks
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

// End game
function endGame(timeUp = false) {
  clearInterval(diyaInterval);
  clearTimeout(gameTimer);
  gameOverScreen.style.display = "block";
  finalScoreText.textContent = timeUp
    ? `Time's up! You caught ${score} diyas! 🎇`
    : `You lost all lives! You caught ${score} diyas! 💔`;
  showFireworks();
}

// Restart
function restartGame() { location.reload(); }

// Start game
function startGame() {
  basket.style.left = basketX + "px";
  diyaInterval = setInterval(createDiya, 1000);
  gameTimer = setTimeout(() => endGame(true), 120000); // 2 minutes
}

startGame();