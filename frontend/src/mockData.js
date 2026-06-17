/**
 * mockData.js
 * * Dati di test speculari alla struttura del database MariaDB/MySQL.
 * Questo file permette alle frontendiste di sviluppare l'interfaccia React
 * simulando le risposte delle API prima che il backend sia pronto.
 */

// 1. Array degli Utenti
export const mockUtenti = [
    {
        id: 1,
        nome_completo: "Mario Rossi",
        email: "mario.rossi@azienda.com",
        ruolo: "user" // Dipendente standard
    },
    {
        id: 2,
        nome_completo: "Sara Bianchi",
        email: "sara.bianchi@azienda.com",
        ruolo: "admin" // Manager / HR
    },
    {
        id: 3,
        nome_completo: "Luca Verdi",
        email: "luca.verdi@azienda.com",
        ruolo: "user"
    }
];

// 2. Array delle Trasferte
export const mockTrasferte = [
    {
        id: 1,
        id_utente: 1,
        nome_utente: "Mario Rossi", // Aggiunto per comodità del frontend (evita di fare filtri manuali)
        destinazione: "Milano (Sede Centrale)",
        data_inizio: "2026-06-20",
        data_fine: "2026-06-23",
        motivo: "Meeting trimestrale con i Partner commerciali e allineamento budget.",
        stato: "approvata",
        creato_il: "2026-06-15T10:00:00.000Z"
    },
    {
        id: 2,
        id_utente: 1,
        nome_utente: "Mario Rossi",
        destinazione: "Parigi (Filiale France)",
        data_inizio: "2026-07-15",
        data_fine: "2026-07-18",
        motivo: "Audit tecnico della vecchia infrastruttura e setup nuovi server locali.",
        stato: "in_attesa",
        creato_il: "2026-06-15T14:30:00.000Z"
    },
    {
        id: 3,
        id_utente: 3,
        nome_utente: "Luca Verdi",
        destinazione: "Roma (Workshop Tech)",
        data_inizio: "2026-05-10",
        data_fine: "2026-05-12",
        motivo: "Corso di aggiornamento su React 19 e Next.js App Router.",
        stato: "rifiutata",
        creato_il: "2026-05-01T09:15:00.000Z"
    }
];

// 3. Array delle Spese (Note spese / Scontrini)
export const mockSpese = [
    {
        id: 1,
        id_trasferta: 1,
        destinazione_trasferta: "Milano (Sede Centrale)",
        categoria: "trasporto",
        importo: 45.30,
        url_scontrino: "/uploads/treno_milano.pdf",
        fuori_policy: false,
        creato_il: "2026-06-20T08:30:00.000Z"
    },
    {
        id: 2,
        id_trasferta: 1,
        destinazione_trasferta: "Milano (Sede Centrale)",
        categoria: "vitto",
        importo: 65.00, // IMPORTANTE: Questo sfora i 50€ di massimale del vitto!
        url_scontrino: "/uploads/cena_business.jpg",
        fuori_policy: true, // Così le ragazze possono farlo colorare di rosso in React
        creato_il: "2026-06-21T20:15:00.000Z"
    },
    {
        id: 3,
        id_trasferta: 1,
        destinazione_trasferta: "Milano (Sede Centrale)",
        categoria: "alloggio",
        importo: 120.00,
        url_scontrino: "/uploads/hotel_central.png",
        fuori_policy: false,
        creato_il: "2026-06-22T07:00:00.000Z"
    }
];

// 4. Array delle Travel Policies (Tetti di spesa)
export const mockTravelPolicies = [
    {
        id: 1,
        categoria: "vitto",
        massimale_giornaliero: 50.00,
        aggiornato_il: "2026-01-10T12:00:00.000Z"
    },
    {
        id: 2,
        categoria: "alloggio",
        massimale_giornaliero: 150.00,
        aggiornato_il: "2026-01-10T12:00:00.000Z"
    },
    {
        id: 3,
        categoria: "trasporto",
        massimale_giornaliero: 100.00,
        aggiornato_il: "2026-01-10T12:00:00.000Z"
    },
    {
        id: 4,
        categoria: "altro",
        massimale_giornaliero: 30.00,
        aggiornato_il: "2026-01-10T12:00:00.000Z"
    }
];