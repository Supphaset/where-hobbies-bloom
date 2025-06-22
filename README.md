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

3. **Run tests** *(optional)*
   ```bash
   pytest -q
   ```

The SQLite database is created automatically in the project directory when the server starts.
