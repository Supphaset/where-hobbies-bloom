from tests.utils import SyncClient
from app.main import app

client = SyncClient(app)


def test_get_writing_prompt():
    resp = client.get("/exams/IELTS/Writing")
    assert resp.status_code == 200
    assert "prompt" in resp.json()


def test_submit_writing_returns_band():
    user = client.post(
        "/users/", json={"name": "Writer", "target_ielts": 7, "target_hsk": 180}
    ).json()
    essay = "This is a short essay about my trip. " * 20
    resp = client.post(
        "/exams/IELTS/Writing/submit", json={"user_id": user["id"], "text": essay}
    )
    data = resp.json()
    assert resp.status_code == 200
    assert "score" in data
    assert "feedback" in data
    assert data["score"] > 0
