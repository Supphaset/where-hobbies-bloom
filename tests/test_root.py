from tests.utils import SyncClient

from app.main import app

client = SyncClient(app)

def test_root_serves_frontend():
    response = client.get("/")
    assert response.status_code == 200
    assert "SoloLingua Coach" in response.text
