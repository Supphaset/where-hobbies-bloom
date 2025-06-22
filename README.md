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
  dashboard, exams, and practice drills. All React dependencies are bundled
  locally in `frontend/out`, so the app works without internet access. Static
  assets live under `/static` and require the server to be running.

   Additional endpoints:
   - `POST /users/` – create a user.
   - `GET /users/` – list all users.
   - `GET /users/{user_id}` – retrieve a user by ID.
   - `GET /exams/IELTS/{section}` – fetch a sample IELTS section (`Reading` or `Listening`).
   - `POST /exams/IELTS/{section}/submit` – submit answers for that section.
   - `GET /dashboard/{user_id}` – show skill profile and exam-ready status.

The dashboard also surfaces recommended tasks using an adaptive engine.
Each skill profile entry is compared against your targets (IELTS or HSK).
The gap `target - mastery_pct` determines priority so the weakest skills
appear first.

3. **Run tests** *(optional)*
   Ensure dependencies are installed first since the tests use `httpx` for the
   synchronous client.
   ```bash
   pip install -r requirements.txt
   pytest -q
   ```

The SQLite database is created automatically in the project directory when the server starts.

### Building the frontend

If you modify anything under `frontend/src`, compile the JSX files to the
`frontend/out` directory so FastAPI can serve them. Install Babel once:

```bash
npm install --save-dev @babel/cli @babel/core @babel/preset-react
```
These commands require Node.js and npm.

Then run:

```bash
npx babel frontend/src --out-dir frontend/out/src --presets @babel/preset-react
cp frontend/index.html frontend/out/
cp frontend/style.css frontend/out/
```

The contents of `frontend/out` are served at `/static` when the server is running.

### Environment variables

Copy `.env.example` to `.env` and set the values.

- `OPENAI_API_KEY` – **required** for GPT grading. Without it the app falls back to simple heuristics.
- `OPENAI_MODEL` – optional model name passed to the OpenAI API (defaults to `gpt-4o`).
- `SQLALCHEMY_DATABASE_URL` – optional database URL (defaults to `sqlite:///./sololingua.db`).
