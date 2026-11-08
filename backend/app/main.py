from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health, links
from app.core.config import settings
from app.db.database import init_db


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="Duo Link API",
    description="Smart link-routing platform API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(links.router, prefix="/api/v1")


@app.get("/")
def home() -> dict[str, str]:
    return {"message": "Welcome to Duo Link API", "status": "running"}
