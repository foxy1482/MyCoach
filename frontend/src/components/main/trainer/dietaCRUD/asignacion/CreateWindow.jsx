import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { GetUserID } from "../../../../../utils/getUser";
import { ShowSvg } from "../../../../utilities/ShowSvg";
import { GetAllDiets } from "../../../../../utils/getDiet";
import { ModalListFoods } from "./ModalListFoods";
import { API_URL } from "../../../../../utils/config";

export function CreateWindow({ dietaActual, onSave, onClose }) {
    const [comidas, setComidas] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [nuevaComida, setNuevaComida] = useState({
        "dieta_id" : dietaActual.id
    });
    const [comidaFinal, setComidaFinal] = useState(null);
    const [dietas, setDietas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [seleccion, setSeleccion] = useState(dietaActual.id);
    const [pantallaNueva, setPantallaNueva] = useState(false);

    // Nuevo estado para el formulario extra


    let token = Cookies.get("token");

    useEffect(() => {
        const fetchRutinas = async () => {
            setLoading(true);
            try {
                const clienteData = await GetUserID(token);
                const res = await fetch(`${API_URL}/api/dietas/comida/`);
                const dietasData = await GetAllDiets();
                setDietas(dietasData);
                setSeleccion(dietas[0].id);

                const data = await res.json();
                setComidas(data);
            } catch (err) {
                setComidas([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRutinas();
    }, []);

    const handleAsignMeal = async (e) => {
        e.preventDefault();

        const res = await onSave("POST", nuevaComida, setLoading);
        setComidaFinal(res)

        setPantallaNueva(true);        
    };
    
    const elegirAlimentos = ()=>
    (
        <ModalListFoods
            comida={comidaFinal}
            pantallaNueva={pantallaNueva}
            setPantallaNueva={setPantallaNueva}
            onClose={onClose}
        ></ModalListFoods>
    )
    return (
        <div className="fixed z-20 inset-0 flex items-center justify-center bg-black/50">
            {!pantallaNueva ? (
                <div className="bg-white p-4 rounded-lg shadow-lg">
                    <div className="form-header max-w-64 mb-6">
                        <h2 className="font-bold font-inter text-2xl w-full">Crear una comida</h2>
                    </div>
                <form onSubmit={handleAsignMeal}>
                    <div className="form-inputs flex flex-col gap-y-4">
                    <div className="input flex flex-row w-auto">
                        <label htmlFor="form-nombre" className="my-auto w-16 font-semibold font-inter text-secondary/80">Nombre</label>
                        <input
                            id="form-nombre"
                            type="text"
                            onChange={(e) => setNuevaComida(prev => ({ ...prev, nombre: e.target.value }))}
                            className="border border-transparent px-2 my-auto border-b-2 border-b-neutral-600 w-fit font-coda focus:outline-0 focus:border-b-primary focus:scale-110 mx-4 transition"
                        />
                    </div>
                    <div className="input flex flex-row w-auto">
                        <label htmlFor="form-opciones_dieta" className="my-auto w-16 font-semibold font-inter text-secondary/80">Dieta</label>
                        <select
                            id="form-opciones_dieta"
                            value={seleccion}
                            onChange={(e)=> {
                                setSeleccion(Number(e.target.value))
                                setNuevaComida(prev => ({ ...prev, dieta_id: seleccion}))
                            }}
                            className="px-2 my-auto border-b-2 border-b-neutral-600 w-fit font-coda focus:scale-110 mx-4 transition"
                        >
                            {dietas.map((opcion) =>
                            (
                                <option key={opcion.id} value={opcion.id}>
                                    {opcion.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input flex flex-row w-auto">
                        <label htmlFor="form-orden" className="my-auto w-16 font-semibold font-inter text-secondary/80">Orden</label>
                        <input
                            id="form-orden"
                            type="number"
                            onChange={(e) => setNuevaComida(prev => ({ ...prev, orden: e.target.value }))}
                            className="border border-transparent px-2 my-auto border-b-2 border-b-neutral-600 w-fit font-coda focus:outline-0 focus:border-b-primary focus:scale-110 mx-4 transition"
                        />
                    </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 px-4 py-2 rounded cursor-pointer border border-transparent transition hover:bg-neutral-600 hover:border-gray-300 hover:text-gray-300"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer border border-transparent transition hover:bg-white hover:border-blue-500 hover:text-blue-500"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
                </div>
            ) : elegirAlimentos()}
        </div>
    );
}