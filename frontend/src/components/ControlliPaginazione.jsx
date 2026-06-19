import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Componente riusabile per i controlli di navigazione della paginazione.
 */
export function ControlliPaginazione({ paginaCorrente, totalePagine, vaiAPagina, totaleElementi, righePerPagina }) {
    if (totalePagine <= 1) return null;

    const inizio = (paginaCorrente - 1) * righePerPagina + 1;
    const fine = Math.min(paginaCorrente * righePerPagina, totaleElementi);

    // Genera l'array dei numeri di pagina con "..." dove serve
    const pagine = [];
    for (let i = 1; i <= totalePagine; i++) {
        if (i === 1 || i === totalePagine || (i >= paginaCorrente - 1 && i <= paginaCorrente + 1)) {
            pagine.push(i);
        } else if (pagine[pagine.length - 1] !== '...') {
            pagine.push('...');
        }
    }

    return (
        <div className="flex items-center justify-between pt-4 mt-2 border-t" style={{ borderColor: 'var(--colore-bordo)' }}>
            <p className="text-xs font-medium" style={{ color: 'var(--colore-testo-mutato)' }}>
                {inizio}–{fine} di <b>{totaleElementi}</b> risultati
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => vaiAPagina(paginaCorrente - 1)}
                    disabled={paginaCorrente === 1}
                    className="p-1.5 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--colore-sfondo-alt)]"
                    style={{ color: 'var(--colore-testo-secondario)' }}
                >
                    <ChevronLeft size={16} />
                </button>

                {pagine.map((p, i) =>
                    p === '...' ? (
                        <span key={`dots-${i}`} className="px-1 text-xs" style={{ color: 'var(--colore-testo-mutato)' }}>…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => vaiAPagina(p)}
                            className="w-8 h-8 rounded-lg text-xs font-semibold transition-all"
                            style={
                                p === paginaCorrente
                                    ? { backgroundColor: 'var(--colore-primario)', color: '#fff' }
                                    : { color: 'var(--colore-testo-secondario)', backgroundColor: 'transparent' }
                            }
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    onClick={() => vaiAPagina(paginaCorrente + 1)}
                    disabled={paginaCorrente === totalePagine}
                    className="p-1.5 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--colore-sfondo-alt)]"
                    style={{ color: 'var(--colore-testo-secondario)' }}
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
