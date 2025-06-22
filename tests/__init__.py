"""Test package configuration."""

import os

# Use an in-memory SQLite database so tests are isolated from any local files.
os.environ.setdefault("SQLALCHEMY_DATABASE_URL", "sqlite:///:memory:")

