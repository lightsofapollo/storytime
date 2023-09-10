

from fastapi.testclient import TestClient


def test_character_sheet(client: TestClient):
    result = client.post("/ai/character_sheet")
    assert result.status_code == 200
