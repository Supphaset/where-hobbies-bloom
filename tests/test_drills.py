from tests.utils import SyncClient
from app.main import app

client = SyncClient(app)


def test_vocab_drill_cycle():
    user_id = client.post('/users/', json={'name': 'Voc', 'target_ielts': 6, 'target_hsk': 160}).json()['id']
    item = client.get(f'/drills/vocab/{user_id}').json()
    assert 'word' in item
    client.post(f'/drills/vocab/{user_id}/{item["id"]}', json={'correct': True})
    next_item = client.get(f'/drills/vocab/{user_id}').json()
    assert next_item['id'] == item['id']


def test_quick_write():
    user = client.post('/users/', json={'name': 'Writer2', 'target_ielts': 6, 'target_hsk': 160}).json()
    prompt = client.get('/drills/quick-write').json()
    assert 'prompt' in prompt
    resp = client.post('/drills/quick-write/submit', json={'user_id': user['id'], 'text': 'Hello world'}).json()
    assert 'score' in resp and 'feedback' in resp
