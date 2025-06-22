from tests.utils import SyncClient

from app.main import app

client = SyncClient(app)

def test_ping():
    response = client.get("/ping")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
