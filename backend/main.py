from llm import ANALYSIS_LLM, create_analysis_llm, initialize_story_template
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.responses import StreamingResponse
from fastapi import Depends, FastAPI, HTTPException, Request
from sqlalchemy.orm import Session
from db.database import Base, SessionLocal, engine
from litellm import completion
from routes import router as routers

load_dotenv()

Base.metadata.create_all(bind=engine)


def get_application() -> FastAPI:
    application = FastAPI(
        title="Storytime"
    )
    application.include_router(
        routers
    )
    return application


app = get_application()


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    request.state.db = Session()
    response = await call_next(request)
    request.state.db.close()
    return response
