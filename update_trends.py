import os
import datetime
import json
import re
import tweepy
from google import genai

# Google Gemini APIを使用してトレンド情報を生成する
def get_latest_trends():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY is not set.")
        return get_mock_trends()

    client = genai.Client(api_key=api_key)
    today = datetime.date.today().strftime("%Y年%m月%d日")

    prompt = f"""
あなたは「Sushicious Games」の専属トレンドリサーチャーです。
「ゲーム業界」と「AI業界」の最新トレンド（本日{today}時点）を調査し、以下のJSON形式で出力してください。

# Rules
- 言語は日本語。
- summaryは今日のトレンド全体を1文で。
- titleは15文字以内、descは60文字以内。
- 実在するニュースのURLを含めること。
- 出力は純粋なJSONのみ。マークダウンのバッククォートなどは含めないでください。

# Output Format (JSON)
{{
  "date": "{today}",
  "summary": "...",
  "ai": [{{ "title": "...", "desc": "...", "url": "..." }}],
  "game": [{{ "title": "...", "desc": "...", "url": "..." }}]
}}
"""

    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt,
            config={'response_mime_type': 'application/json'}
        )
        
        # Gemini 2.0 SDK (google-genai) returns parsed JSON if mime type is set
        # or we can use response.text
        trends_json = response.text
        return json.loads(trends_json)
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return get_mock_trends()

def get_mock_trends():
    today = datetime.date.today().strftime("%Y年%m月%d日")
    return {
        "date": today,
        "summary": "APIエラーが発生したため、サンプルデータを表示しています。",
        "ai": [{"title": "AIトレンド調査中", "desc": "最新のAI情報を収集しています。", "url": "#"}],
        "game": [{"title": "ゲームトレンド調査中", "desc": "最新のゲーム情報を収集しています。", "url": "#"}]
    }

# X (Twitter) への投稿
def post_to_x(trends):
    consumer_key = os.environ.get("X_CONSUMER_KEY")
    consumer_secret = os.environ.get("X_CONSUMER_SECRET")
    access_token = os.environ.get("X_ACCESS_TOKEN")
    access_token_secret = os.environ.get("X_ACCESS_TOKEN_SECRET")

    if not all([consumer_key, consumer_secret, access_token, access_token_secret]):
        print("Error: X API credentials are not set. Skipping X post.")
        return

    try:
        # Tweepy v4+ API v2 client initialization
        client = tweepy.Client(
            consumer_key=consumer_key, consumer_secret=consumer_secret,
            access_token=access_token, access_token_secret=access_token_secret
        )

        tweet_text = f"【{trends['date']} トレンド情報】\n\n{trends['summary']}\n\n最新のゲーム・AIトレンドはこちら🍣\nhttps://sushicious-games.web.app/trends.html\n\n#SushiciousGames #AI #Gaming"
        
        response = client.create_tweet(text=tweet_text)
        print(f"Successfully posted to X: {response.data['id']}")
    except Exception as e:
        print(f"Error posting to X: {e}")

def update_html(trends):
    # Update trends.html
    trends_file = "trends.html"
    if os.path.exists(trends_file):
        with open(trends_file, "r", encoding="utf-8") as f:
            content = f.read()

        new_article_html = f"""
            <article class="trend-article">
                <h2>{trends['date']}のトレンド</h2>
                <p class="summary">{trends['summary']}</p>
                
                <section class="trend-category">
                    <h3>AI トレンド</h3>
                    <ul>
"""
        for item in trends['ai']:
            new_article_html += f"""                        <li>
                            <h4>{item['title']}</h4>
                            <p>{item['desc']}<br><a href="{item['url']}" target="_blank">参照元</a></p>
                        </li>
"""
        new_article_html += """                    </ul>
                </section>

                <section class="trend-category">
                    <h3>ゲーム トレンド</h3>
                    <ul>
"""
        for item in trends['game']:
            new_article_html += f"""                        <li>
                            <h4>{item['title']}</h4>
                            <p>{item['desc']}<br><a href="{item['url']}" target="_blank">参照元</a></p>
                        </li>
"""
        new_article_html += """                    </ul>
                </section>
            </article>
"""
        container_tag = '<div id="trends-container">'
        if container_tag in content:
            updated_content = content.replace(container_tag, container_tag + new_article_html)
            archive_tag = '<!-- 過去記事へのリンクが追加されていきます -->'
            new_archive_item = f'<li><a href="#">{trends["date"]}</a></li>\n                    '
            updated_content = updated_content.replace(archive_tag, new_archive_item + archive_tag)
            with open(trends_file, "w", encoding="utf-8") as f:
                f.write(updated_content)
            print(f"Successfully updated {trends_file}")

    # Update index.html summary
    index_file = "index.html"
    if os.path.exists(index_file):
        with open(index_file, "r", encoding="utf-8") as f:
            index_content = f.read()
        
        # Use regex to replace the summary inside trends-summary-container
        pattern = r'(<div id="trends-summary-container">)\s*<p class="trends-summary">.*?</p>'
        replacement = f'\\1\n                <p class="trends-summary">{trends["summary"]}</p>'
        new_index_content = re.sub(pattern, replacement, index_content, flags=re.DOTALL)
        
        with open(index_file, "w", encoding="utf-8") as f:
            f.write(new_index_content)
        print(f"Successfully updated {index_file} summary")

if __name__ == "__main__":
    latest_trends = get_latest_trends()
    update_html(latest_trends)
    # X APIの有料化に伴い、一時的に投稿機能を無効化
    # post_to_x(latest_trends)
