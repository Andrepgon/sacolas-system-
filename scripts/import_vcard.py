"""
Importa SÓ os clientes (nome contém "Sacola"/"Sacolas") de um .vcf para o Supabase.

O dono marca os clientes acrescentando "Sacolas" ao nome do contato
(ex: "Danielle Sacolas", "UP SACOLAS"). Este script filtra só esses, remove a
marca, normaliza o telefone para E.164, descarta números inválidos e infere o
segmento por palavra-chave.

Uso:
  python import_vcard.py caminho/para/contatos.vcf            # importa
  python import_vcard.py caminho/para/contatos.vcf --dry-run  # só mostra, não grava

Lê SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY do .env (os mesmos do backend/.env).
"""
import sys
import re
import os
from pathlib import Path
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# A marca de cliente: a palavra "sacola"/"sacolas" em qualquer posição do nome.
MARK = re.compile(r"\bsacolas?\b", re.IGNORECASE)

# Ordem importa: especificos (moda feminina/masculina) antes do generico (moda).
SEGMENT_KEYWORDS = {
    # Alimentacao
    "Lanchonete":             ["lanchonete", "lanch", "hamburg", "burger",
                               "hot dog", "hotdog", "cachorro quente", "pastel",
                               "salgad", "espeto"],
    "Restaurante":            ["restaurante", "comida", "marmita", "self service",
                               "self-service", "cantina", "churrasc", "sushi",
                               "japones", "japonês", "pizz", "temaki", "buffet"],
    "Cafeteria":              ["cafeteria", "coffee"],
    "Padaria":                ["padaria", "panificadora"],
    "Confeitaria":            ["confeitaria", "doceria", "doces", "bolo", "cake",
                               "brigade", "cupcake", "festa"],
    "Açaí e sorveteria":      ["acai", "açai", "açaí", "sorvete", "gelato",
                               "picole", "picolé"],
    # Moda
    "Moda feminina":          ["moda feminina", "feminin"],
    "Moda masculina":         ["moda masculina", "masculin"],
    "Moda infantil":          ["infantil", "kids", "bebe", "bebê"],
    "Moda":                   ["moda", "modas", "boutique", "roupa", "vestuario",
                               "vestuário", "fashion", "brecho", "brechó",
                               "atelie", "ateliê", "confec"],
    "Calçados":               ["calcad", "calçad", "sapato", "tenis", "tênis",
                               "chinelo"],
    "Lingerie e praia":       ["lingerie", "moda intima", "moda íntima", "praia",
                               "biquini", "biquíni", "sunga"],
    "Acessórios e bijuteria": ["acessorio", "acessório", "biju", "bijuteria",
                               "semijoia", "semijóia"],
    "Joalheria":              ["joalheria", "ourives", "relojoaria"],
    # Beleza e saude
    "Cosméticos e perfumaria":["cosmetic", "cosmétic", "perfum", "maquiagem",
                               "makeup", "make up", "beleza"],
    "Salão e estética":       ["salao", "salão", "estetica", "estética",
                               "manicure", "barbearia", "barber"],
    "Farmácia e saúde":       ["farmacia", "farmácia", "drogaria", "suplement",
                               "nutri"],
    "Ótica":                  ["otica", "ótica", "oculos", "óculos"],
    "Pet shop":               ["petshop", "pet shop", "racao", "ração",
                               "agropecu"],
    # Varejo geral
    "Papelaria e livraria":   ["papelaria", "livraria"],
    "Eletrônicos e celular":  ["eletronic", "eletrônic", "celular", "smartphone",
                               "informatica", "informática", "assistencia"],
    "Presentes e decoração":  ["presente", "gift", "decoracao", "decoração",
                               "decor", "utilidades", "variedades"],
    "Floricultura":           ["floricultura"],
}


def infer_segment(name: str) -> str | None:
    low = name.lower()
    for seg, kws in SEGMENT_KEYWORDS.items():
        if any(k in low for k in kws):
            return seg
    return None


def clean_name(name: str) -> str:
    c = MARK.sub(" ", name)
    c = re.sub(r"\s+", " ", c).strip(" -_:.")
    return c or name


def normalize_phone(raw: str) -> str | None:
    """Normaliza para E.164 (+55...). Devolve None se for invalido/curto."""
    s = raw.strip()
    has_plus = s.startswith("+")
    digits = re.sub(r"\D", "", s)
    if not digits:
        return None
    if has_plus:
        return "+" + digits if 12 <= len(digits) <= 15 else None
    if len(digits) in (10, 11):
        return "+55" + digits
    if len(digits) in (12, 13) and digits.startswith("55"):
        return "+" + digits
    return None  # emergencia, *codes, sem DDD -> descarta


def parse_vcard(content: str) -> tuple[list[dict], dict]:
    contatos = []
    stats = {"total": 0, "nao_cliente": 0, "sem_nome": 0,
             "telefone_invalido": 0, "validos": 0}
    for card in content.split("BEGIN:VCARD")[1:]:
        stats["total"] += 1
        fn = re.search(r"^FN[^:]*:(.+)$", card, re.MULTILINE)
        name = fn.group(1).strip() if fn else None
        if not name:
            stats["sem_nome"] += 1
            continue
        if not MARK.search(name):
            stats["nao_cliente"] += 1
            continue
        clean = clean_name(name)
        tel = re.search(r"^TEL[^:]*:(.+)$", card, re.MULTILINE)
        phone = normalize_phone(tel.group(1)) if tel else None
        if not phone:
            stats["telefone_invalido"] += 1
            continue
        contatos.append({
            "name": clean,
            "phone": phone,
            "segment": infer_segment(clean),
            "source": "imported",
            "status": "lead",
            "tags": ["importado_vcard"],
        })
        stats["validos"] += 1
    return contatos, stats


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    dry_run = "--dry-run" in sys.argv
    if not args:
        print("Uso: python import_vcard.py caminho/contatos.vcf [--dry-run]")
        sys.exit(1)
    vcf_path = Path(args[0])
    if not vcf_path.exists():
        print(f"Arquivo nao encontrado: {vcf_path}")
        sys.exit(1)
    if not (SUPABASE_URL and SUPABASE_SERVICE_KEY) and not dry_run:
        print("Faltam SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no .env")
        sys.exit(1)

    content = vcf_path.read_text(encoding="utf-8", errors="ignore")
    contatos, stats = parse_vcard(content)

    vistos, unicos = set(), []
    for c in contatos:
        if c["phone"] in vistos:
            continue
        vistos.add(c["phone"])
        unicos.append(c)

    print("\n=== Resumo da leitura ===")
    print(f"Cards no arquivo:         {stats['total']}")
    print(f"Pulados (nao-cliente):    {stats['nao_cliente']}")
    print(f"Pulados (sem nome):       {stats['sem_nome']}")
    print(f"Pulados (tel invalido):   {stats['telefone_invalido']}")
    print(f"Clientes validos:         {stats['validos']}")
    print(f"Duplicados no arquivo:    {len(contatos) - len(unicos)}")
    print(f"A importar (unicos):      {len(unicos)}")

    print("\n=== Amostra (12) ===")
    for c in unicos[:12]:
        print(f"  {c['name']:<30} {c['phone']:<16} seg={c['segment']}")

    if dry_run:
        print("\n[--dry-run] Nada gravado.")
        return

    if input(f"\nImportar {len(unicos)} clientes? (s/N): ").lower() != "s":
        print("Cancelado.")
        return

    sb = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    importados = pulados = erros = 0
    for c in unicos:
        try:
            if sb.table("contacts").select("id").eq("phone", c["phone"]).execute().data:
                pulados += 1
                continue
            sb.table("contacts").insert(c).execute()
            importados += 1
            if importados % 100 == 0:
                print(f"  ... {importados} importados")
        except Exception as e:
            print(f"  Erro em {c['name']}: {e}")
            erros += 1

    print(f"\nImportados: {importados}")
    print(f"Pulados (ja existiam): {pulados}")
    print(f"Erros: {erros}")


if __name__ == "__main__":
    main()
