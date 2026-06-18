from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Importiamo il router che abbiamo appena creato
from routes.chat_route import router as chat_router

# 1. Carichiamo le chiavi segrete dal file .env
load_dotenv()

# 2. Accendiamo il server FastAPI
app = FastAPI(title="Business Travel AI API", version="1.0")

# 3. Configurazione CORS (FONDAMENTALE)
# Permette al tuo frontend React (es. localhost:5173) di fare chiamate a questo server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In produzione metteremo l'URL vero del sito
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Agganciamo il router della chat. 
# Tutte le rotte di quel file inizieranno con "/api/ai"
app.include_router(chat_router, prefix="/api/ai", tags=["Chat IA"])

# 5. Rotta di test per vedere se il server è vivo
@app.get("/")
def health_check():
    return {"status": "online", "message": "Il microservizio IA è acceso e pronto!"}