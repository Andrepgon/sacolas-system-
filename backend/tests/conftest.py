import os
import sys
from pathlib import Path

# Garante que `import app...` funciona quando pytest roda da raiz do backend/
ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

# Variáveis exigidas pelo Settings — valores dummy só pra o import não estourar.
# Nenhum teste deve realmente tocar o Supabase; o cliente é mockado.
os.environ.setdefault("SUPABASE_URL", "https://test.supabase.co")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "test-service-role")
os.environ.setdefault("SUPABASE_ANON_KEY", "test-anon")
os.environ.setdefault("SUPABASE_JWT_SECRET", "test-jwt-secret")
