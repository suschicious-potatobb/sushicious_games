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
            game_tag_catch: "Catch",
            game_tag_puzzle: "Puzzle",
            game_sushi_tap_title: "Sushi Tap",
            game_sushi_tap_desc: "Tap the falling sushi to score points!",
            game_sushi_catch_title: "Sushi Catch",
            game_sushi_catch_desc: "Catch falling sushi on your plate!",
            game_sushi_match_title: "Sushi Match",
            game_sushi_match_desc: "Match the pairs of sushi as fast as you can!",
            nav_home: "Home",
            about_game: "About this game",
            how_to_play: "How to play",
            pro_tips: "Pro Tips",
            sushi_tap_desc_long: "Sushi Tap is a simple yet addictive action game where you tap sushi falling from the top of the screen to see how high a score you can get within the time limit. Experience the exhilarating gameplay themed around Sushi, Japan's traditional food culture.",
            sushi_tap_rule_1: "Tap the sushi falling from the top with your finger (or mouse).",
            sushi_tap_rule_2: "Successful taps add to your score.",
            sushi_tap_rule_3: "Try to tap as many sushi as possible without missing to reach the high score!",
            sushi_tap_tips: "The key is to tap rhythmically before the sushi reaches the bottom of the screen. Especially when the speed increases, it's important to stay calm and hit the targets accurately. Challenge yourself and aim for the top of the world rankings!",
            sushi_catch_desc_long: "Sushi Catch is an action game where you move a plate at the bottom to catch sushi falling from the top of the screen. Catch the falling ingredients without missing to aim for a high score. It's a simple yet exciting game that tests your concentration as the speed increases.",
            sushi_catch_rule_1: "Slide your finger or mouse left and right to move the plate.",
            sushi_catch_rule_2: "Catching falling sushi within the plate adds to your score.",
            sushi_catch_rule_3: "Be careful not to miss any sushi and aim for combos!",
            sushi_catch_tips: "The falling speed of the sushi increases gradually. Keeping the plate near the center of the screen allows you to react quickly whether the sushi falls to the left or right. Staying calm and moving accurately is the shortcut to a high score.",
            sushi_match_desc_long: "Sushi Match is a memory puzzle game where you find pairs of identical sushi from a shuffled set. Compete for the time it takes to clear all pairs. Have fun activating your brain while looking at delicious sushi. Easy for everyone from children to adults to enjoy.",
            sushi_match_rule_1: "Flip over the face-down cards to find pairs of identical sushi.",
            sushi_match_rule_2: "You can flip up to two cards at a time. If the ingredients match, the cards disappear.",
            sushi_match_rule_3: "The time taken to clear all cards is recorded. Aim for the fastest time!",
            sushi_match_tips: "The shortcut to clearing the game is to remember the locations of the cards you've flipped rather than rushing. Also, be careful with similar-looking ingredients (like tuna and fatty tuna) and match the pairs accurately. Repeated play improves your memory and speed."
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
            game_tag_catch: "キャッチ",
            game_tag_puzzle: "パズル",
            game_sushi_tap_title: "寿司タップ",
            game_sushi_tap_desc: "落ちてくる寿司をタップしてハイスコアを目指そう！",
            game_sushi_catch_title: "寿司キャッチ",
            game_sushi_catch_desc: "お皿を動かして落ちてくる寿司をキャッチしよう！",
            game_sushi_match_title: "寿司マッチ",
            game_sushi_match_desc: "同じ寿司のペアを素早く揃えよう！",
            nav_home: "ホーム",
            about_game: "このゲームについて",
            how_to_play: "遊び方",
            pro_tips: "攻略のコツ",
            sushi_tap_desc_long: "「寿司タップ」は、画面の上から次々と落ちてくるお寿司をタップして、制限時間内にどれだけ高いスコアを出せるかを競う、シンプルながらも中毒性の高いアクションゲームです。日本の伝統的な食文化である「寿司」をテーマにした、爽快感あふれるプレイ体験を楽しめます。",
            sushi_tap_rule_1: "上から落ちてくる寿司を指（またはマウス）でタップしてください。",
            sushi_tap_rule_2: "タップに成功するとスコアが加算されます。",
            sushi_tap_rule_3: "一度にたくさんの寿司を逃さずタップして、ハイスコアを目指しましょう！",
            sushi_tap_tips: "寿司が画面の下端に到達する前に、リズムよくタップするのがポイントです。特にスピードが上がってきたときは、焦らずに正確にターゲットを捉えることが重要です。何度も挑戦して、世界ランキングのトップを目指しましょう！",
            sushi_catch_desc_long: "「寿司キャッチ」は、画面上部から次々と落ちてくる寿司を、下にあるお皿を動かして上手にキャッチするアクションゲームです。次々に落ちてくるネタを逃さず受け止めて、ハイスコアを目指しましょう。シンプルながらも、スピードが上がると集中力が試されるエキサイティングなゲームです。",
            sushi_catch_rule_1: "マウス、または指で画面を左右にスライドして、お皿を移動させてください。",
            sushi_catch_rule_2: "落ちてくる寿司をお皿の範囲内でキャッチすると、スコアが加算されます。",
            sushi_catch_rule_3: "寿司を逃さないように注意して、コンボを狙いましょう！",
            sushi_catch_tips: "寿司が落ちる速度は徐々に速くなっていきます。常に画面中央付近にお皿を置いておくことで、左右どちらに寿司が落ちてきても素早く対応できるようになります。焦らず正確に移動させることがハイスコアへの近道です。",
            sushi_match_desc_long: "「寿司マッチ」は、バラバラに並べられたお寿司の中から、同じネタのペアを見つけ出す記憶力パズルゲームです。全てのペアを揃えるまでの時間を競います。美味しそうなお寿司を眺めながら、楽しく脳を活性化させましょう。お子様から大人まで、どなたでも手軽に楽しめます。",
            sushi_match_rule_1: "伏せられたカードをめくって、同じお寿司のペアを探してください。",
            sushi_match_rule_2: "一度にめくれるのは2枚までです。ネタが一致すればカードは消えます。",
            sushi_match_rule_3: "全てのカードを消すまでのクリアタイムが記録されます。最速を目指しましょう！",
            sushi_match_tips: "焦ってめくるよりも、一度めくったカードの場所をしっかりと覚えることがクリアへの近道です。また、似たような色のネタ（マグロとトロなど）に注意して、正確にペアを揃えていきましょう。繰り返しプレイすることで、記憶力とスピードが向上します。"
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
            id: 'sushi-tap',
            url: 'games/sushi-tap/index.html',
            titleKey: 'game_sushi_tap_title',
            tagKey: 'game_tag_action',
            thumbnail: 'games/sushi-tap/thumbnail.svg'
        },
        {
            id: 'sushi-catch',
            url: 'games/sushi-catch/index.html',
            titleKey: 'game_sushi_catch_title',
            tagKey: 'game_tag_catch',
            thumbnail: 'games/sushi-catch/thumbnail.svg'
        },
        {
            id: 'sushi-match',
            url: 'games/sushi-match/index.html',
            titleKey: 'game_sushi_match_title',
            tagKey: 'game_tag_puzzle',
            thumbnail: 'games/sushi-match/thumbnail.svg'
        }
    ];

    function renderGames() {
        if (!gameList) return;
        gameList.innerHTML = '';
        
        games.forEach(game => {
            const gameCard = document.createElement('a');
            gameCard.href = game.url;
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

    // --- Random Ads Logic ---
    const ads = [
        {
            id: 'sushi-hanaoka',
            html: `<table cellpadding="0" cellspacing="0" border="0" style=" border:1px solid #ccc; width:300px; margin: 0 auto; background: #fff; text-align: left;"><tbody><tr style="border-style:none;"><td style="vertical-align:top; border-style:none; padding:10px; width:44px;"><a href="https://rpx.a8.net/svt/ejp?a8mat=4AZJGD+2KVN5E+2HOM+BWGDT&rakuten=y&a8ejpredirect=https%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2Fg00tpx84.2bo11f61.g00tpx84.2bo125bc%2Fa26031991007_4AZJGD_2KVN5E_2HOM_BWGDT%3Fpc%3Dhttps%253A%252F%252Fitem.rakuten.co.jp%252Ff131130-shibuya%252F088003%252F%26amp%3Bm%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252Ff131130-shibuya%252Fi%252F10000667%252F%26amp%3Brafcid%3Dwsc_i_is_33f72da33714639c415e592c9633ecd7" rel="nofollow"><img border="0" alt="" src="https://thumbnail.image.rakuten.co.jp/@0_mall/f131130-shibuya/cabinet/09222044/088003_01.jpg?_ex=64x64" /></a></td><td style="font-size:12px; vertical-align:middle; border-style:none; padding:10px;"><p style="padding:0; margin:0;"><a href="https://rpx.a8.net/svt/ejp?a8mat=4AZJGD+2KVN5E+2HOM+BWGDT&rakuten=y&a8ejpredirect=https%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2Fg00tpx84.2bo11f61.g00tpx84.2bo125bc%2Fa26031991007_4AZJGD_2KVN5E_2HOM_BWGDT%3Fpc%3Dhttps%253A%252F%252Fitem.rakuten.co.jp%252Ff131130-shibuya%252F088003%252F%26amp%3Bm%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252Ff131130-shibuya%252Fi%252F10000667%252F%26amp%3Brafcid%3Dwsc_i_is_33f72da33714639c415e592c9633ecd7" rel="nofollow">【ふるさと納税】[鮨花おか]特選コース お食事券 利用券 食事券 招待券 優待券 飲食券 チケット お食事券 ギフト プレゼント デート 観光 ビジネス 出張 ディナー 記念日 鮮魚 新鮮 海鮮 和食 寿司 東京都 渋谷区 都内</a></p><p style="color:#666; margin-top:5px; line-height:1.5;">価格:<span style="font-size:14px; color:#C00; font-weight:bold;">55000円</span></p></td></tr></tbody></table><img border="0" width="1" height="1" src="https://www12.a8.net/0.gif?a8mat=4AZJGD+2KVN5E+2HOM+BWGDT" alt="">`
        },
        {
            id: 'shime-sushi',
            html: `<table cellpadding="0" cellspacing="0" border="0" style=" border:1px solid #ccc; width:300px; margin: 0 auto; background: #fff; text-align: left;"><tbody><tr style="border-style:none;"><td style="vertical-align:top; border-style:none; padding:10px; width:44px;"><a href="https://rpx.a8.net/svt/ejp?a8mat=4AZJGD+2KVN5E+2HOM+BWGDT&rakuten=y&a8ejpredirect=https%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2Fg00tk1k4.2bo11401.g00tk1k4.2bo120a1%2Fa26031991007_4AZJGD_2KVN5E_2HOM_BWGDT%3Fpc%3Dhttps%253A%252F%252Fitem.rakuten.co.jp%252Ff182109-sakai%252Fa-0513%252F%26amp%3Bm%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252Ff182109-sakai%252Fi%252F10001325%252F%26amp%3Brafcid%3Dwsc_i_is_33f72da33714639c415e592c9633ecd7" rel="nofollow"><img border="0" alt="" src="https://thumbnail.image.rakuten.co.jp/@0_mall/f182109-sakai/cabinet/05/a-0531-sku-s.jpg?_ex=64x64" /></a></td><td style="font-size:12px; vertical-align:middle; border-style:none; padding:10px;"><p style="padding:0; margin:0;"><a href="https://rpx.a8.net/svt/ejp?a8mat=4AZJGD+2KVN5E+2HOM+BWGDT&rakuten=y&a8ejpredirect=https%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2Fg00tk1k4.2bo11401.g00tk1k4.2bo120a1%2Fa26031991007_4AZJGD_2KVN5E_2HOM_BWGDT%3Fpc%3Dhttps%253A%252F%252Fitem.rakuten.co.jp%252Ff182109-sakai%252Fa-0513%252F%26amp%3Bm%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252Ff182109-sakai%252Fi%252F10001325%252F%26amp%3Brafcid%3Dwsc_i_is_33f72da33714639c415e592c9633ecd7" rel="nofollow">【ふるさと納税】肉厚鯖がたまらない！「〆鯖寿司」</a></p><p style="color:#666; margin-top:5px; line-height:1.5;">価格:<span style="font-size:14px; color:#C00; font-weight:bold;">5000円〜</span></p></td></tr></tbody></table><img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=4AZJGD+2KVN5E+2HOM+BWGDT" alt="">`
        },
        {
            id: 'aburi-salmon',
            html: `<table cellpadding="0" cellspacing="0" border="0" style=" border:1px solid #ccc; width:300px; margin: 0 auto; background: #fff; text-align: left;"><tbody><tr style="border-style:none;"><td style="vertical-align:top; border-style:none; padding:10px; width:44px;"><a href="https://rpx.a8.net/svt/ejp?a8mat=4AZJGD+2KVN5E+2HOM+BWGDT&rakuten=y&a8ejpredirect=https%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2Fg00qawm4.2bo11d1b.g00qawm4.2bo12724%2Fa26031991007_4AZJGD_2KVN5E_2HOM_BWGDT%3Fpc%3Dhttps%253A%252F%252Fitem.rakuten.co.jp%252Fichijyo%252F10002479%252F%26amp%3Bm%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252Fichijyo%252Fi%252F10002479%252F%26amp%3Brafcid%3Dwsc_i_is_33f72da33714639c415e592c9633ecd7" rel="nofollow"><img border="0" alt="" src="https://thumbnail.image.rakuten.co.jp/@0_mall/ichijyo/cabinet/salmon/aburi/20150716a_salmon1011.jpg?_ex=64x64" /></a></td><td style="font-size:12px; vertical-align:middle; border-style:none; padding:10px;"><p style="padding:0; margin:0;"><a href="https://rpx.a8.net/svt/ejp?a8mat=4AZJGD+2KVN5E+2HOM+BWGDT&rakuten=y&a8ejpredirect=https%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2Fg00qawm4.2bo11d1b.g00qawm4.2bo12724%2Fa26031991007_4AZJGD_2KVN5E_2HOM_BWGDT%3Fpc%3Dhttps%253A%252F%252Fitem.rakuten.co.jp%252Fichijyo%252F10002479%252F%26amp%3Bm%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252Fichijyo%252Fi%252F10002479%252F%26amp%3Brafcid%3Dwsc_i_is_33f72da33714639c415e592c9633ecd7" rel="nofollow">炙りサーモンハラスお刺身カット済み（20切入）</a></p><p style="color:#666; margin-top:5px; line-height:1.5;">価格:<span style="font-size:14px; color:#C00; font-weight:bold;">1180円</span></p></td></tr></tbody></table><img border="0" width="1" height="1" src="https://www12.a8.net/0.gif?a8mat=4AZJGD+2KVN5E+2HOM+BWGDT" alt="">`
        }
    ];

    function displayRandomAd() {
        const adPlaceholders = document.querySelectorAll('.affiliate-banner-wrapper');
        if (adPlaceholders.length === 0) return;

        adPlaceholders.forEach(placeholder => {
            const randomAd = ads[Math.floor(Math.random() * ads.length)];
            placeholder.innerHTML = randomAd.html;
        });
    }

    // Run random ad display
    displayRandomAd();
});
