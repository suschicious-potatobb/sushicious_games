document.addEventListener('DOMContentLoaded', () => {
    const gameList = document.getElementById('game-list');

    const games = [
        {
            id: 'first-game',
            title: '寿司タップ',
            thumbnail: 'path/to/thumbnail.png' // 後で適切なパスに置き換えます
        }
    ];

    games.forEach(game => {
        const gameCard = document.createElement('a');
        gameCard.href = `game-frame.html?game=${game.id}`;
        gameCard.className = 'game-card';

        const thumbnail = document.createElement('img');
        // サムネイルがないので、一時的に色付きのdivで代用します
        thumbnail.style.backgroundColor = '#ddd';
        thumbnail.style.height = '150px';
        thumbnail.alt = game.title;

        const title = document.createElement('h3');
        title.textContent = game.title;

        gameCard.appendChild(thumbnail);
        gameCard.appendChild(title);
        gameList.appendChild(gameCard);
    });
});
