import pytest
from pydantic import ValidationError

from app.models.contact import ContactCreate


def _payload(phone: str) -> dict:
    return {"phone": phone, "name": "Fulano"}


class TestPhoneValidator:
    def test_br_11_digits_without_code_gets_plus_55_prefix(self):
        c = ContactCreate(**_payload("11987654321"))
        assert c.phone == "+5511987654321"

    def test_br_10_digits_without_code_gets_plus_55_prefix(self):
        c = ContactCreate(**_payload("1133334444"))
        assert c.phone == "+551133334444"

    def test_br_with_mask_is_cleaned_and_prefixed(self):
        c = ContactCreate(**_payload("(11) 98765-4321"))
        assert c.phone == "+5511987654321"

    def test_already_e164_is_preserved(self):
        c = ContactCreate(**_payload("+5511987654321"))
        assert c.phone == "+5511987654321"

    @pytest.mark.parametrize(
        "bad",
        [
            "",     # vazio → cleaned vira "+" → não casa o regex E.164
            "abc",  # sem dígitos → mesmo caminho
        ],
    )
    def test_invalid_phone_raises(self, bad: str):
        with pytest.raises(ValidationError):
            ContactCreate(**_payload(bad))
