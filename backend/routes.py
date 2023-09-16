from fastapi import APIRouter

from routers import ai

router = APIRouter()
router.include_router(ai.router, tags=["ai"], prefix="/ai")
