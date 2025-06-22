from tests.utils import SyncClient

from app.main import app

client = SyncClient(app)

def test_create_user():
    response = client.post("/users/", json={"name": "Alice", "target_ielts": 7, "target_hsk": 180})
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Alice"
    assert data["target_ielts"] == 7
    assert data["target_hsk"] == 180
    assert "id" in data


def test_get_user():
    response = client.post(
        "/users/",
        json={"name": "Bob", "target_ielts": 6, "target_hsk": 170},
    )
    user = response.json()
    user_id = user["id"]

    resp = client.get(f"/users/{user_id}")
    assert resp.status_code == 200
    assert resp.json() == user


def test_list_users():
    client.post(
        "/users/",
        json={"name": "Eve", "target_ielts": 6, "target_hsk": 160},
    )
    resp = client.get("/users/")
    assert resp.status_code == 200
    users = resp.json()
    assert isinstance(users, list)
    assert len(users) >= 1
