import os
import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "")
    )

# ==========================================
# 👤 TOOLS PER IL DIPENDENTE (USER)
# ==========================================

def get_mie_trasferte(user_id: int) -> str:
    """Estrae tutte le trasferte (passate, presenti e future) del dipendente."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT destinazione, data_inizio, data_fine, stato FROM trasferte WHERE id_utente = %s"
        cursor.execute(query, (user_id,))
        risultati = cursor.fetchall()
        
        if not risultati:
            return "Non hai nessuna trasferta registrata."
            
        testo = "Le tue trasferte:\n"
        for r in risultati:
            testo += f"- {r['destinazione']} (Dal {r['data_inizio']} al {r['data_fine']}) - Stato: {r['stato']}\n"
        return testo
    except Exception as e:
        return f"Errore DB: {str(e)}"
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

def get_status_team() -> str:
    """Mostra chi è in trasferta e chi in ufficio (Senza costi o motivi)."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        # Semplificazione: se la data di oggi è tra inizio e fine ed è approvata, è in trasferta.
        query = """
            SELECT u.nome_completo, 
                   IF(t.id IS NOT NULL, 'In Trasferta', 'In Sede') as stato_attuale,
                   t.destinazione
            FROM utenti u
            LEFT JOIN trasferte t ON u.id = t.id_utente 
               AND CURDATE() BETWEEN t.data_inizio AND t.data_fine 
               AND t.stato = 'approvata'
        """
        cursor.execute(query)
        risultati = cursor.fetchall()
        
        testo = "Stato attuale del Team:\n"
        for r in risultati:
            se_trasferta = f" a {r['destinazione']}" if r['destinazione'] else ""
            testo += f"- {r['nome_completo']}: {r['stato_attuale']}{se_trasferta}\n"
        return testo
    except Exception as e:
        return f"Errore DB: {str(e)}"
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

# ==========================================
# 👑 TOOLS PER L'AMMINISTRATORE (ADMIN)
# ==========================================

def admin_get_tutte_trasferte() -> str:
    """Visione globale di tutte le trasferte dell'azienda."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT u.nome_completo, t.destinazione, t.data_inizio, t.data_fine, t.stato, t.motivo
            FROM trasferte t
            JOIN utenti u ON t.id_utente = u.id
        """
        cursor.execute(query)
        risultati = cursor.fetchall()
        
        testo = "Elenco Totale Trasferte Aziendali:\n"
        for r in risultati:
            testo += f"- {r['nome_completo']} a {r['destinazione']} ({r['data_inizio']} - {r['data_fine']}). Motivo: {r['motivo']}. Stato: {r['stato']}\n"
        return testo
    except Exception as e:
        return f"Errore DB: {str(e)}"
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

def admin_get_da_approvare() -> str:
    """Elenca tutte le trasferte in attesa di approvazione."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT u.nome_completo, t.id, t.destinazione, t.data_inizio, t.data_fine 
            FROM trasferte t
            JOIN utenti u ON t.id_utente = u.id
            WHERE t.stato = 'in attesa'
        """
        cursor.execute(query)
        risultati = cursor.fetchall()
        
        if not risultati:
            return "Non ci sono trasferte da approvare al momento."
            
        testo = "Trasferte in attesa di approvazione:\n"
        for r in risultati:
            testo += f"- ID {r['id']}: {r['nome_completo']} per {r['destinazione']} (Dal {r['data_inizio']} al {r['data_fine']})\n"
        return testo
    except Exception as e:
        return f"Errore DB: {str(e)}"
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()