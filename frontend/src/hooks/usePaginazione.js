import { useState, useMemo } from 'react';

/**
 * Hook generico per la paginazione.
 * @param {Array} items - Array totale di elementi da paginare.
 * @param {number} righePerPagina - Numero di righe per pagina (default 10).
 * @returns pagina corrente, totale pagine, elementi della pagina, funzioni di navigazione.
 */
export function usePaginazione(items, righePerPagina = 10) {
    const [paginaCorrente, setPaginaCorrente] = useState(1);

    // Ogni volta che i dati filtrati cambiano, torniamo alla pagina 1
    const totalePagine = Math.max(1, Math.ceil(items.length / righePerPagina));

    // Se la pagina corrente supera il totale (es. dopo un filtro), ritorniamo a 1
    const paginaSicura = Math.min(paginaCorrente, totalePagine);

    const elementiPagina = useMemo(() => {
        const start = (paginaSicura - 1) * righePerPagina;
        return items.slice(start, start + righePerPagina);
    }, [items, paginaSicura, righePerPagina]);

    const vaiAPagina = (n) => setPaginaCorrente(Math.max(1, Math.min(n, totalePagine)));
    const reset = () => setPaginaCorrente(1);

    return {
        paginaCorrente: paginaSicura,
        totalePagine,
        elementiPagina,
        vaiAPagina,
        reset,
    };
}
