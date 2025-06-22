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


def test_speaking_feedback():
    user = client.post('/users/', json={'name': 'Speaker', 'target_ielts': 6, 'target_hsk': 160}).json()
    audio = b''  # empty audio just to trigger fallback
    files = {'file': ('speech.wav', audio, 'audio/wav')}
    resp = client.post(f'/feedback/speaking?user_id={user["id"]}', files=files)
    data = resp.json()
    assert resp.status_code == 200
    assert 'fluency_band' in data


def test_grammar_quiz():
    user = client.post('/users/', json={'name': 'Grammar', 'target_ielts': 6, 'target_hsk': 160}).json()
    q = client.get(f'/drills/grammar/{user["id"]}').json()
    assert 'prompt' in q and 'answer_key' in q
    resp = client.post(f'/drills/grammar/{user["id"]}/{q["id"]}', json={'answer': q['answer_key']})
    assert resp.status_code == 200
    assert resp.json()['correct'] is True
