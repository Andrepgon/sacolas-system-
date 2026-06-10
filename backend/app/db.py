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


def ensure_contact_media_bucket() -> None:
    """Garante que o bucket público 'contact-media' existe. Idempotente."""
    try:
        existing = {getattr(b, "name", None) or b["name"] for b in supabase().storage.list_buckets()}
        if "contact-media" not in existing:
            try:
                supabase().storage.create_bucket("contact-media", options={"public": True})
            except TypeError:
                # versões antigas do supabase-py expõem `public` como kwarg
                supabase().storage.create_bucket("contact-media", public=True)
    except Exception:
        # bucket já existe ou role sem permissão de listar — tudo bem, segue.
        pass


def ensure_campaigns_bucket() -> None:
    """Garante que o bucket público 'campaigns' existe. Idempotente."""
    try:
        existing = {getattr(b, "name", None) or b["name"] for b in supabase().storage.list_buckets()}
        if "campaigns" not in existing:
            try:
                supabase().storage.create_bucket("campaigns", options={"public": True})
            except TypeError:
                supabase().storage.create_bucket("campaigns", public=True)
    except Exception:
        pass
