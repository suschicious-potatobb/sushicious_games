import os
import datetime
import json
from openai import OpenAI

# OpenAI APIを使用してトレンド情報を生成する
def get_latest_trends():
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY is not set.")
        # fallback to mock data if API key is missing
        return get_mock_trends()

    client = OpenAI(api_key=api_key)
    today = datetime.date.today().strftime("%Y年%m月%d日")

    prompt = f"""
あなたは「Sushicious Games」の専属トレンドリサーチャーです。
「ゲーム業界」と「AI業界」の最新トレンド（本日2026年3月19日時点）を調査し、以下のJSON形式で出力してください。

# Rules
- 言語は日本語。
- summaryは今日のトレンド全体を1文で。
- titleは15文字以内、descは60文字以内。
- 実在するニュースのURLを含めること。
- 出力は純粋なJSONのみ。

# Output Format (JSON)
{{
  "date": "{today}",
  "summary": "...",
  "ai": [{{ "title": "...", "desc": "...", "url": "..." }}, ...],
  "game": [{{ "title": "...", "desc": "...", "url": "..." }}, ...]
}}
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={ "type": "json_object" }
        )
        trends_json = response.choices[0].message.content
        return json.loads(trends_json)
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return get_mock_trends()

def get_mock_trends():
    today = datetime.date.today().strftime("%Y年%m月%d日")
    return {
        "date": today,
        "summary": "APIエラーが発生したため、サンプルデータを表示しています。",
        "ai": [{"title": "AIトレンド調査中", "desc": "最新のAI情報を収集しています。", "url": "#"}],
        "game": [{"title": "ゲームトレンド調査中", "desc": "最新のゲーム情報を収集しています。", "url": "#"}]
    }

def update_html(trends):
    file_path = "trends.html"
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 新しい記事のHTMLを生成
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

    # trends-containerの直後に新しい記事を挿入
    container_tag = '<div id="trends-container">'
    if container_tag in content:
        updated_content = content.replace(container_tag, container_tag + new_article_html)
        
        # アーカイブの更新（簡易版：最新の日付を追加）
        archive_tag = '<!-- 過去記事へのリンクが追加されていきます -->'
        new_archive_item = f'<li><a href="#">{trends["date"]}</a></li>\n                    '
        updated_content = updated_content.replace(archive_tag, new_archive_item + archive_tag)

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(updated_content)
        print(f"Successfully updated {file_path} with trends for {trends['date']}")
    else:
        print("Error: Could not find trends-container in HTML.")

if __name__ == "__main__":
    latest_trends = get_latest_trends()
    update_html(latest_trends)
