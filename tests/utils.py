import anyio
import httpx
from fastapi import FastAPI


class SyncClient:
    """Minimal synchronous client for FastAPI apps using httpx.ASGITransport."""

    def __init__(self, app: FastAPI):
        self.app = app
        self.transport = httpx.ASGITransport(app=app)
        self.base_url = "http://testserver"

    def request(self, method: str, url: str, **kwargs) -> httpx.Response:
        async def _call() -> httpx.Response:
            async with httpx.AsyncClient(transport=self.transport, base_url=self.base_url) as client:
                return await client.request(method, url, **kwargs)

        return anyio.run(_call)

    def get(self, url: str, **kwargs) -> httpx.Response:
        return self.request("GET", url, **kwargs)

    def post(self, url: str, **kwargs) -> httpx.Response:
        return self.request("POST", url, **kwargs)
