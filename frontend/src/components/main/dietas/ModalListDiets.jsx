import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { GetUserID } from "../../../utils/getUser";
import { ShowSvg } from "../../utilities/ShowSvg";
import { GetRoutineAsignationData } from "../../../utils/getRoutine";
import { GetAllDiets } from "../../../utils/getDiet";
import { API_URL } from "../../../utils/config";

export function ModalListDiets({ action, nuevaDieta, setNuevaDieta, dieta, setDieta, alumnoActivo, setAlumnoActivo }) {
    const [dietas, setDietas] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [dietaSeleccionada, setDietaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(false);

    const token = Cookies.get("token");

    // Obtener dietas al montar
    useEffect(() => {
        const fetchdietas = async () => {
            setLoading(true);
            try {
                const clienteData = await GetUserID(token);

                const res = await GetAllDiets();
                const data = await res.json();
                setDietas(data);
            } catch (err) {
                setDietas([]);
            } finally {
                setLoading(false);
            }
        };
        fetchdietas();
    }, []);
    
    // Filtrar dietas por nombre
    const dietasFiltradas = dietas.filter(r =>
        r.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    // Asignar dieta al alumno
    const handleAsignDiet = async () => {
        if (!dietaSeleccionada) return;
        setLoading(true);
        try {
            const cliente_id = alumnoActivo.id;
            const dieta_id = dietaSeleccionada.id;
            
            const fechaHoy = new Date().toISOString();
            const fecha_asignacion = fechaHoy.slice(0,10);

            await fetch(`${API_URL}/api/clientes/cliente_dieta/asignar/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "clienteDieta": {
                        cliente_id,
                        dieta_id,
                        fecha_asignacion
                    },
                    data: { token }
                })
            });
            setDieta(dietaSeleccionada);
            setNuevaDieta(false);
        } catch (err) {
            alert("Error asignando dieta");
        } finally {
            setLoading(false);
        }
    };
    const handleModifyAsign = async ()=>{
        if (!dietaSeleccionada) return;
        setLoading(true);
        try {
            const cliente_id = alumnoActivo.id;
            const dieta_id = dietaSeleccionada.id;

            const fechaHoy = new Date().toISOString();
            const fecha_asignacion = fechaHoy.slice(0,10);

            const response = await fetch(`${API_URL}/api/clientes/cliente_dieta/${cliente_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    cliente_dieta_data: {
                        dieta_id,
                        fecha_asignacion
                    },
                    data : { token }
                })
            });
            setDieta(dietaSeleccionada);
            setNuevaDieta(false);
        } catch (e)
        {
            console.log("Error modificando la asignacion: ", e)    
        }
        finally
        {
            setLoading(false);
        }
    }

    return (
        <div className="p-6 w-full max-w-lg bg-white rounded-xl shadow-lg flex flex-col gap-4 m-auto">
            <button onClick={() => setNuevaDieta(false)} className="bg-red-400 rounded-full text-white hover:bg-neutral-500 cursor-pointer transition w-fit">
                <ShowSvg size="20" name="cross"></ShowSvg>
            </button>
            <h2 className="text-xl font-bold mb-2 text-teal-300">Selecciona una dieta</h2>
            <input
                type="text"
                placeholder="Filtrar por nombre..."
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
                className="mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
            <div className="overflow-y-auto max-h-72 mb-4">
                {loading ? (
                    <p className="text-center text-gray-500">Cargando dietas...</p>
                ) : dietasFiltradas.length === 0 ? (
                    <p className="text-center text-gray-400">No hay dietas para mostrar.</p>
                ) : (
                    <ul>
                        {dietasFiltradas.map(r => (
                            <li
                                key={r.id}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg mb-2 cursor-pointer transition ${
                                    dietaSeleccionada && dietaSeleccionada.id === r.id
                                        ? "bg-teal-300 border border-teal-300"
                                        : "hover:bg-gray-100"
                                }`}
                                onClick={() => setDietaSeleccionada(r)}
                            >
                                <span className="font-inter font-medium">{r.nombre}</span>
                                {dietaSeleccionada && dietaSeleccionada.id === r.id && (
                                    <span className="text-neutral-500 font-bold">Seleccionada</span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button
                className={`w-full cursor-pointer py-2 rounded-lg font-semibold transition ${
                    dietaSeleccionada
                        ? "bg-teal-300 text-white hover:bg-teal-300"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!dietaSeleccionada || loading}
                onClick={action == "ASIGN" ? handleAsignDiet : action == "MODIFY" ? handleModifyAsign : ""}
                type="button"
            >
                Seleccionar dieta
            </button>
        </div>
    );
}