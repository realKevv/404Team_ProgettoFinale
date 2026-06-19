import React from 'react';
import { MapPin, Users } from 'lucide-react';

export function ColleaguesTracker({ trasferte = [], utenti = [] }) {
    // Filtriamo solo le trasferte approvate
    const activeTrips = trasferte.filter(t => t.stato === 'approvata');

    return (
        <div className="bg-[var(--colore-sfondo-card)] p-6 rounded-2xl border border-[var(--colore-bordo)] shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[var(--colore-testo-principale)]">
                <Users size={18} className="text-[var(--colore-secondario)]" />
                Chi è fuori ufficio?
            </h2>

            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {activeTrips.length === 0 && (
                    <p className="text-sm text-[var(--colore-testo-mutato)] italic">Tutti in ufficio oggi.</p>
                )}

                {activeTrips.map(trip => {
                    // Troviamo il nome dell'utente associato a questa trasferta
                    const utente = utenti?.find(u => u.id === trip.id_utente);
                    return (
                        <div key={trip.id} className="flex justify-between items-center p-3 rounded-lg bg-[var(--colore-sfondo-alt)] border border-[var(--colore-bordo)]">
                            <div>
                                <p className="text-sm font-semibold text-[var(--colore-testo-principale)]">
                                    {utente?.nome_completo || "Utente"}
                                </p>
                                <p className="text-xs text-[var(--colore-testo-mutato)] flex items-center gap-1">
                                    <MapPin size={12} /> {trip.destinazione}
                                </p>
                            </div>
                            <div className="text-xs font-bold px-2 py-1 rounded badge-info">
                                {trip.data_fine?.substring(5, 10) || ''}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}