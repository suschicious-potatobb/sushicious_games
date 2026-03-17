document.addEventListener('DOMContentLoaded', () => {
    const gameList = document.getElementById('game-list');

    const games = [
        {
            id: 'first-game',
            title: '寿司タップ',
            thumbnail: 'games/first-game/thumbnail.svg'
        }
    ];

    games.forEach(game => {
        const gameCard = document.createElement('a');
        gameCard.href = `game-frame.html?game=${game.id}`;
        gameCard.className = 'game-card';

        const thumbnail = document.createElement('img');
        thumbnail.src = game.thumbnail;
        thumbnail.alt = game.title;
        thumbnail.style.width = '100%';
        thumbnail.style.height = '150px';
        thumbnail.style.objectFit = 'cover';
        thumbnail.style.backgroundColor = '#ddd';

        const title = document.createElement('h3');
        title.textContent = game.title;

        gameCard.appendChild(thumbnail);
        gameCard.appendChild(title);
        gameList.appendChild(gameCard);
    });
});
