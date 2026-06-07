from supabase import create_client, Client
from app.config import settings


def get_supabase() -> Client:
    """Cliente com service_role — usar APENAS no backend, nunca expor."""
    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_ROLE_KEY
    )


# Singleton simples
_supabase: Client | None = None


def supabase() -> Client:
    global _supabase
    if _supabase is None:
        _supabase = get_supabase()
    return _supabase
