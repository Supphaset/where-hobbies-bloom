from tests.utils import SyncClient
from app.main import app

client = SyncClient(app)


def test_dashboard_extra_fields():
    user = client.post('/users/', json={'name': 'Dash', 'target_ielts': 6, 'target_hsk': 160}).json()
    user_id = user['id']
    exam = client.get('/exams/IELTS/Reading').json()
    answers = [{'question_id': q['id'], 'response': q['answer_key']} for q in exam['questions']]
    client.post('/exams/IELTS/Reading/submit', json={'user_id': user_id, 'answers': answers})
    dash = client.get(f'/dashboard/{user_id}').json()
    assert 'recommended_tasks' in dash
    assert 'latest_scores' in dash and len(dash['latest_scores']) >= 1
    assert 'study_time' in dash
