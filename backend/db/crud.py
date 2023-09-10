from sqlalchemy.orm import Session

from . import models
from .. import schemas


def create_story_metadata(db: Session, user: schemas.StoryMetadataCreate):
    meta = models.StoryMetadata(
        name=user.name, character_sheet=user.character_sheet, summary=user.summary)

    db.add(meta)
    db.commit()
    db.refresh(meta)
    return meta
