from tests.utils import SyncClient
from app.main import app
from app.database import SessionLocal
from app import crud

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


def test_recommendation_sorting_by_gap():
    user = client.post(
        '/users/',
        json={'name': 'Gap', 'target_ielts': 7, 'target_hsk': 200},
    ).json()
    user_id = user['id']
    with SessionLocal() as db:
        crud.update_skill_profile(db, user_id, 'reading', 60)
        crud.update_skill_profile(db, user_id, 'listening', 65)
        crud.update_skill_profile(db, user_id, 'hanzi', 150)
    dash = client.get(f'/dashboard/{user_id}').json()
    tasks = dash['recommended_tasks']
    assert tasks[0] == 'Practice Hanzi'
    assert 'Listening' in tasks[-1]
