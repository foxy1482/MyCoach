import React, { useState } from "react"
import { ShowSvg } from "../../../utilities/ShowSvg"
import '../../../../../css/ClientModalMeal.css'
import { GetMealFoodAD } from "../../../../utils/getDiet";
import { ModalListFoods } from "./asignacion/ModalListFoods";
import { API_URL } from "../../../../utils/config";

export function ClientModalMeal({ comida, modalActivo, setModalActivo, startReload, reload, token }) {
    const [editMode, setEditMode] = useState(false);
    const [selectedAlimentos, setSelectedAlimentos] = useState({});
    const [newValues, setNewValues] = useState({});
    const [eliminarAlimento, setEliminarAlimento] = useState(false);
    const [alimentosAEliminar, setAlimentosAEliminar] = useState([]);
    const [agregarAlimento, setAgregarAlimento] = useState(false);

    // Seleccionar/deseleccionar alimentos para editar
    const handleSelectAlimento = (alimento) => {
        setSelectedAlimentos(prev => ({
            ...prev,
            [alimento.id]: !prev[alimento.id]
        }));
        setNewValues(prev => ({
            ...prev,
            [alimento.id]: prev[alimento.id] ?? alimento.cantidad_g
        }));
    };

    // Cambiar cantidad de un alimento seleccionado
    const handleCantidadChange = (alimentoId, cantidad) => {
        setNewValues(prev => ({
            ...prev,
            [alimentoId]: cantidad
        }));
    };

    // Guardar cambios de todos los seleccionados
    const handleSubmit = async (e) => {
        e.preventDefault();
        for (const alimentoId of Object.keys(selectedAlimentos).filter(id => selectedAlimentos[id])) {
            const alimento = comida.alimentos.find(a => a.id === Number(alimentoId));
            const asignData = await GetMealFoodAD(comida.comida_id, alimento.id);
            await fetch(`${API_URL}/api/dietas/comida/${asignData.id}/alimento/modificar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "dieta_comidaalimento_data": {
                        "dieta_comida_id": comida.id,
                        "alimento_id": alimento.id,
                        "cantidad_g": newValues[alimentoId]
                    },
                    "data": { token }
                })
            });
        }
        if (reload) startReload(false);
        else if (!reload) startReload(true);
        setModalActivo(false);
    };

    // Seleccionar/deseleccionar alimentos para eliminar
    const handleSelectEliminar = (alimento) => {
        setAlimentosAEliminar(prev => {
            if (prev.includes(alimento.id)) {
                return prev.filter(id => id !== alimento.id);
            } else {
                return [...prev, alimento.id];
            }
        });
    };

    const handleDelete = async () => {
        for (const alimentoId of alimentosAEliminar) {
            const alimento = comida.alimentos.find(a => a.id === Number(alimentoId));
            const asignData = await GetMealFoodAD(comida.comida_id, alimento.id);
            await fetch(`${API_URL}/api/dietas/comida/${asignData.id}/alimento/eliminar`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            });
        }
        if (reload) startReload(false);
        else if (!reload) startReload(true);
        setModalActivo(false);
    };

    const agregarAlimentos = ()=>
        (
            <ModalListFoods
                comida={comida}
                pantallaNueva={agregarAlimento}
                setPantallaNueva={setAgregarAlimento}
                onClose={()=> setModalActivo(false)}
                reload={reload}
                startReload={startReload}
            ></ModalListFoods>
        )

    return (
        <div className="oscuro fixed top-0 left-0 size-full z-20 flex bg-black/80 font-inter">
            {agregarAlimento ? (
                <div className="fixed top-0 left-0 bg-black/20 size-full flex justify-items-center">{agregarAlimentos()}</div>
            ) : ""}
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden font-inter m-auto">
                <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">{comida.nombre_comida}</h2>
                        <button onClick={() => setModalActivo(null)} className="bg-red-400 rounded-full text-white hover:bg-neutral-500 cursor-pointer transition">
                            <ShowSvg size="20" name="cross"></ShowSvg>
                        </button>
                    </div>
                    <div className="text-green-100 mt-2">
                        {"Total - " + comida.calorias_totales.toFixed(0) + " kcal"}
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-96">
                    <div className="flex gap-2 mb-4">
                        <button
                            className={`cursor-pointer px-3 py-1 rounded-lg font-semibold ${agregarAlimento ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
                            onClick={() => { setAgregarAlimento(true); setEditMode(false); setEliminarAlimento(false); setSelectedAlimentos({}); setAlimentosAEliminar([]);}}
                        >
                            <span className="font-doppio-one text-bold text-3xl m-auto">+</span>
                        </button>
                        <button
                            className={`cursor-pointer px-3 py-1 rounded-lg font-semibold ${editMode ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
                            onClick={() => { setEditMode(true); setEliminarAlimento(false); setSelectedAlimentos({}); setAlimentosAEliminar([]); }}
                        >
                            <ShowSvg name={"modify"} size={24}></ShowSvg>
                        </button>
                        <button
                            className={`cursor-pointer px-3 py-1 rounded-lg font-semibold ${eliminarAlimento ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"}`}
                            onClick={() => { setEliminarAlimento(true); setEditMode(false); setSelectedAlimentos({}); setAlimentosAEliminar([]); }}
                        >
                            <ShowSvg name={"delete"} size={24}></ShowSvg>
                        </button>
                        {(editMode || eliminarAlimento) && (
                            <button
                                className="px-2 rounded-full font-semibold flex justify-center cursor-pointer text-gray-700 bg-red-400 hover:bg-red-500 transition"
                                onClick={() => { setEditMode(false); setEliminarAlimento(false); setSelectedAlimentos({}); setAlimentosAEliminar([]); }}
                            >
                                <ShowSvg name={"cross"} size={24} className="m-auto"></ShowSvg>
                            </button>
                        )}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <ul className="space-y-4">
                            {comida.alimentos.map((alimento) => (
                                <li key={alimento.id} className={
                                    "modal-meal__alimento gap-1 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition duration-200 flex items-center"
                                }>
                                    {editMode ? (
                                        <>
                                            <input
                                                type="checkbox"
                                                checked={!!selectedAlimentos[alimento.id]}
                                                onChange={() => handleSelectAlimento(alimento)}
                                                className="mr-2 accent-primary"
                                            />
                                            <div className="flex items-center space-x-4 mr-auto">
                                                <div className="size-3 bg-primary rounded-full"></div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{alimento.nombre}</h4>
                                                    <div className="w-fit flex flex-row">
                                                        <input
                                                            type="number"
                                                            value={newValues[alimento.id] ?? alimento.cantidad_g}
                                                            onChange={e => handleCantidadChange(alimento.id, e.target.value)}
                                                            className="text-sm text-gray-600 rounded-lg border border-neutral-500/50 px-3"
                                                            disabled={!selectedAlimentos[alimento.id]}
                                                        />
                                                        g
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : eliminarAlimento ? (
                                        <>
                                            <input
                                                type="checkbox"
                                                checked={alimentosAEliminar.includes(alimento.id)}
                                                onChange={() => handleSelectEliminar(alimento)}
                                                className="mr-2 accent-red-500"
                                            />
                                            <div className="flex items-center space-x-4 mr-auto">
                                                <div className="size-3 bg-primary rounded-full"></div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{alimento.nombre}</h4>
                                                    <p className="text-sm text-gray-600">{alimento.cantidad_g} g</p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center space-x-4 mr-auto">
                                                <div className="size-3 bg-primary rounded-full"></div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{alimento.nombre}</h4>
                                                    <p className="text-sm text-gray-600">{alimento.cantidad_g} g</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <div className="flex flex-col my-auto text-right ml-auto">
                                        <p className="font-bold text-primary">{((alimento.cantidad_g / 100) * alimento.calorias_100g).toFixed(0) + " kcal"}</p>
                                        <div className="macros text-xs text-gray-500 flex flex-row gap-x-2">
                                            <span className="text-primary">{((alimento.cantidad_g / 100) * alimento.carbohidratos).toFixed(2) + " g"}</span>
                                            <span className="text-orangeM">{((alimento.cantidad_g / 100) * alimento.proteinas).toFixed(2) + " g"}</span>
                                            <span className="text-primary">{((alimento.cantidad_g / 100) * alimento.grasas).toFixed(2) + " g"}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {editMode && (
                            <div className="send-changes flex flex-row justify-end mt-4">
                                <button
                                    type="submit"
                                    className="bg-orangeM px-3 py-1 rounded-lg text-white font-inter font-semibold cursor-pointer hover:bg-orangeM/80 transition"
                                    disabled={Object.keys(selectedAlimentos).filter(id => selectedAlimentos[id]).length === 0}
                                >
                                    Aplicar cambios
                                </button>
                            </div>
                        )}
                        {eliminarAlimento && (
                            <div className="send-changes flex flex-row justify-end mt-4">
                                <button
                                    type="button"
                                    className="bg-red-500 px-3 py-1 rounded-lg text-white font-inter font-semibold cursor-pointer hover:bg-red-600 transition"
                                    disabled={alimentosAEliminar.length === 0}
                                    onClick={() => handleDelete()}
                                >
                                    Eliminar seleccionados
                                </button>
                            </div>
                        )}
                    </form>
                    <div className="mt-6 p-4 border-t border-gray-200">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <p className="text-2xl font-bold text-primary">{comida.proteinas_g.toFixed(2) + "g"}</p>
                                <p className="text-sm text-gray-600">Proteínas</p>
                            </div>
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <p className="text-2xl font-bold text-primary">{comida.carbohidratos_g.toFixed(2) + "g"}</p>
                                <p className="text-sm text-gray-600">Carbohidratos</p>
                            </div>
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <p className="text-2xl font-bold text-primary">{comida.grasas_g.toFixed(2) + "g"}</p>
                                <p className="text-sm text-gray-600">Grasas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}