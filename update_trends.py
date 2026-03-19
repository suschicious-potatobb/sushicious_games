import os
import datetime
import re

# トレンド情報を取得する関数（本来はAPIやスクレイピングを使用しますが、
# GitHub Actions環境で安定して動作させるため、プレースホルダとして実装します。
# ユーザーがAPIキーなどを持っている場合は、ここをGoogle Search APIなどに差し替え可能です。）

def get_latest_trends():
    today = datetime.date.today().strftime("%Y年%m月%d日")
    
    # ここでは例として固定のトレンド情報を生成しますが、
    # 実際にはニュースAPIなどから取得するロジックをここに記述できます。
    trends = {
        "date": today,
        "summary": f"{today}のAIとゲーム業界では、次世代技術の実装と市場の再編が加速しています。",
        "ai": [
            {
                "title": "自律型エージェントの普及",
                "desc": "特定のタスクを自律的に完遂するAIエージェントが、多くのビジネスツールに標準搭載され始めています。",
                "url": "https://example.com/ai-agent-trend"
            },
            {
                "title": "エッジAIの進化",
                "desc": "デバイス上での高速な推論を可能にする小型LLMの需要が高まっています。",
                "url": "https://example.com/edge-ai-news"
            }
        ],
        "game": [
            {
                "title": "次世代ハードウェアの期待",
                "desc": "各社が次世代機向けの独占タイトルの開発を強化しており、ハードウェアのスペックを最大限に引き出す試みが続いています。",
                "url": "https://example.com/next-gen-console"
            },
            {
                "title": "インディーゲームの市場拡大",
                "desc": "独創的なアイデアを持つインディー開発者の作品が、主要プラットフォームで上位を占める傾向が続いています。",
                "url": "https://example.com/indie-game-boom"
            }
        ]
    }
    return trends

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
