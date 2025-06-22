from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

def test_create_user():
    response = client.post("/users/", json={"name": "Alice", "target_ielts": 7, "target_hsk": 180})
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Alice"
    assert data["target_ielts"] == 7
    assert data["target_hsk"] == 180
    assert "id" in data
