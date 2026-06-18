import os
import jwt
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from models.chat_model import ChatRequest, ChatResponse
from core.agent import genera_risposta_ia

router = APIRouter()

# Diciamo a FastAPI di cercare il token nell'header Authorization
security = HTTPBearer()

# FONDAMENTALE: Questa deve essere la STESSA identica chiave usata 
# dal tuo backend principale per generare il token al momento del login!
SECRET_KEY = os.getenv("JWT_SECRET", "la_tua_chiave_segreta")
ALGORITHM = "HS256"

def get_utente_dal_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Funzione scudo: intercetta il token, lo verifica e ne estrae i dati."""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        user_id = payload.get("id")
        ruolo = payload.get("ruolo")
        
        if user_id is None or ruolo is None:
            raise HTTPException(status_code=401, detail="Token incompleto: mancano ID o Ruolo")
            
        return {"id": user_id, "ruolo": ruolo}
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token scaduto. Fai di nuovo il login.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Tentativo di intrusione: Token falso o manomesso.")

@router.post("/chat", response_model=ChatResponse)
async def handle_chat(request: ChatRequest, utente_sicuro: dict = Depends(get_utente_dal_token)):
    try:
        # Ora user_id e ruolo arrivano dalla cassaforte, non dal frontend!
        user_id_vero = utente_sicuro["id"]
        ruolo_vero = utente_sicuro["ruolo"]
        
        # Passiamo i dati puliti all'Intelligenza Artificiale
        risposta_ia = genera_risposta_ia(request.message, user_id_vero, ruolo_vero)
        return ChatResponse(response=risposta_ia)
        
    except Exception as e:
        import traceback
        traceback.print_exc()  # Stampa l'errore completo nel terminale
        raise HTTPException(status_code=500, detail=f"Errore IA: {str(e)}")