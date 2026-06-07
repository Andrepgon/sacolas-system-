from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import contacts, orders, views

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(contacts.router, prefix="/api/v1")
app.include_router(orders.router, prefix="/api/v1")
app.include_router(views.router, prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "ok"}
