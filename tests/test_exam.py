from tests.utils import SyncClient
from app.main import app

client = SyncClient(app)


def test_get_exam():
    resp = client.get('/exams/IELTS')
    assert resp.status_code == 200
    data = resp.json()
    assert data['exam_type'] == 'IELTS'
    assert len(data['questions']) >= 1


def test_submit_exam_and_dashboard_ready():
    exam = client.get('/exams/IELTS').json()
    answers = [{'question_id': q['id'], 'response': q['answer_key']} for q in exam['questions']]
    client.post('/users/', json={'name': 'Test', 'target_ielts': 7, 'target_hsk': 180})
    # submit two perfect attempts
    for _ in range(2):
        resp = client.post('/exams/IELTS/submit', json={'user_id': 1, 'answers': answers})
        assert resp.status_code == 200
    dash = client.get('/dashboard/1').json()
    assert dash['exam_ready']['ielts'] is True
