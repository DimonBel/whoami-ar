from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers import token, users, rooms

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="WHO AM I AR - API",
    description="CRUD API for the WHO AM I Augmented Reality game.\n\n"
    "## Roles\n"
    "- **ADMIN**: Can create/manage rooms and users\n"
    "- **PLAYER**: Can browse and join rooms\n\n"
    "## Authentication\n"
    "Use the Authorize button to get a token via `/api/token`, "
    "then all protected endpoints will work.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(token.router)
app.include_router(users.router)
app.include_router(rooms.router)


@app.get("/", tags=["Root"])
def root():
    return {"message": "WHO AM I AR API is running", "docs": "/docs"}
