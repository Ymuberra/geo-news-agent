from flask import Flask, request, jsonify
import requests
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer

app = Flask(__name__)

NEWS_API_KEY = "YOUR_NEWS_API_KEY"  # Buraya kendi newsapi.org API key'ini koymalısın

def get_news(city):
    url = (
        f"https://newsapi.org/v2/everything?q={city}&sortBy=publishedAt&pageSize=3&apiKey={NEWS_API_KEY}"
    )
    response = requests.get(url)
    articles = response.json().get("articles", [])
    return articles

def summarize(text, sentences_count=2):
    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = LsaSummarizer()
    summary = summarizer(parser.document, sentences_count)
    return " ".join(str(sentence) for sentence in summary)

@app.route("/dispatch", methods=["POST"])
def dispatch():
    city = request.json.get("message", "")
    news = get_news(city)

    result = []
    for item in news:
        title = item.get("title", "")
        content = item.get("content", "") or item.get("description", "")
        summary = summarize(content) if content else "Özet yok."
        result.append({
            "title": title,
            "summary": summary
        })

    return jsonify({"city": city, "articles": result})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)