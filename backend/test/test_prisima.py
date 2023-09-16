import uuid
import pytest
from db.prisma import prisma


@pytest.mark.asyncio
async def test_prisima():
    id = str(uuid.uuid4())
    await prisma.connect()

    result = await prisma.user.create(data={'foreignId': id, 'foreignType': 'google'})
    print(result)

    result = prisma.user.find_first(where={'foreignId': id})
    print(result)
