import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Carichiamo le variabili dal file .env
load_dotenv()

app = FastAPI(title="Business Travel AI Service", version="1.0")

# Configurazione CORS per permettere a React (es: localhost:5173) di chiamare questo server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In produzione metteremo l'URL specifico del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Definiamo la struttura dei dati che ci aspettiamo nella richiesta POST
class ChatRequest(BaseModel):
    message: str
    user_id: int

@app.get("/")
def home():
    return {"status": "online", "message": "Il server IA è attivo e pronto!"}

@app.post("/api/ai/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # Per ora facciamo un finto ritorno, giusto per testare che il server risponda
        user_message = request.message
        print(f"Ricevuto messaggio da utente {request.user_id}: {user_message}")
        
        # Qui nello Step 2 collegheremo il nostro agente LangGraph
        ai_response = f"Ricevuto! Hai detto: '{user_message}'. Presto ti risponderò usando Mistral e il DB."
        
        return {"response": ai_response}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))