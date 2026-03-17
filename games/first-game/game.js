const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Game Configuration ---
let canvasWidth, canvasHeight;
let score = 0;
let gameState = 'start'; // 'start', 'playing', 'gameOver'

// --- Game Objects ---
let player = { x: 0, y: 0, size: 50 }; // Represents the player's tap
let targets = [];
let targetSpeed = 3;

function resizeCanvas() {
    // Get viewport size (CSS pixels)
    let viewWidth = window.innerWidth || 300;
    let viewHeight = window.innerHeight || 500;

    // Default to filling the screen
    canvasWidth = viewWidth;
    canvasHeight = viewHeight;

    // Only restrict width on desktop/landscape screens to maintain portrait ratio
    const maxAspectRatio = 9 / 16;
    if (viewWidth / viewHeight > maxAspectRatio) {
        canvasWidth = Math.floor(viewHeight * maxAspectRatio);
    }

    // Ensure we have a valid size
    canvasWidth = Math.max(200, canvasWidth);
    canvasHeight = Math.max(300, canvasHeight);

    // Set internal resolution (use Math.floor for safety)
    canvas.width = Math.floor(canvasWidth);
    canvas.height = Math.floor(canvasHeight);

    // Ensure the canvas element fills the width/height correctly in style
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
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

// --- Drawing Helpers ---
function drawRoundedRect(ctx, x, y, width, height, radius) {
    if (ctx.roundRect) {
        ctx.roundRect(x, y, width, height, radius);
    } else {
        // Fallback for older browsers
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
}

function drawGameScreen() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw targets
    targets.forEach(target => {
        // Shari (Rice) - White oval
        ctx.fillStyle = 'white';
        ctx.beginPath();
        if (ctx.ellipse) {
            ctx.ellipse(target.x, target.y + 10, target.size / 2, target.size / 3, 0, 0, Math.PI * 2);
        } else {
            // Fallback for very old browsers: simple circle
            ctx.arc(target.x, target.y + 10, target.size / 2.5, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.strokeStyle = '#ccc';
        ctx.stroke();

        // Neta (Topping) - Red rectangle
        ctx.fillStyle = 'red';
        ctx.beginPath();
        drawRoundedRect(ctx, target.x - target.size / 2, target.y - target.size / 4, target.size, target.size / 2, 5);
        ctx.fill();
    });

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`スコア: ${score}`, 10, 40);

    // DEBUG info (Temporary)
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`W:${canvas.width} H:${canvas.height} T:${targets.length} S:${gameState}`, 10, 60);
}

function drawGameOverScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ゲームオーバー', canvasWidth / 2, canvasHeight / 3);
    ctx.font = '24px sans-serif';
    ctx.fillText(`スコア: ${score}`, canvasWidth / 2, canvasHeight / 2);
    ctx.fillStyle = '#ffcc00';
    ctx.fillText('タップしてリトライ', canvasWidth / 2, canvasHeight * 0.7);
}

function update() {
    if (gameState !== 'playing') return;

    // Move targets
    targets.forEach(target => {
        target.y += targetSpeed;
    });

    // Add new targets periodically
    // Increased spawn rate slightly for testing (0.04)
    if (Math.random() < 0.04) {
        // Ensure targets are within canvas width (with margin)
        const size = 50 + Math.random() * 30;
        targets.push({
            x: size/2 + Math.random() * (canvasWidth - size),
            y: -size,
            size: size
        });
    }
    
    // Check for game over (target falls below bottom)
    // Add some buffer (50px) so it doesn't end too abruptly
    if (targets.some(t => t.y > canvasHeight + 50)) {
        gameState = 'gameOver';
        lastStateChange = Date.now();
    }

    // Remove targets that are definitely off-screen to keep the array small
    if (targets.length > 50) {
        targets = targets.filter(t => t.y < canvasHeight + 100);
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

let lastStateChange = 0;

function handleTap(event) {
    const now = Date.now();
    // Debounce state changes (0.3s)
    const canChangeState = (now - lastStateChange > 300);

    // Prevent default behavior to avoid scrolling/zooming on mobile
    if (event.cancelable) {
        event.preventDefault();
    }

    const rect = canvas.getBoundingClientRect();
    const touch = (event.touches && event.touches[0]) || (event.changedTouches && event.changedTouches[0]) || event;
    const tapX = touch.clientX - rect.left;
    const tapY = touch.clientY - rect.top;

    if (gameState === 'start' && canChangeState) {
        gameState = 'playing';
        score = 0;
        targets = [];
        lastStateChange = now;
    } else if (gameState === 'playing') {
        // Check if a target was tapped
        targets.forEach((target, index) => {
            const distance = Math.sqrt(Math.pow(tapX - target.x, 2) + Math.pow(tapY - target.y, 2));
            if (distance < target.size / 2) {
                targets.splice(index, 1);
                score++;
            }
        });
    } else if (gameState === 'gameOver' && canChangeState) {
        gameState = 'start';
        lastStateChange = now;
    }
}

// --- Event Listeners ---
window.addEventListener('resize', resizeCanvas, false);
canvas.addEventListener('touchstart', handleTap, { passive: false });
canvas.addEventListener('mousedown', handleTap, false); // For desktop testing

// --- Initialisation ---
console.log('Game Initializing...');
resizeCanvas();
console.log('Canvas Size:', canvasWidth, 'x', canvasHeight);
gameLoop();
