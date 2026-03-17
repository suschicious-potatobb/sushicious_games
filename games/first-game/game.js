const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Multilingual Support ---
const translations = {
    en: {
        game_title: "Sushi Tap",
        tap_to_start: "Tap to Start",
        score: "Score",
        game_over: "GAME OVER",
        all_time_top: "--- ALL TIME TOP 3 ---",
        today_top: "--- TODAY TOP 3 ---",
        community_top: "--- GLOBAL TOP 3 ---",
        tap_to_retry: "Tap to Retry",
        pts: "pts"
    },
    ja: {
        game_title: "寿司タップ",
        tap_to_start: "タップしてスタート",
        score: "スコア",
        game_over: "ゲームオーバー",
        all_time_top: "--- 通算ランキング ---",
        today_top: "--- 本日のランキング ---",
        community_top: "--- 世界ランキング ---",
        tap_to_retry: "タップしてリトライ",
        pts: "点"
    }
};

let currentLang = localStorage.getItem('sushicious_lang') || (navigator.language.startsWith('ja') ? 'ja' : 'en');
const t = (key) => translations[currentLang][key] || key;

// --- Game Configuration ---
let canvasWidth, canvasHeight;
let score = 0;
let gameState = 'start'; // 'start', 'playing', 'gameOver'

// --- Ranking Configuration ---
const STORAGE_KEY_ALL_TIME = 'sushicious_all_time_rank';
const STORAGE_KEY_DAILY = 'sushicious_daily_rank';

function getRanking(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function saveRanking(key, score) {
    let ranking = getRanking(key);
    const today = new Date().toLocaleDateString();
    
    // For daily rank, check if the data is from today
    if (key === STORAGE_KEY_DAILY) {
        const lastDate = localStorage.getItem(key + '_date');
        if (lastDate !== today) {
            ranking = [];
            localStorage.setItem(key + '_date', today);
        }
    }

    ranking.push({ score, date: today, timestamp: Date.now() });
    ranking.sort((a, b) => b.score - a.score);
    ranking = ranking.slice(0, 3); // Keep only top 3
    localStorage.setItem(key, JSON.stringify(ranking));
}

// --- Game Objects ---
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

    // Set internal resolution
    canvas.width = Math.floor(canvasWidth);
    canvas.height = Math.floor(canvasHeight);

    // Ensure the canvas element fills the width/height correctly in style
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
}

function drawRankList(title, list, yStart) {
    ctx.fillStyle = '#f0f0f0';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, canvasWidth / 2, yStart);
    
    ctx.font = 'bold 18px monospace';
    if (list.length === 0) {
        ctx.fillStyle = '#666';
        ctx.fillText('-', canvasWidth / 2, yStart + 35);
    } else {
        list.forEach((item, i) => {
            ctx.fillStyle = i === 0 ? '#ffd700' : (i === 1 ? '#e0e0e0' : (i === 2 ? '#cd7f32' : '#ffffff'));
            ctx.fillText(`${i + 1}. ${item.score} ${t('pts')}`, canvasWidth / 2, yStart + 35 + (i * 28));
        });
    }
}

function drawStartScreen() {
    // Background color
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw Title
    ctx.fillStyle = '#ff3e3e';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t('game_title'), canvasWidth / 2, canvasHeight * 0.15);
    
    // Rankings (Currently using local as placeholder for global)
    const allTime = getRanking(STORAGE_KEY_ALL_TIME);
    drawRankList(t('community_top'), allTime, canvasHeight * 0.35);

    // Hint - Animate opacity slightly or just draw
    ctx.fillStyle = `rgba(240, 240, 240, ${0.7 + Math.sin(Date.now() / 300) * 0.3})`;
    ctx.font = '22px sans-serif';
    ctx.fillText(t('tap_to_start'), canvasWidth / 2, canvasHeight * 0.85);
}

// --- Drawing Helpers ---
function drawRoundedRect(ctx, x, y, width, height, radius) {
    if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, radius);
        ctx.fill();
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
        ctx.fill();
    }
}

function drawGameScreen() {
    // Clear to dark background
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw targets
    targets.forEach(target => {
        // Shari (Rice) - White oval
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        if (ctx.ellipse) {
            ctx.ellipse(target.x, target.y + 10, target.size / 2, target.size / 3, 0, 0, Math.PI * 2);
        } else {
            ctx.arc(target.x, target.y + 10, target.size / 2.5, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Neta (Topping) - Red rectangle
        ctx.fillStyle = '#ff3e3e';
        drawRoundedRect(ctx, target.x - target.size / 2, target.y - target.size / 4, target.size, target.size / 2, 8);
    });

    // Draw score (White text for visibility)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${t('score')}: ${score}`, 15, 45);
}

function drawGameOverScreen() {
    ctx.fillStyle = 'rgba(15, 15, 15, 0.9)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t('game_over'), canvasWidth / 2, canvasHeight * 0.15);
    
    ctx.fillStyle = '#ffcc00';
    ctx.font = 'bold 54px sans-serif';
    ctx.fillText(score, canvasWidth / 2, canvasHeight * 0.28);
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(t('score').toUpperCase(), canvasWidth / 2, canvasHeight * 0.33);

    // Rankings
    const allTime = getRanking(STORAGE_KEY_ALL_TIME);
    const daily = getRanking(STORAGE_KEY_DAILY);

    drawRankList(t('all_time_top'), allTime, canvasHeight * 0.45);
    drawRankList(t('today_top'), daily, canvasHeight * 0.70);

    ctx.fillStyle = '#ffffff';
    ctx.font = '20px sans-serif';
    ctx.fillText(t('tap_to_retry'), canvasWidth / 2, canvasHeight * 0.92);
}

function update() {
    if (gameState !== 'playing') return;

    // Move targets
    targets.forEach(target => {
        target.y += targetSpeed;
    });

    // Add new targets
    if (Math.random() < 0.04) {
        const size = 50 + Math.random() * 30;
        targets.push({
            x: size/2 + Math.random() * (canvasWidth - size),
            y: -size,
            size: size
        });
    }
    
    // Check for game over
    if (targets.some(t => t.y > canvasHeight + 50)) {
        gameState = 'gameOver';
        saveRanking(STORAGE_KEY_ALL_TIME, score);
        saveRanking(STORAGE_KEY_DAILY, score);
        lastStateChange = Date.now();
    }

    if (targets.length > 50) {
        targets = targets.filter(t => t.y < canvasHeight + 100);
    }
}

function gameLoop() {
    update();
    
    // Read lang preference frequently to sync with parent
    currentLang = localStorage.getItem('sushicious_lang') || 'en';

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
    const canChangeState = (now - lastStateChange > 300);

    if (event.type === 'touchstart' && event.cancelable) {
        event.preventDefault();
    }

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else if (event.changedTouches && event.changedTouches.length > 0) {
        clientX = event.changedTouches[0].clientX;
        clientY = event.changedTouches[0].clientY;
    } else {
        clientX = event.clientX;
        clientY = event.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const tapX = (clientX - rect.left) * scaleX;
    const tapY = (clientY - rect.top) * scaleY;

    if (gameState === 'start' && canChangeState) {
        gameState = 'playing';
        score = 0;
        targets = [];
        lastStateChange = now;
    } else if (gameState === 'playing') {
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

window.addEventListener('resize', resizeCanvas, false);
canvas.addEventListener('touchstart', handleTap, { passive: false });
canvas.addEventListener('mousedown', handleTap, false);

resizeCanvas();
gameLoop();
