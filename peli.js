const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Asetetaan canvasin koko ikkunan kokoiseksi
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const paddleHeight = 10;
const paddleWidth = 100;
let paddleX = (canvas.width - paddleWidth) / 2;

const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballDX = 6;
let ballDY = -6;

let gameOver = false;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

document.getElementById('highScore').innerText = `Paras tulos: ${highScore}`;

// Kuunnellaan kosketustapahtumia
canvas.addEventListener('touchmove', handleTouchMove, false);
// Kuunnellaan hiiritapahtumia
canvas.addEventListener('mousemove', handleMouseMove, false);

function handleTouchMove(event) {
    const touch = event.touches[0];
    const relativeX = touch.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function handleMouseMove(event) {
    const relativeX = event.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#FF69B4';  // Kirkkaan pinkki
    ctx.fill();
    ctx.closePath();
}

function draw() {
    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "30px Arial";
        ctx.fillStyle = "#FF69B4";
        ctx.fillText("Game Over", canvas.width / 2 - 70, canvas.height / 2);

        // Päivitä paras tulos
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            document.getElementById('highScore').innerText = `Paras tulos: ${highScore}`;
        }
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawBall();

    if (ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) {
        ballDX = -ballDX;
    }
    if (ballY + ballDY < ballRadius) {
        ballDY = -ballDY;
    } else if (ballY + ballDY > canvas.height - ballRadius) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballDY = -ballDY;
            score++;
            document.getElementById('score').innerText = `Pisteet: ${score}`;
        } else {
            gameOver = true;
        }
    }

    ballX += ballDX;
    ballY += ballDY;

    requestAnimationFrame(draw);
}

// Aloitetaan piirtäminen
draw();
