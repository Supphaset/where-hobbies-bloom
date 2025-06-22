# SoloLingua Coach Backend

This repository contains a small [FastAPI](https://fastapi.tiangolo.com/) application that powers the SoloLingua Coach web service.

## Local development

1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
2. **Run the server**
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000). The `/ping` endpoint returns a simple health check.

  The root URL serves a React single-page application with pages for a
  dashboard, exams, and practice drills. Static assets live under `/static`
  and require the server to be running.

   Additional endpoints:
   - `POST /users/` – create a user.
   - `GET /users/` – list all users.
   - `GET /users/{user_id}` – retrieve a user by ID.
   - `GET /exams/IELTS/{section}` – fetch a sample IELTS section (`Reading` or `Listening`).
   - `POST /exams/IELTS/{section}/submit` – submit answers for that section.
   - `GET /dashboard/{user_id}` – show skill profile and exam-ready status.

3. **Run tests** *(optional)*
   ```bash
   pytest -q
   ```

The SQLite database is created automatically in the project directory when the server starts.
