"""
Teste do parser de vCard. Não toca banco — só roda parse_vcard()
contra 3 cards fixos e mostra a normalização.

Execução: python scripts/_test_parser.py
"""
import json
import sys
from pathlib import Path

# Permite importar import_vcard como módulo irmão
sys.path.insert(0, str(Path(__file__).parent))

from import_vcard import parse_vcard  # noqa: E402

SAMPLE_VCF = """BEGIN:VCARD
VERSION:3.0
FN:SACOLA João Papelaria
TEL;TYPE=CELL:+5521999999999
END:VCARD
BEGIN:VCARD
VERSION:3.0
FN:SACOLA-Maria Bistrô
TEL;TYPE=CELL:11987654321
END:VCARD
BEGIN:VCARD
VERSION:3.0
FN:Carlos Lanches
TEL:(21) 98888-7777
END:VCARD
"""

def main() -> None:
    contacts = parse_vcard(SAMPLE_VCF)
    print(f"Parsed: {len(contacts)} contatos")
    print(json.dumps(contacts, indent=2, ensure_ascii=False))

    # Asserts mínimos pra evidenciar a normalização
    assert len(contacts) == 3, f"esperado 3, obtido {len(contacts)}"

    # 1) prefixo "SACOLA " removido, telefone já em E.164 preservado
    assert contacts[0]["name"] == "João Papelaria", contacts[0]
    assert contacts[0]["phone"] == "+5521999999999", contacts[0]

    # 2) prefixo "SACOLA-" removido (regex permite -/_), BR 11 digitos vira +55...
    assert contacts[1]["name"] == "Maria Bistrô", contacts[1]
    assert contacts[1]["phone"] == "+5511987654321", contacts[1]

    # 3) sem prefixo SACOLA, mantem o nome; mascara (21) 98888-7777 vira +55...
    assert contacts[2]["name"] == "Carlos Lanches", contacts[2]
    assert contacts[2]["phone"] == "+5521988887777", contacts[2]

    print("\nOK — parser normaliza nome e telefone como esperado.")

if __name__ == "__main__":
    main()
