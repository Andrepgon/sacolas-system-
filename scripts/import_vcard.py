"""
Importa contatos de arquivo .vcf pra base do Supabase.
Uso: python scripts/import_vcard.py path/to/contatos.vcf
"""
import sys
import re
from pathlib import Path
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

PREFIX_PATTERN = re.compile(r"^SACOLA[\s\-_]*", re.IGNORECASE)

def parse_vcard(content: str) -> list[dict]:
    """Parser simples de vCard."""
    contacts = []
    cards = content.split("BEGIN:VCARD")

    for card in cards[1:]:  # primeiro item é vazio
        # Nome
        fn_match = re.search(r"FN[^:]*:(.+)", card)
        name = fn_match.group(1).strip() if fn_match else None

        # Telefone — pega o primeiro
        tel_match = re.search(r"TEL[^:]*:(.+)", card)
        phone = tel_match.group(1).strip() if tel_match else None

        if not name or not phone:
            continue

        # Limpa prefixo SACOLA
        cleaned_name = PREFIX_PATTERN.sub("", name).strip()
        if not cleaned_name:
            cleaned_name = name  # fallback

        # Normaliza telefone
        phone_digits = re.sub(r"[^\d+]", "", phone)
        if not phone_digits.startswith("+"):
            if len(phone_digits) in (10, 11):
                phone_digits = "+55" + phone_digits
            else:
                phone_digits = "+" + phone_digits

        contacts.append({
            "name": cleaned_name,
            "phone": phone_digits,
            "source": "imported",
            "status": "lead",  # importa todos como lead; promove a customer quando registrar pedido
            "tags": ["importado_vcard"],
        })

    return contacts

def main():
    if len(sys.argv) < 2:
        print("Uso: python import_vcard.py path/to/contatos.vcf")
        sys.exit(1)

    vcf_path = Path(sys.argv[1])
    if not vcf_path.exists():
        print(f"Arquivo não encontrado: {vcf_path}")
        sys.exit(1)

    content = vcf_path.read_text(encoding="utf-8")
    contacts = parse_vcard(content)

    # Filtra: apenas os que têm prefixo SACOLA (se quiser limitar)
    only_sacola = [c for c in contacts if "importado_vcard" in c["tags"]]

    print(f"Encontrados {len(contacts)} contatos. Vai importar {len(only_sacola)}.")
    confirm = input("Continuar? (s/N): ")
    if confirm.lower() != "s":
        print("Cancelado.")
        return

    sb = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    # Importa em batch, tratando duplicatas
    imported = 0
    skipped = 0
    errors = 0

    for c in only_sacola:
        try:
            # Verifica se já existe
            existing = sb.table("contacts").select("id").eq("phone", c["phone"]).execute()
            if existing.data:
                skipped += 1
                continue

            sb.table("contacts").insert(c).execute()
            imported += 1
        except Exception as e:
            print(f"Erro em {c['name']}: {e}")
            errors += 1

    print(f"\n✅ Importados: {imported}")
    print(f"⏭️  Pulados (já existiam): {skipped}")
    print(f"❌ Erros: {errors}")

if __name__ == "__main__":
    main()
