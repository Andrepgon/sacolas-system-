from typing import Any
from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.routers import contacts as contacts_router


def _result(data: Any) -> MagicMock:
    r = MagicMock()
    r.data = data
    return r


def _fake_supabase(select_result: Any, insert_result: Any | None = None) -> MagicMock:
    """
    Constrói um cliente Supabase fake que aceita a cadeia usada em create_contact:
        sb.table("contacts").select("id").eq("phone", X).execute()
        sb.table("contacts").insert(data).execute()
    """
    client = MagicMock()
    table = client.table.return_value

    select_chain = table.select.return_value
    select_chain.eq.return_value.execute.return_value = _result(select_result)

    table.insert.return_value.execute.return_value = _result(insert_result or [])

    return client


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


class TestCreateContactDuplicatePhone:
    def test_returns_409_when_phone_already_exists(self, client, monkeypatch):
        existing = [{"id": "11111111-1111-1111-1111-111111111111"}]
        fake = _fake_supabase(select_result=existing)
        monkeypatch.setattr(contacts_router, "supabase", lambda: fake)

        resp = client.post(
            "/api/v1/contacts/",
            json={"phone": "+5511987654321", "name": "Cliente Existente"},
        )

        assert resp.status_code == 409
        assert "+5511987654321" in resp.json()["detail"]
        fake.table.assert_any_call("contacts")
        fake.table.return_value.insert.assert_not_called()

    def test_returns_201_when_phone_is_new(self, client, monkeypatch):
        created = {
            "id": "22222222-2222-2222-2222-222222222222",
            "phone": "+5511987654321",
            "name": "Cliente Novo",
            "business_name": None,
            "segment": None,
            "source": "manual",
            "status": "lead",
            "tags": [],
            "has_vector_logo": False,
            "notes": None,
            "first_order_at": None,
            "last_order_at": None,
            "last_contact_at": None,
            "total_orders": 0,
            "lifetime_value": 0,
            "created_at": "2026-06-01T12:00:00+00:00",
            "updated_at": "2026-06-01T12:00:00+00:00",
        }
        fake = _fake_supabase(select_result=[], insert_result=[created])
        monkeypatch.setattr(contacts_router, "supabase", lambda: fake)

        resp = client.post(
            "/api/v1/contacts/",
            json={"phone": "11987654321", "name": "Cliente Novo"},
        )

        assert resp.status_code == 201
        body = resp.json()
        assert body["phone"] == "+5511987654321"
        assert body["status"] == "lead"
        fake.table.return_value.insert.assert_called_once()
