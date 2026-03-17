document.addEventListener('DOMContentLoaded', () => {
    const gameList = document.getElementById('game-list');
    const langToggle = document.getElementById('lang-toggle');

    // --- Translations ---
    const translations = {
        en: {
            nav_games: "Games",
            nav_contact: "Contact",
            hero_title: "Bite-sized Fun.",
            hero_subtitle: "Explore our collection of premium, mobile-optimized indie games. No installs, just play.",
            featured_games: "Featured Games",
            advertisement: "Advertisement",
            ad_space: "Ad Space",
            footer_terms: "Terms",
            footer_privacy: "Privacy",
            footer_contact: "Contact",
            all_rights_reserved: "All rights reserved.",
            contact_desc: "For feedback, bug reports, or other inquiries, please contact us at the following email address.",
            game_tag_action: "Action",
            game_sushi_tap_title: "Sushi Tap",
            game_sushi_tap_desc: "Tap the falling sushi to score points!"
        },
        ja: {
            nav_games: "ゲーム一覧",
            nav_contact: "お問い合わせ",
            hero_title: "手軽に、楽しく。",
            hero_subtitle: "インストール不要。ブラウザで今すぐ遊べる、高品質なインディーゲーム・コレクション。",
            featured_games: "注目のゲーム",
            advertisement: "スポンサー広告",
            ad_space: "広告スペース",
            footer_terms: "利用規約",
            footer_privacy: "プライバシーポリシー",
            footer_contact: "お問い合わせ",
            all_rights_reserved: "無断複写・転載を禁じます。",
            contact_desc: "ご意見、ご感想、不具合のご報告などは、以下のメールアドレスまでご連絡ください。",
            game_tag_action: "アクション",
            game_sushi_tap_title: "寿司タップ",
            game_sushi_tap_desc: "落ちてくる寿司をタップしてハイスコアを目指そう！"
        }
    };

    let currentLang = localStorage.getItem('sushicious_lang') || (navigator.language.startsWith('ja') ? 'ja' : 'en');

    function updateUI() {
        // Update static text
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                el.textContent = translations[currentLang][key];
            }
        });

        // Update games list
        renderGames();
        
        // Update document language
        document.documentElement.lang = currentLang;
    }

    const games = [
        {
            id: 'first-game',
            titleKey: 'game_sushi_tap_title',
            tagKey: 'game_tag_action',
            thumbnail: 'games/first-game/thumbnail.svg'
        }
    ];

    function renderGames() {
        if (!gameList) return;
        gameList.innerHTML = '';
        
        games.forEach(game => {
            const gameCard = document.createElement('a');
            gameCard.href = `game-frame.html?game=${game.id}`;
            gameCard.className = 'game-card';

            const title = translations[currentLang][game.titleKey];
            const tag = translations[currentLang][game.tagKey];

            gameCard.innerHTML = `
                <div class="thumbnail-container">
                    <img src="${game.thumbnail}" alt="${title}" loading="lazy">
                </div>
                <div class="game-info">
                    <span class="game-tag">${tag}</span>
                    <h3>${title}</h3>
                </div>
            `;

            gameList.appendChild(gameCard);
        });
    }

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ja' : 'en';
        localStorage.setItem('sushicious_lang', currentLang);
        updateUI();
    });

    // Initial UI update
    updateUI();
});
