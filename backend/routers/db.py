from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from db.database import get_db


router = APIRouter()


class GetOrCreateUser(BaseModel):
    foreign_id: str


class GetOrCreateUserOutput(BaseModel):
    id: int


@router.post("/get_or_create_user", response_model=GetOrCreateUserOutput)
async def get_or_create_user(input: GetOrCreateUser, db: Session = Depends(get_db)):
    result = await get_or_create_user(db, input.foreign_id)

    return GetOrCreateUserOutput(id=result.id)
