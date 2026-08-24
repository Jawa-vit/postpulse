from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_sample_posts_endpoint():
    response = client.get("/api/sample-posts")
    assert response.status_code == 200
    posts = response.json()
    assert len(posts) >= 3
    assert "id" in posts[0]
    assert "text" in posts[0]

def test_analyze_endpoint():
    sample_text = (
        "Today I would like to share my experience building a software platform. "
        "Here is what worked and what failed. 1. Clean code 2. Testing. Check out the link below!"
    )
    response = client.post("/api/analyze", json={"text": sample_text})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "dna" in data
    assert "scroll_risk" in data
    assert "scorecard" in data
    assert "platforms" in data
    assert "rewrites" in data

def test_rewrite_endpoint():
    response = client.post("/api/rewrite", json={"text": "I made a new open source library today.", "strategy": "viral"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["strategy"] == "viral"
    assert "result" in data
    assert "improvements" in data["result"]

def test_extract_raw_text():
    response = client.post("/api/extract", data={"raw_text": "Sample social media post content for testing extraction."})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["file_type"] == "raw_text"
    assert data["word_count"] > 0
