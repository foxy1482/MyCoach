import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { GetUserID } from "../../../../../utils/getUser";
import { ShowSvg } from "../../../../utilities/ShowSvg";
import { GetAllFoods } from "../../../../../utils/getDiet";

export function ModalListFoods({ comida, pantallaNueva, setPantallaNueva, onClose, reload = null, startReload = null }) {
    const [alimentos, setAlimentos] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [seleccionados, setSeleccionados] = useState({});
    const [loading, setLoading] = useState(false);

    const token = Cookies.get("token");

    // Obtener alimentos al montar
    useEffect(() => {
        const fetchRutinas = async () => {
            setLoading(true);
            try {
                const clienteData = await GetUserID(token);
                const res = await GetAllFoods();
                setAlimentos(res);
            } catch (err) {
                setAlimentos([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRutinas();
    }, []);

    // Filtrar alimentos por nombre
    const alimentosFiltrados = alimentos.filter(r =>
        r.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    // Manejar selección y cantidad de alimentos
    const handleSelectAlimento = (alimento) => {
        setSeleccionados(prev => {
            if (prev[alimento.id]) {
                // Si ya está seleccionado, lo deselecciona
                const nuevo = { ...prev };
                delete nuevo[alimento.id];
                return nuevo;
            } else {
                // Selecciona y agrega cantidad por defecto
                return { ...prev, [alimento.id]: { ...alimento, cantidad: "" } };
            }
        });
    };

    const handleCantidadChange = (alimentoId, cantidad) => {
        setSeleccionados(prev => ({
            ...prev,
            [alimentoId]: {
                ...prev[alimentoId],
                cantidad
            }
        }));
    };

    // Asignar alimentos a la comida (varios fetch)
    const handleAsignAlimentos = async () => {
        if (startReload) {
            if (Object.keys(seleccionados).length === 0) return;
            setLoading(true);
            try {
                for (const alimentoId in seleccionados) {
                    const alimento = seleccionados[alimentoId];
                    if (!alimento.cantidad || isNaN(alimento.cantidad) || Number(alimento.cantidad) <= 0) continue;
                    await fetch("/api/api/dietas/comida/alimento/asignar", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            "comida_alimento": {
                                "dieta_comida_id": comida.comida_id,
                                "alimento_id": alimento.id,
                                "cantidad_g": Number(alimento.cantidad)
                            },
                            data: { token }
                        })
                    });
                }
                setPantallaNueva(false);

                if (startReload && reload)
                {
                    if (reload) startReload(false);
                    else if (!reload) startReload(true);
                }
            } catch (err) {
                alert("Error REasignando alimentos");
            } finally {
                onClose();
            }
        } else {
            if (Object.keys(seleccionados).length === 0) return;
            setLoading(true);
            try {
                for (const alimentoId in seleccionados) {
                    const alimento = seleccionados[alimentoId];
                    if (!alimento.cantidad || isNaN(alimento.cantidad) || Number(alimento.cantidad) <= 0) continue;
                    await fetch("/api/api/dietas/comida/alimento/asignar", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            "comida_alimento": {
                                "dieta_comida_id": comida.id,
                                "alimento_id": alimento.id,
                                "cantidad_g": Number(alimento.cantidad)
                            },
                            data: { token }
                        })
                    });
                }
                setPantallaNueva(false);

                if (startReload && reload)
                {
                    if (reload) startReload(false);
                    else if (reload) startReload(true);
                }
            } catch (err) {
                alert("Error asignando alimentos");
            } finally {
                onClose();
            }
        }
    };

    return (
        <div className="p-6 w-full max-w-lg bg-white rounded-xl shadow-lg flex flex-col gap-4 m-auto">
            {startReload ? (
                <button onClick={() => {setPantallaNueva(false)}} className="bg-red-400 rounded-full text-white hover:bg-neutral-500 cursor-pointer transition w-fit">
                    <ShowSvg size="20" name="cross"></ShowSvg>
                </button>
            ) : ""}
            
            <h2 className="text-xl font-bold mb-2 text-primary">Selecciona uno o varios alimentos</h2>
            <input
                type="text"
                placeholder="Filtrar por nombre..."
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
                className="mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="overflow-y-auto max-h-72 mb-4">
                {loading ? (
                    <p className="text-center text-gray-500">Cargando alimentos...</p>
                ) : alimentosFiltrados.length === 0 ? (
                    <p className="text-center text-gray-400">No hay alimentos para mostrar.</p>
                ) : (
                    <ul>
    {alimentosFiltrados.map(r => (
        <li
            key={r.id}
            className={`flex flex-col gap-2 px-3 py-2 rounded-lg mb-2 transition border ${
                seleccionados[r.id]
                    ? "bg-primary/25 border-primary"
                    : "hover:bg-gray-100 border-transparent"
            }`}
        >
            <div className="flex items-center justify-between">
                <span className="font-inter font-medium">{r.nombre}</span>
                <button
                    type="button"
                    onClick={() => handleSelectAlimento(r)}
                    className={`cursor-pointer ml-2 px-3 py-1 rounded-lg font-semibold transition text-sm ${
                        seleccionados[r.id]
                            ? "bg-secondary text-white hover:bg-secondary/50"
                            : "bg-gray-200 text-gray-700 hover:bg-white/50"
                    }`}
                >
                    {seleccionados[r.id] ? "Quitar" : "Agregar"}
                </button>
            </div>
            {seleccionados[r.id] && (
                <div className="flex flex-row items-center gap-2 mt-1">
                    <input
                        type="number"
                        min="1"
                        placeholder="Cantidad"
                        value={seleccionados[r.id].cantidad}
                        onChange={e => handleCantidadChange(r.id, e.target.value)}
                        className="px-3 py-2 border border-neutral-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-32"
                    />
                    <span className="font-bold">g</span>
                </div>
            )}
        </li>
    ))}
</ul>
                )}
            </div>
            <button
                className={`w-full cursor-pointer py-2 rounded-lg font-semibold transition ${
                    Object.values(seleccionados).some(a => a.cantidad && Number(a.cantidad) > 0)
                        ? "bg-primary text-white hover:bg-primary"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={
                    !Object.values(seleccionados).some(a => a.cantidad && Number(a.cantidad) > 0) || loading
                }
                onClick={handleAsignAlimentos}
                type="button"
            >
                Asignar alimentos
            </button>
        </div>
    );
}