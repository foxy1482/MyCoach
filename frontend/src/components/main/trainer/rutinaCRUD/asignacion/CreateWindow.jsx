import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { GetUserID } from "../../../../../utils/getUser";
import { ShowSvg } from "../../../../utilities/ShowSvg";
import { API_URL } from "../../../../../utils/config"; 

export function CreateWindow({ onSave, onClose }) {
    const [ejercicios, setEjercicios] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [nuevoEjercicio, setNuevoEjercicio] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pantallaNueva, setPantallaNueva] = useState(null);

    // Nuevo estado para el formulario extra
    const [formData, setFormData] = useState({
        dia: "",
        series: "",
        repeticiones: "",
        rir: "",
    });

    let token = Cookies.get("token");

    useEffect(() => {
        const fetchRutinas = async () => {
            setLoading(true);
            try {
                const clienteData = await GetUserID(token);
                const res = await fetch(`${API_URL}/api/rutinas/ejercicios/`);
                const data = await res.json();
                setEjercicios(data);
            } catch (err) {
                setEjercicios([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRutinas();
    }, []);

    const rutinasFiltradas = ejercicios.filter(r =>
        r.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    const handleAsignExercise = async (e) => {
        e.preventDefault();

        // Paso 1: Actualiza el objeto ejercicio con los datos del formulario
        const ejercicioCompleto = {
            ...nuevoEjercicio,
            ...formData,
        };
        
        // Paso 2: Llama al onSave para enviarlo al componente padre o backend
        await onSave("POST", ejercicioCompleto, setLoading);
        
        // Cierra modal o hace otras acciones
        onClose();
    };

    // Manejar cambios en el formulario extra
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Guardar datos del formulario en nuevoEjercicio
    const handleSaveForm = (e) => {
        e.preventDefault();
        setNuevoEjercicio(prev => ({
            ...prev,
            ...formData
        }));
    };

    return (
        <div className="fixed z-20 inset-0 flex items-center justify-center bg-black/50">
            <div className="p-6 w-full max-w-lg bg-white rounded-xl shadow-lg flex flex-col gap-4 m-auto">
                <button onClick={() => onClose()} className="bg-red-400 rounded-full text-white hover:bg-neutral-500 cursor-pointer transition w-fit">
                    <ShowSvg size="20" name="cross"></ShowSvg>
                </button>
                {!pantallaNueva ? (
                    <>
                        <h2 className="text-xl font-bold mb-2 text-primary">Selecciona un ejercicio</h2>
                        <input
                            type="text"
                            placeholder="Filtrar por nombre..."
                            value={filtro}
                            onChange={e => setFiltro(e.target.value)}
                            className="mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <div className="overflow-y-auto max-h-72 mb-4">
                            {loading ? (
                                <p className="text-center text-gray-500">Cargando ejercicios...</p>
                            ) : rutinasFiltradas.length === 0 ? (
                                <p className="text-center text-gray-400">No hay ejercicios para mostrar.</p>
                            ) : (
                                <ul>
                                    {rutinasFiltradas.map(r => (
                                        <li
                                            key={r.id}
                                            className={`flex items-center justify-between px-3 py-2 rounded-lg mb-2 cursor-pointer transition ${
                                                nuevoEjercicio && nuevoEjercicio.id === r.id
                                                    ? "bg-primary border border-primary"
                                                    : "hover:bg-gray-100"
                                            }`}
                                            onClick={() => setNuevoEjercicio(r)}
                                        >
                                            <span className="font-inter font-medium">{r.nombre}</span>
                                            {nuevoEjercicio && nuevoEjercicio.id === r.id && (
                                                <span className="text-neutral-500 font-bold">Seleccionada</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <button
                            className="w-full cursor-pointer py-2 rounded-lg font-semibold transition bg-primary text-white hover:bg-primary mt-2"
                            disabled={loading}
                            onClick={()=> setPantallaNueva(true)}
                            type="button"
                        >
                            Seleccionar ejercicio
                        </button>
                    </>
                ) : (
                    // Modal extra para datos del ejercicio
                    <form onSubmit={handleSaveForm} className="flex flex-col gap-4">
                        <h2 className="text-xl font-bold mb-2 text-primary">Completa los datos del ejercicio</h2>
                        <div className="form-input flex flex-row w-auto">
                            <label htmlFor="form-dia" className="my-auto w-16 font-semibold font-inter text-secondary/80">Día</label>
                            <input
                                id="form-dia"
                                type="text"
                                name="dia"
                                value={formData.dia}
                                onChange={handleFormChange}
                                className="border border-transparent px-2 my-auto border-b-2 border-b-neutral-600 w-fit font-coda focus:outline-0 focus:border-b-primary focus:scale-110 mx-4 transition"
                                required
                            />
                        </div>
                        <div className="form-input flex flex-row w-auto">
                            <label htmlFor="form-series" className="my-auto w-16 font-semibold font-inter text-secondary/80">Series</label>
                            <input
                                id="form-series"
                                type="number"
                                name="series"
                                value={formData.series}
                                onChange={handleFormChange}
                                className="border border-transparent px-2 my-auto border-b-2 border-b-neutral-600 w-fit font-coda focus:outline-0 focus:border-b-primary focus:scale-110 mx-4 transition"
                                min="1"
                                required
                            />
                        </div>
                        <div className="form-input flex flex-row w-auto">
                            <label htmlFor="form-reps" className="my-auto w-16 font-semibold font-inter text-secondary/80">Reps</label>
                            <input
                                id="form-reps"
                                type="number"
                                name="repeticiones"
                                value={formData.repeticiones}
                                onChange={handleFormChange}
                                className="border border-transparent px-2 my-auto border-b-2 border-b-neutral-600 w-fit font-coda focus:outline-0 focus:border-b-primary focus:scale-110 mx-4 transition"
                                min="1"
                                required
                            />
                        </div>
                        <div className="form-input flex flex-row w-auto">
                            <label htmlFor="form-reps" className="my-auto w-16 font-semibold font-inter text-secondary/80">RIR</label>
                            <input
                                type="number"
                                name="rir"
                                value={formData.rir}
                                onChange={handleFormChange}
                                className="border border-transparent px-2 my-auto border-b-2 border-b-neutral-600 w-fit font-coda focus:outline-0 focus:border-b-primary focus:scale-110 mx-4 transition"
                                min="0"
                                required
                            />
                        </div>
                        
                    </form>
                )}
                {/* Botón para guardar el ejercicio solo si ya tiene los datos extra */}
                {nuevoEjercicio && formData.dia && formData.series && formData.repeticiones && formData.rir ? (
                    <button
                        className="w-full cursor-pointer py-2 rounded-lg font-semibold transition bg-primary text-white hover:bg-primary mt-2"
                        disabled={loading}
                        onClick={handleAsignExercise}
                        type="button"
                    >
                        Seleccionar ejercicio
                    </button>
                ) : nuevoEjercicio && pantallaNueva ? (
                    <button
                        className="w-full cursor-not-allowed py-2 rounded-lg font-semibold transition bg-neutral-700 text-neutral-300 hover:bg-neutral-500 mt-2"
                        disabled={true}
                        type="button"
                    >
                        Seleccionar ejercicio
                    </button>
                ) : ""}
            </div>
        </div>
    );
}