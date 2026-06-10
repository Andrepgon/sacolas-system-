from typing import Any, Optional


def _get(contact: Any, key: str) -> Optional[str]:
    if isinstance(contact, dict):
        return contact.get(key)
    return getattr(contact, key, None)


def render_message(template: str, contact: Any, image_url: Optional[str]) -> str:
    """Substitui placeholders pelo dado do contato. Função pura.

    Placeholders:
      {{primeiro_nome}} → primeira palavra de name
      {{nome}}          → name
      {{empresa}}       → business_name (cai pra name se vazio)
      {{imagem}}        → image_url (string vazia se None)

    Se houver image_url e {{imagem}} NÃO estiver no template, a URL é anexada
    em linha própria ao final do resultado.
    """
    name = (_get(contact, "name") or "").strip()
    business_name = (_get(contact, "business_name") or "").strip()
    primeiro_nome = name.split(" ", 1)[0] if name else ""
    empresa = business_name or name
    imagem = image_url or ""

    out = template
    out = out.replace("{{primeiro_nome}}", primeiro_nome)
    out = out.replace("{{nome}}", name)
    out = out.replace("{{empresa}}", empresa)
    out = out.replace("{{imagem}}", imagem)

    if image_url and "{{imagem}}" not in template:
        out = f"{out}\n{image_url}"

    return out
