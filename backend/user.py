import os
from typing import Callable
from fastapi_oidc import IDToken
from fastapi_oidc import get_auth

OIDC_config = {
    "client_id": os.environ.get("AUTH0_CLIENT_ID"),
    "base_authorization_server_uri": os.environ.get("AUTH0_BASE_AUTHORIZATION_SERVER_URL"),
    "issuer": os.environ.get("AUTH0_ISSUER_BASE_URL"),
    "signature_cache_ttl": 3600,
}

authenticate_user: Callable = get_auth(**OIDC_config)
