export function TrackingBoard({ trasferte }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trasferte.filter(t => t.stato === 'approvata').map(t => (
                <div key={t.id} className="p-4 border rounded-xl bg-white shadow-sm">
                    <h3 className="font-bold text-lg">{t.destinazione}</h3>
                    <p className="text-sm text-gray-500">Torna il: {t.data_fine}</p>
                    <div className="mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded inline-block">
                        In trasferta
                    </div>
                </div>
            ))}
        </div>
    );
}