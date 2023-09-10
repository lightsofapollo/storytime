
from typing import Any, Generator
from dotenv import load_dotenv
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from main import get_application


def pytest_sessionstart(session):
    """
    Called after the Session object has been created and
    before performing collection and entering the run test loop.
    """
    load_dotenv(dotenv_path=".env.test")


def pytest_addoption(parser):
    parser.addoption(
        "--runslow", action="store_true", default=False, help="run slow tests"
    )


def pytest_configure(config):
    config.addinivalue_line("markers", "slow: mark test as slow to run")


def pytest_collection_modifyitems(config, items):
    if config.getoption("--runslow"):
        # --runslow given in cli: do not skip slow tests
        return
    skip_slow = pytest.mark.skip(reason="need --runslow option to run")
    for item in items:
        if "slow" in item.keywords:
            item.add_marker(skip_slow)


@pytest.fixture(autouse=True)
def app() -> Generator[FastAPI, Any, None]:
    _app = get_application()
    yield _app


@pytest.fixture()
def client(app: FastAPI) -> Generator[TestClient, Any, None]:
    with TestClient(app) as client:
        yield client
