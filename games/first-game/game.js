const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Game Configuration ---
let canvasWidth, canvasHeight;
let score = 0;
let gameState = 'start'; // 'start', 'playing', 'gameOver'

// --- Game Objects ---
let player = { x: 0, y: 0, size: 50 }; // Represents the player's tap
let targets = [];
let targetSpeed = 2;

function resizeCanvas() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    // Enforce a portrait aspect ratio (e.g., 9:16)
    if (canvasWidth / canvasHeight > 9 / 16) {
        canvasWidth = canvasHeight * (9 / 16);
    }
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}

function drawStartScreen() {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = 'white';
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('寿司タップ', canvasWidth / 2, canvasHeight / 3);
    ctx.font = '24px sans-serif';
    ctx.fillText('タップしてスタート', canvasWidth / 2, canvasHeight / 2);
}

function drawGameScreen() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw targets
    targets.forEach(target => {
        if (assetsLoaded) {
            ctx.drawImage(sushiImage, target.x - target.size / 2, target.y - target.size / 2, target.size, target.size);
        } else {
            ctx.fillStyle = 'red'; // Fallback if image not loaded
            ctx.fillRect(target.x - target.size / 2, target.y - target.size / 2, target.size, target.size);
        }
    });

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`スコア: ${score}`, 10, 40);
}

function drawGameOverScreen() {
    ctx.fillStyle = 'rgba(51, 51, 51, 0.8)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = 'white';
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ゲームオーバー', canvasWidth / 2, canvasHeight / 3);
    ctx.font = '32px sans-serif';
    ctx.fillText(`最終スコア: ${score}`, canvasWidth / 2, canvasHeight / 2);
    ctx.font = '24px sans-serif';
    ctx.fillText('タップしてリトライ', canvasWidth / 2, canvasHeight * 2 / 3);
}

function update() {
    if (gameState !== 'playing') return;

    // Move targets
    targets.forEach(target => {
        target.y += targetSpeed;
    });

    // Remove targets that are off-screen
    targets = targets.filter(target => target.y < canvasHeight + 50);

    // Add new targets periodically
    if (Math.random() < 0.03) {
        targets.push({
            x: Math.random() * canvasWidth,
            y: -50,
            size: 50 + Math.random() * 30
        });
    }
    
    // Check for game over (e.g., if a target reaches the bottom)
    if (targets.some(t => t.y > canvasHeight)) {
        gameState = 'gameOver';
    }
}

function gameLoop() {
    update();

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (gameState === 'start') {
        drawStartScreen();
    } else if (gameState === 'playing') {
        drawGameScreen();
    } else if (gameState === 'gameOver') {
        drawGameOverScreen();
    }

    requestAnimationFrame(gameLoop);
}

function handleTap(event) {
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches ? event.touches[0] : event;
    const tapX = touch.clientX - rect.left;
    const tapY = touch.clientY - rect.top;

    if (gameState === 'start') {
        gameState = 'playing';
        score = 0;
        targets = [];
    } else if (gameState === 'playing') {
        // Check if a target was tapped
        targets.forEach((target, index) => {
            const distance = Math.sqrt(Math.pow(tapX - target.x, 2) + Math.pow(tapY - target.y, 2));
            if (distance < target.size / 2) {
                targets.splice(index, 1);
                score++;
            }
        });
    } else if (gameState === 'gameOver') {
        gameState = 'start';
    }
}

// --- Event Listeners ---
window.addEventListener('resize', resizeCanvas, false);
canvas.addEventListener('touchstart', handleTap, false);
canvas.addEventListener('mousedown', handleTap, false); // For desktop testing

// --- Initialisation ---
resizeCanvas();
gameLoop();
