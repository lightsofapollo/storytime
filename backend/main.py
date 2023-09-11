from fastapi import FastAPI
from dotenv import load_dotenv
from routes import router as routers
import db

load_dotenv()


def get_application() -> FastAPI:
    application = FastAPI(
        title="Storytime"
    )
    application.include_router(
        routers
    )
    return application


app = get_application()


@app.on_event("startup")
async def startup():
    await db.prisma.connect()


@app.on_event("shutdown")
async def shutdown():
    await db.prisma.disconnect()
