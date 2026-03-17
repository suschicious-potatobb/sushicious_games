document.addEventListener('DOMContentLoaded', () => {
    const gameList = document.getElementById('game-list');

    const games = [
        {
            id: 'first-game',
            title: 'Sushi Tap',
            tag: 'Action',
            thumbnail: 'games/first-game/thumbnail.svg'
        }
    ];

    games.forEach(game => {
        const gameCard = document.createElement('a');
        gameCard.href = `game-frame.html?game=${game.id}`;
        gameCard.className = 'game-card';

        gameCard.innerHTML = `
            <div class="thumbnail-container">
                <img src="${game.thumbnail}" alt="${game.title}" loading="lazy">
            </div>
            <div class="game-info">
                <span class="game-tag">${game.tag}</span>
                <h3>${game.title}</h3>
            </div>
        `;

        gameList.appendChild(gameCard);
    });
});
