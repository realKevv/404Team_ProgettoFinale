import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Funzioncina di supporto per prendere sempre il token fresco
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
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
    error: null,

    // ==========================================
    // 2. AZIONI: TRASFERTE
    // ==========================================
    fetchTrasferte: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/trasferte`, { headers: getAuthHeaders() });
            set({ trasferte: response.data, isLoading: false });
        } catch (error) {
            set({ error: 'Errore nel caricamento trasferte', isLoading: false });
        }
    },

    addTrasferta: async (nuovaTrasferta) => {
        try {
            const response = await axios.post(`${API_URL}/trasferte`, nuovaTrasferta, { headers: getAuthHeaders() });
            set((state) => ({ trasferte: [...state.trasferte, response.data] }));
        } catch (error) {
            console.error("Errore aggiunta:", error);
            throw error;
        }
    },

    // 🔥 QUESTA SERVE ALL'ADMIN: Approvare o rifiutare una trasferta!
    cambiaStatoTrasferta: async (id_trasferta, nuovoStato) => {
        try {
            const response = await axios.put(`${API_URL}/trasferte/${id_trasferta}/stato`,
                { stato: nuovoStato }, // 'approvata' o 'rifiutata'
                { headers: getAuthHeaders() }
            );
            set((state) => ({
                trasferte: state.trasferte.map(t =>
                    t.id === id_trasferta ? { ...t, stato: nuovoStato } : t
                )
            }));
        } catch (error) {
            console.error("Errore cambio stato:", error);
        }
    },

    // ==========================================
    // 3. AZIONI: SPESE / SCONTRINI
    // ==========================================

    // Scarica le spese di UNA specifica trasferta quando ci clicchi sopra
    fetchSpeseByTrasferta: async (id_trasferta) => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`${API_URL}/spese/trasferta/${id_trasferta}`, { headers: getAuthHeaders() });
            set({ spese: response.data, isLoading: false });
        } catch (error) {
            set({ error: 'Errore caricamento scontrini', isLoading: false });
        }
    },

    // Aggiunge uno scontrino (Attenzione: usa multipart/form-data per il file upload!)
    addSpesa: async (formDataSpesa) => {
        try {
            const response = await axios.post(`${API_URL}/spese`, formDataSpesa, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'multipart/form-data' // Fondamentale per i file!
                }
            });
            // Aggiunge la nuova spesa e il backend ci dirà se è "fuori_policy"
            set((state) => ({ spese: [...state.spese, response.data] }));
        } catch (error) {
            console.error("Errore upload scontrino:", error);
            throw error;
        }
    },

    // ==========================================
    // 4. AZIONI: TRAVEL POLICIES
    // ==========================================
    fetchPolicies: async () => {
        try {
            const response = await axios.get(`${API_URL}/policies`, { headers: getAuthHeaders() });
            set({ policies: response.data });
        } catch (error) {
            console.error("Errore caricamento policies:", error);
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
    }
}));