import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { GetUserID } from "../../../utils/getUser";
import { ShowSvg } from "../../utilities/ShowSvg";

export function ModalListRoutines({ nuevaRutina, setNuevaRutina, rutina, setRutina, alumnoActivo, setAlumnoActivo }) {
    const [rutinas, setRutinas] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [rutinaSeleccionada, setRutinaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(false);

    const token = Cookies.get("token");

    // Obtener rutinas al montar
    useEffect(() => {
        const fetchRutinas = async () => {
            setLoading(true);
            try {
                const clienteData = await GetUserID(token);

                const res = await fetch("/api/api/rutinas/");
                const data = await res.json();
                setRutinas(data);
            } catch (err) {
                setRutinas([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRutinas();
    }, []);

    // Filtrar rutinas por nombre
    const rutinasFiltradas = rutinas.filter(r =>
        r.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    // Asignar rutina al alumno
    const handleAsignRoutine = async () => {
        if (!rutinaSeleccionada) return;
        setLoading(true);
        try {
            const cliente_id = alumnoActivo.id;
            const rutina_id = rutinaSeleccionada.id;
            
            const fechaHoy = new Date().toISOString();
            const fecha_asignacion = fechaHoy.slice(0,10);

            await fetch("/api/api/clientes/cliente_rutina/asignar/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clienteRutina: {
                        cliente_id,
                        rutina_id,
                        fecha_asignacion
                    },
                    data: { token }
                })
            });
            setRutina(rutinaSeleccionada);
            setNuevaRutina(false);
        } catch (err) {
            alert("Error asignando rutina");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 w-full max-w-lg bg-white rounded-xl shadow-lg flex flex-col gap-4 m-auto">
            <button onClick={() => setNuevaRutina(false)} className="bg-red-400 rounded-full text-white hover:bg-neutral-500 cursor-pointer transition w-fit">
                <ShowSvg size="20" name="cross"></ShowSvg>
            </button>
            <h2 className="text-xl font-bold mb-2 text-teal-300">Selecciona una rutina</h2>
            <input
                type="text"
                placeholder="Filtrar por nombre..."
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
                className="mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
            <div className="overflow-y-auto max-h-72 mb-4">
                {loading ? (
                    <p className="text-center text-gray-500">Cargando rutinas...</p>
                ) : rutinasFiltradas.length === 0 ? (
                    <p className="text-center text-gray-400">No hay rutinas para mostrar.</p>
                ) : (
                    <ul>
                        {rutinasFiltradas.map(r => (
                            <li
                                key={r.id}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg mb-2 cursor-pointer transition ${
                                    rutinaSeleccionada && rutinaSeleccionada.id === r.id
                                        ? "bg-teal-300 border border-teal-300"
                                        : "hover:bg-gray-100"
                                }`}
                                onClick={() => setRutinaSeleccionada(r)}
                            >
                                <span className="font-inter font-medium">{r.nombre}</span>
                                {rutinaSeleccionada && rutinaSeleccionada.id === r.id && (
                                    <span className="text-neutral-500 font-bold">Seleccionada</span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button
                className={`w-full py-2 rounded-lg font-semibold transition ${
                    rutinaSeleccionada
                        ? "bg-teal-300 text-white hover:bg-teal-300"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!rutinaSeleccionada || loading}
                onClick={handleAsignRoutine}
                type="button"
            >
                Seleccionar rutina
            </button>
        </div>
    );
}