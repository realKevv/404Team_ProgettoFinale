from langchain_core.tools import tool
from langchain_mistralai import ChatMistralAI
from langgraph.prebuilt import create_react_agent
from database.db_tools import (
    get_mie_trasferte, get_status_team, 
    admin_get_tutte_trasferte, admin_get_da_approvare
)

# ==========================================
# 🛠️ GLI STRUMENTI (TOOLS)
# ==========================================

@tool
def tool_mie_trasferte(user_id: int) -> str:
    """Usa questo tool per cercare le trasferte assegnate all'utente che ti sta parlando."""
    return get_mie_trasferte(user_id)

@tool
def tool_status_team() -> str:
    """Usa questo tool per sapere chi è in sede e chi è in trasferta. Non rivela dettagli sensibili."""
    return get_status_team()

@tool
def tool_admin_tutte_trasferte() -> str:
    """Usa questo tool per vedere TUTTE le trasferte dell'azienda di tutti i dipendenti."""
    return admin_get_tutte_trasferte()

@tool
def tool_admin_da_approvare() -> str:
    """Usa questo tool per vedere le richieste di viaggio in attesa di approvazione."""
    return admin_get_da_approvare()


# ==========================================
# 🧠 IL CERVELLO (CREAZIONE DINAMICA)
# ==========================================

def genera_risposta_ia(messaggio_utente: str, user_id: int, ruolo: str) -> str:
    """
    Legge il ruolo e costruisce l'agente perfetto (motore, tools e personalità) 
    per rispondere alla domanda in totale sicurezza e con un'ottima UX.
    """
    import os
    mistral_key = os.getenv("MISTRAL_API_KEY", "").strip()
    if not mistral_key or mistral_key == "your_mistral_api_key_here":
        return "⚠️ **Chiave API mancante**: La chiave API di Mistral (`MISTRAL_API_KEY`) non è configurata o è vuota nel file `.env` del microservizio `backend-ai`. Inserisci una chiave API valida per chattare con l'assistente!"
    
    # ------------------------------------------
    # 👤 LOGICA DIPENDENTE (USER)
    # ------------------------------------------
    if ruolo.lower() == "user":
        llm = ChatMistralAI(model="mistral-small-latest")
        tools_consentiti = [tool_mie_trasferte, tool_status_team]
        
        prompt_di_sistema = """
        Sei l'assistente IA del gestionale Business Travel.
        Stai parlando con un DIPENDENTE. 
        Le tue funzionalità sono:
        - I Miei Viaggi: Mostrare le sue trasferte.
        - Status Team: Mostrare l'elenco dei colleghi (se In Sede o In Trasferta).
        
        REGOLE FONDAMENTALI: 
        1. Cerca ESCLUSIVAMENTE le trasferte assegnate a lui usando i tools. 
        2. Non rivelare mai dettagli o costi sui viaggi di altri dipendenti.
        
        REGOLE DI STILE (UX):
        - Usa una formattazione Markdown pulita e ariosa.
        - Vai sempre a capo (doppio invio) tra un concetto e l'altro.
        - Usa il **grassetto** per evidenziare Nomi, Date e Città.
        - Usa elenchi puntati se devi elencare più viaggi o colleghi.
        - Inserisci un paio di emoji professionali (es. ✈️, 🏢, ✅, 📅) per rendere il testo piacevole.
        """
        
    # ------------------------------------------
    # 👑 LOGICA AMMINISTRATORE (ADMIN)
    # ------------------------------------------
    elif ruolo.lower() == "admin":
        llm = ChatMistralAI(model="mistral-large-latest")
        tools_consentiti = [tool_admin_tutte_trasferte, tool_admin_da_approvare]
        
        prompt_di_sistema = """
        Sei l'assistente IA del gestionale Business Travel.
        Stai parlando con un AMMINISTRATORE (Admin) che ha permessi totali.
        Le tue funzionalità sono:
        - Approvazioni Trasferte: Dirgli chi è in attesa di approvazione.
        - Tutte le Trasferte: Dargli una visione globale su tutti i dipendenti.
        
        REGOLE DI STILE E UX:
        - Struttura la risposta in paragrafi ben separati.
        - Usa titoli in Markdown (es. ### Trasferte in Attesa).
        - Usa elenchi puntati per i dati dei dipendenti.
        - Usa il **grassetto** per i dati chiave e gli stati (es. **Approvata**).
        - Mantieni un tono dirigenziale ma usa emoji per facilitare la lettura visiva (es. 📊, 🔴, 🟢).
        """
        
    else:
        return "❌ Errore di sicurezza: Ruolo non riconosciuto."

    # Creiamo l'agente al volo con il prompt di sistema appena definito e i tools scelti
    agente = create_react_agent(llm, tools_consentiti, prompt=prompt_di_sistema)
    
    # Invochiamo l'agente passandogli il messaggio
    risultato = agente.invoke({
        "messages": [
            ("user", f"Il mio ID utente è {user_id}. La mia richiesta è: {messaggio_utente}")
        ]
    })
    
    return risultato["messages"][-1].content