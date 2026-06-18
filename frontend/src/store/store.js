import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Funzioncina di supporto per prendere sempre il token fresco
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

// Helper riutilizzabile per estrarre il vero messaggio d'errore dal backend
const estraiErroreServer = (error, messaggioDefault) => {
    if (error.response && error.response.data) {
        // Cerca tutte le varianti più comuni in cui Express/Joi sputa fuori l'errore
        return error.response.data.error || error.response.data.message || error.response.data.details || messaggioDefault;
    }
    return error.message || messaggioDefault;
};

export const useStore = create((set, get) => ({
    // ==========================================
    // 1. STATO GLOBALE (I nostri Dati)
    // ==========================================
    trasferte: [],
    spese: [],          // Scontrini della trasferta selezionata
    policies: [],       // I massimali (es. 50€ vitto)
    utenti: [],         // Lista utenti (per l'Admin)
    isLoading: false,
    error: null,        // Conterrà i messaggi specifici (es: "Date sovrapposte!")
    isNotifOpen: false,
    setIsNotifOpen: (open) => set({ isNotifOpen: open }),

    // ==========================================
    // 2. AZIONI: TRASFERTE
    // ==========================================
    fetchTrasferte: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/trasferte`, { headers: getAuthHeaders() });
            set({ trasferte: response.data, isLoading: false });
        } catch (error) {
            const msg = estraiErroreServer(error, 'Errore nel caricamento delle trasferte');
            set({ error: msg, isLoading: false });
        }
    },

    addTrasferta: async (nuoviDati) => {
        set({ isLoading: true, error: null }); // 🔥 Resetta errori precedenti e attiva il loading
        try {
            const utenteLocale = JSON.parse(localStorage.getItem('utente') || '{}');

            const payload = {
                destinazione: nuoviDati.destinazione,
                data_inizio: nuoviDati.data_inizio,
                data_fine: nuoviDati.data_fine,
                motivo: nuoviDati.motivo,
                id_utente: nuoviDati.id_utente ? parseInt(nuoviDati.id_utente, 10) : parseInt(utenteLocale.id, 10)
            };

            const response = await axios.post(`${API_URL}/trasferte`, payload, { headers: getAuthHeaders() });

            const { utenti } = get();
            const dipendenteTrovato = utenti.find(u => u.id === payload.id_utente);

            const nuovaTrasfertaArricchita = {
                ...response.data,
                richiedente: dipendenteTrovato ? dipendenteTrovato.nome_completo : utenteLocale.nome_completo
            };

            set((state) => ({
                trasferte: [nuovaTrasfertaArricchita, ...state.trasferte],
                isLoading: false
            }));

        } catch (error) {
            // 🔥 CATTURA L'ERRORE COERENTE (Es: "Data fine antecedente a inizio" o "Utente già occupato")
            const msg = estraiErroreServer(error, "Impossibile aggiungere la trasferta. Verificare i dati.");
            set({ error: msg, isLoading: false });

            // Rilancia l'errore testuale in modo che il componente possa catturarlo nel catch
            throw new Error(msg);
        }
    },

    cambiaStatoTrasferta: async (id_trasferta, nuovoStato) => {
        set({ isLoading: true, error: null });
        try {
            await axios.put(`${API_URL}/trasferte/${id_trasferta}/stato`,
                { stato: nuovoStato },
                { headers: getAuthHeaders() }
            );
            set((state) => ({
                trasferte: state.trasferte.map(t =>
                    t.id === id_trasferta ? { ...t, stato: nuovoStato } : t
                ),
                isLoading: false
            }));
        } catch (error) {
            const msg = estraiErroreServer(error, "Errore durante il cambio di stato della trasferta.");
            set({ error: msg, isLoading: false });
            throw new Error(msg);
        }
    },

    deleteTrasferta: async (id_trasferta) => {
        set({ isLoading: true, error: null });
        try {
            await axios.delete(`${API_URL}/trasferte/${id_trasferta}`, { headers: getAuthHeaders() });
            set((state) => ({
                trasferte: state.trasferte.filter(t => t.id !== id_trasferta),
                isLoading: false
            }));
        } catch (error) {
            const msg = estraiErroreServer(error, "Impossibile eliminare la trasferta.");
            set({ error: msg, isLoading: false });
            throw new Error(msg);
        }
    },

    // ==========================================
    // 3. AZIONI: SPESE / SCONTRINI
    // ==========================================
    fetchSpeseByTrasferta: async (id_trasferta) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/spese/trasferta/${id_trasferta}`, { headers: getAuthHeaders() });
            set({ spese: response.data, isLoading: false });
        } catch (error) {
            const msg = estraiErroreServer(error, 'Errore nel caricamento degli scontrini');
            set({ error: msg, isLoading: false });
        }
    },

    addSpesa: async (formDataSpesa) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/spese`, formDataSpesa, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'multipart/form-data'
                }
            });
            set((state) => ({
                spese: [...state.spese, response.data],
                isLoading: false
            }));
        } catch (error) {
            // 🔥 Cattura l'errore della nota spese (es. "File non supportato" o "Importo non valido")
            const msg = estraiErroreServer(error, "Errore durante l'upload dello scontrino.");
            set({ error: msg, isLoading: false });
            throw new Error(msg);
        }
    },

    valutaSpesa: async (idSpesa, stato, importoRimborso) => {
        set({ isLoading: true, error: null });
        try {
            await axios.put(`${API_URL}/spese/valuta/${idSpesa}`,
                {
                    stato_approvazione: stato,
                    importo_rimborsato: importoRimborso
                },
                { headers: getAuthHeaders() }
            );

            set((state) => ({
                spese: state.spese.map(s =>
                    s.id === idSpesa ? { ...s, stato_approvazione: stato, importo_rimborsato: importoRimborso } : s
                ),
                isLoading: false
            }));
        } catch (error) {
            const msg = estraiErroreServer(error, "Errore durante la valutazione della spesa.");
            set({ error: msg, isLoading: false });
            throw new Error(msg);
        }
    },

    deleteSpesa: async (idSpesa) => {
        set({ isLoading: true, error: null });
        try {
            await axios.delete(`${API_URL}/spese/${idSpesa}`, { headers: getAuthHeaders() });
            set((state) => ({
                spese: state.spese.filter(s => s.id !== idSpesa),
                isLoading: false
            }));
        } catch (error) {
            const msg = estraiErroreServer(error, "Impossibile eliminare lo scontrino.");
            set({ error: msg, isLoading: false });
            throw new Error(msg);
        }
    },

    // ==========================================
    // 4. AZIONI: TRAVEL POLICIES
    // ==========================================
    fetchPolicies: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/policies`, { headers: getAuthHeaders() });
            const policiesObj = {};
            response.data.forEach(p => {
                policiesObj[p.categoria] = p.massimale_giornaliero;
            });
            set({ policies: policiesObj, isLoading: false });
        } catch (error) {
            const msg = estraiErroreServer(error, "Errore nel caricamento delle policy aziendali.");
            set({ error: msg, isLoading: false });
        }
    },

    updatePolicy: async (categoria, nuovoMassimale) => {
        set({ isLoading: true, error: null });
        try {
            await axios.put(`${API_URL}/policies/${categoria}`,
                { massimale_giornaliero: nuovoMassimale },
                { headers: getAuthHeaders() }
            );
            set({ isLoading: false });
        } catch (error) {
            const msg = estraiErroreServer(error, "Impossibile aggiornare la policy.");
            set({ error: msg, isLoading: false });
            throw new Error(msg);
        }
    },

    // ==========================================
    // 5. AZIONI: UTENTI (Solo Admin)
    // ==========================================
    fetchUtenti: async () => {
        try {
            const response = await axios.get(`${API_URL}/utenti`, { headers: getAuthHeaders() });
            set({ utenti: response.data });
        } catch (error) {
            console.error("Errore caricamento utenti:", error);
        }
    },

    addUtente: async (nuovoUtente) => {
        set({ isLoading: true, error: null });
        try {
            // Invio dei dati al server con i token di autenticazione dell'admin
            const response = await axios.post(`${API_URL}/utenti`, nuovoUtente, { headers: getAuthHeaders() });
            
            // Aggiorniamo lo stato locale aggiungendo il nuovo utente alla lista esistente
            set((state) => ({
                utenti: [...state.utenti, response.data],
                isLoading: false
            }));
            
            return response.data;
        } catch (error) {
            // Intercettiamo l'errore del server (es. "Email già registrata")
            const msg = estraiErroreServer(error, "Impossibile aggiungere il nuovo utente.");
            set({ error: msg, isLoading: false });
            
            // Rilanciamo l'errore per permettere al form di catturarlo nel blocco try/catch
            throw new Error(msg);
        }
    },

    // ==========================================
    // 🔐 6. AZIONI: AUTENTICAZIONE (Login / Logout)
    // ==========================================
    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { token, utente } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('utente', JSON.stringify(utente));

            set({ isLoading: false });
            return utente;
        } catch (error) {
            const errorMessage = estraiErroreServer(error, "Credenziali non valide.");
            set({ error: errorMessage, isLoading: false });
            throw new Error(errorMessage);
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('utente');
        set({ trasferte: [], spese: [], utenti: [], policies: [], error: null, isLoading: false });
    }
}));