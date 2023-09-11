from typing import Callable
from fastapi import Depends, FastAPI
from dotenv import load_dotenv
from routes import router as routers
from user import authenticate_user, IDToken
from db.prisma import prisma

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
    await prisma.connect()


@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()

@app.get("/protected")
def protected(id_token: IDToken = Depends(authenticate_user)):
    return {"Hello": "World", "user_email": id_token.email}
