from app.services.campaign_render import render_message


class TestRenderMessage:
    def test_empresa_cai_para_nome_quando_business_name_eh_none(self):
        contact = {"name": "Maria Silva", "business_name": None}
        out = render_message("Oi {{empresa}}!", contact, None)
        assert out == "Oi Maria Silva!"

    def test_empresa_cai_para_nome_quando_business_name_eh_string_vazia(self):
        contact = {"name": "Maria Silva", "business_name": ""}
        out = render_message("Oi {{empresa}}!", contact, None)
        assert out == "Oi Maria Silva!"

    def test_primeiro_nome_pega_so_primeira_palavra_de_nome_composto(self):
        contact = {"name": "Ana Maria da Silva", "business_name": "Padaria Pão Doce"}
        out = render_message("Oi {{primeiro_nome}}, da {{empresa}}?", contact, None)
        assert out == "Oi Ana, da Padaria Pão Doce?"

    def test_imagem_placeholder_substitui_inline_sem_duplicar_no_final(self):
        contact = {"name": "Joao", "business_name": "Acai do Joao"}
        url = "https://cdn.example.com/promo.png"
        template = "Olha essa promo: {{imagem}} 🔥"
        out = render_message(template, contact, url)
        assert out == f"Olha essa promo: {url} 🔥"
        assert out.count(url) == 1

    def test_imagem_sem_placeholder_anexada_ao_final_em_linha_propria(self):
        contact = {"name": "Joao", "business_name": "Acai do Joao"}
        url = "https://cdn.example.com/promo.png"
        out = render_message("Oi {{primeiro_nome}}, promo nova!", contact, url)
        assert out == f"Oi Joao, promo nova!\n{url}"

    def test_sem_imagem_e_sem_placeholder_nao_aparece_url(self):
        contact = {"name": "Joao", "business_name": "Acai do Joao"}
        out = render_message("Oi {{primeiro_nome}}!", contact, None)
        assert out == "Oi Joao!"
        assert "http" not in out

    def test_aceita_objeto_alem_de_dict(self):
        class FakeContact:
            name = "Carlos Eduardo"
            business_name = "Studio CE"

        out = render_message(
            "Oi {{primeiro_nome}} da {{empresa}}!", FakeContact(), None
        )
        assert out == "Oi Carlos da Studio CE!"
