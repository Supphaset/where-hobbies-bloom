from tests.utils import SyncClient
from app.main import app

client = SyncClient(app)


def test_get_speaking_prompt():
    resp = client.get('/exams/IELTS/Speaking')
    assert resp.status_code == 200
    assert 'prompt' in resp.json()


def test_submit_speaking_returns_band():
    user = client.post('/users/', json={'name': 'Speaker', 'target_ielts': 7, 'target_hsk': 180}).json()
    text = 'Hello this is a sample speaking answer. ' * 10
    resp = client.post('/exams/IELTS/Speaking/submit', json={'user_id': user['id'], 'text': text})
    data = resp.json()
    assert resp.status_code == 200
    assert 'score' in data
    assert 'feedback' in data
    assert data['score'] > 0
