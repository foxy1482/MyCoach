import React, { act, useEffect, useState } from "react"
import { GetUserByID } from "../../../utils/getUser";
import { LoadAllIcons } from "../../utilities/LoadCRUDIcons";
import { GetExerciseData, ListRExercises } from "../../../utils/getRoutine";
import { GetPlanByID } from "../../../utils/getPlan";
import { ShowSvg } from "../../utilities/ShowSvg";
import { useNavigate } from "react-router-dom";
import '../../../../css/StyleTrainerRoutine.css'
import { ModifyWindowR } from './rutinaCRUD/ModifyWindow.jsx'
import { ModifyWindow } from './rutinaCRUD/asignacion/ModifyWindow.jsx'
import { DeleteWindow } from './rutinaCRUD/asignacion/DeleteWindow.jsx'
import { CreateWindow } from "./rutinaCRUD/asignacion/CreateWindow.jsx";
import { DeleteWindowR } from "./rutinaCRUD/DeleteWindow.jsx";


export function RoutineBox({ rutina, token, activeWindowDelete, setActiveWindowDelete, activeRoutineWindowDelete, setActiveRoutineWindowDelete, handleSaveRutina })
{
    const [usuario, setUsuario] = useState(null);
    const [ejercicios, setEjercicios] = useState({});
    const [plan, setPlan] = useState({});
    const [esEntrenador, setEsEntrenador] = useState(false);

    const [activeRoutineWindowModify,  setActiveRoutineWindowModify] = useState(null);

    const [activeWindowCreate, setActiveWindowCreate] = useState(false);
    const [activeWindowModify, setActiveWindowModify] = useState(false);
    const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null);

    const navigate = useNavigate();
    useEffect(()=>
    {
        if (!token)
        {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                
                const planData = await GetPlanByID(rutina.plan_id);
                setPlan(planData)

                const ejerciciosData = await ListRExercises(rutina.id);
                let detalles = [];
                for (const e of ejerciciosData) {
                    const detalle = await GetExerciseData(rutina.id, e.id);

                    detalles.push({ ...detalle, nombre: e.nombre, grupo_muscular: e.grupo_muscular });
                }

                const agrupados = detalles.reduce((acc, ej) => {
                    if (!acc[ej.dia]) acc[ej.dia] = {};
                    if (!acc[ej.dia][ej.grupo_muscular]) acc[ej.dia][ej.grupo_muscular] = [];
                    acc[ej.dia][ej.grupo_muscular].push(ej);
                    return acc;
                }, {});

                setEjercicios(agrupados);
            } catch (error) {
                console.error('Error obteniendo cliente:', error);
            }
        }
    fetchData();
    },[token,navigate, ejercicios.length, rutina?.id, activeWindowModify, activeWindowDelete, activeWindowCreate])

    const handleSaveAsignacion = async (action, newValue = null, setLoading = null)=>{
        if (action == "POST")
        {
            if (!newValue) return;
            try {
                const rutina_id = rutina.id;
                const ejercicio_id = newValue.id;
                
                await fetch("/api/api/rutinas/asignar_ejercicio", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        "rutina_ejercicio": {
                            rutina_id: rutina_id,
                            ejercicio_id: ejercicio_id,
                            dia: newValue.dia,
                            series: newValue.series,
                            repeticiones: newValue.repeticiones,
                            rir: newValue.rir
                        },
                        data: { token }
                    })
                });
            } catch (err) {
                alert("Error asignando rutina");
            } finally {
                setLoading(false);
            }
        }
        else if (action == "PUT")
        {
            const responseModEj = await fetch(`/api/api/rutinas/${rutina.id}/${ejercicioSeleccionado.ejercicio_id}/modificar/`,
                {
                    method: 'PUT',
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify({ "rutina_ejercicio_data" :
                        {
                            "dia" : newValue.dia,
                            "series" : newValue.series,
                            "repeticiones" : newValue.repeticiones,
                            "rir" : newValue.rir
                        }
                    , "data" : { token }})
                }
            );
            const dataRes = await responseModEj.json();
            return dataRes;
        }
        else if (action == "DELETE")
        {
            const responseElimEj = await fetch(`/api/api/rutinas/${rutina.id}/${ejercicioSeleccionado.ejercicio_id}/eliminar/`,
                {
                    method: 'DELETE',
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify({token})
                }
            );
            const dataRes = await responseElimEj.json();
            return dataRes;
        }
    }

    

    const retornarInformacion = ()=>
        (
            <div className="info p-3.5 grid grid-rows-3 lg:grid-cols-2 lg:grid-rows-2">
                <p className="font-inter text-3xl py-2 col-span-2 font-bold lg:col-span-1 m-auto text-center">{rutina.nombre}</p>
                <div className="flex flex-col lg:justify-center row-span-2 row-start-3 col-start-2 gap-6 lg:row-start-1 h-full">
                        <button onClick={()=> setActiveWindowCreate(true)} className="cursor-pointer ml-auto lg:mx-auto flex flex-row bg-primary text-white justify-center w-46 px-4 py-2 rounded-lg font-medium hover:bg-secondary transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 items-center space-x-2">
                            <span className="font-normal font-chalet-paris text-3xl">+</span>
                            <span className="font-inter font-semibold text-nowrap">Agregar ejercicio</span>
                        </button>
                        <button onClick={()=> setActiveRoutineWindowModify(true)} className="cursor-pointer ml-auto lg:mx-auto flex flex-row bg-yellow-300/25 text-white justify-center w-46 px-4 py-2 rounded-lg font-medium hover:bg-yellow-300/50 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 items-center space-x-2">
                            <ShowSvg name={"modify"} size={16}></ShowSvg>
                            <span className="font-inter font-semibold text-neutral-600">Modificar</span>
                        </button>
                        <button onClick={()=> setActiveRoutineWindowDelete(true)} className="cursor-pointer ml-auto lg:mx-auto flex flex-row bg-red-500/10 text-white justify-center w-46 px-4 py-2 rounded-lg font-medium hover:bg-red-500/20 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 items-center space-x-2">
                            <ShowSvg name={"delete"} size={16} className="text-red-400"></ShowSvg>
                            <span className="font-inter font-semibold text-red-400">Eliminar</span>
                        </button>
                    </div>
                <div className="icons flex flex-row col-span-2 gap-x-4 lg:col-span-1 lg:flex-col xl:flex-row mx-auto">
                    <div className="font-inter text-lg text-gray-600 py-2 flex items-center">
                        <div className="size-3 bg-primary rounded-full mr-2"></div>
                        Plan {plan.nombre}
                    </div>
                    
                    <div className="font-inter text-lg text-gray-600 py-2 flex items-center">
                        {rutina.es_personalizada ? (
                            <ShowSvg name={"custom"} size={24} className="fill-purple-500 stroke-purple-500 text-purple-500 mr-1"></ShowSvg>
                        ) : (
                            <div className="size-3 mr-2 bg-amber-400 rounded-full my-auto"></div>
                        )}
                        <span className={`mr-1`}>{rutina.es_personalizada ? "Personalizada" : "General"}</span>
                    </div>
    
                </div>
            </div>
        )
    
        const retornarEjercicios = ()=>
        {
            return Object.entries(ejercicios).map(([dia, grupos]) => (
                <div key={dia} className="dia-container mt-12">
                    <h2 className="text-2xl font-bold text-center my-4">{dia}</h2>
                    {Object.entries(grupos).map(([grupo, ejerciciosG]) => (
                    <div key={grupo} className={`max-w-2xl mx-auto grupo-muscular rounded-lg ${Object.entries(grupos).length > 1 ? "mb-12" : ""}`}>
                        <ul className="ejercicios-lista flex flex-col gap-y-4">
                        {ejerciciosG
                        .filter(ej => ej?.nombre && ej?.series && ej?.repeticiones)
                        .map((ej, index) => (
                            <li key={ej.id} className="ejercicios-lista__li group flex flex-col p-4 rounded-xl bg-white shadow-lg hover:bg-primary/5 transition hover:scale-110 duration-150">
                            <div className="items-center flex flex-row font-inter text-lg text-center w-full">
                                <div className="flex flex-row items-center m-auto">
                                    <span className="items-center font-inter my-auto font-semibold">{ej.nombre}</span>
                                </div>
                                <div className="col-start-2 buttons flex flex-row gap-x-2 ml-auto w-fit">
                                    <button onClick={()=> {
                                        setActiveWindowModify(true);
                                        setEjercicioSeleccionado(ej);
                                    }} className="flex justify-center cursor-pointer">
                                        <ShowSvg name={"modify"} size={20}></ShowSvg>
                                    </button>
                                    <button onClick={()=>
                                        {setActiveWindowDelete(true);
                                        setEjercicioSeleccionado(ej);
                                        }} className="flex justify-center cursor-pointer">
                                        <ShowSvg name={"delete"} size={20} className="transition hover:text-red-500"></ShowSvg>
                                    </button>
                                </div>
                            </div>
                            <div className="icons flex flex-col gap-x-4 lg:flex-row">
                                <div className="items-center font-inter text-sm text-center flex flex-row">
                                    <ShowSvg name={"bars"} size={16} className="fill-primary"></ShowSvg>
                                    <span className="font-semibold mx-1">{ej.series}</span>
                                    <span className="text-sm">Series</span>
                                </div>
                                <div className="items-center font-inter text-sm text-center flex flex-row">
                                    <ShowSvg name={"rutinas"} size={16} className="text-orange-500"></ShowSvg>
                                    <span className="font-semibold mx-1">{ej.repeticiones}</span>
                                    <span className="text-sm">Reps</span>
                                </div>
                                <div className="items-center font-inter text-sm text-center flex flex-row">
                                    <ShowSvg name={"fire"} size={16} className="text-orange-500"></ShowSvg>
                                    <span className="text-sm mx-1">RIR</span>
                                    <span className="font-semibold">{ej.rir}</span>
                                </div>
                                <div className="flex w-full justify-end gap-x-1 flex-col lg:flex-row">
                                    <span className="text-sm w-fit p-3 my-auto h-fit rounded-xl bg-primary/10 text-primary font-bold">{grupo}</span>
                                    <span className="font-coda w-fit my-auto h-fit text-sm bg-secondary text-white rounded-xl p-2">ID {ej.id}</span>
                                </div>
                            </div>
                            </li>
                        ))}
                        </ul>
                    </div>
                    ))}
                </div>
            ))
        }
        return (
            <React.Fragment>
            <div className="routine-info m-8 bg-white rounded-2xl shadow-lg p-8 md:row-span-2">
                {Object.keys(rutina).length > 0 ? retornarInformacion() : (
                    <div className="rounded-lg">
                    <p className="font-inter text-lg">Cargando datos..</p>
                    </div>
                )}
            </div>
            <div className="routine-details m-8 p-3 md:row-span-2">
                <h2 className="font-inter bg-primary/50 py-2 rounded-3xl text-center text-black/40 font-bold text-[1.75rem] my-6">Ejercicios</h2>
                <div className="flex flex-col xl:grid 2xl:grid-cols-2 gap-x-12">
                    {Object.keys(ejercicios).length > 0 ? retornarEjercicios() : <p className="font-coda">No hay ejercicios.</p> }
                </div>
            </div>
            { activeWindowCreate ? (
                <CreateWindow
                    onClose={()=> setActiveWindowCreate(false)}
                    onSave={handleSaveAsignacion}
                ></CreateWindow>
            ) : activeRoutineWindowModify ? (
                <ModifyWindowR
                    isOpen={true}
                    rutina={rutina}
                    onClose={()=> setActiveRoutineWindowModify(false)}
                    onSave={handleSaveRutina}
                ></ModifyWindowR>
            ) : activeRoutineWindowDelete ? (
                <DeleteWindowR
                    isOpen={true}
                    rutina={rutina}
                    onClose={()=> setActiveRoutineWindowDelete(false)}
                    onSave={handleSaveRutina}
                />
            ) : activeWindowModify ? (
                <ModifyWindow
                    isOpen={true}
                    asignacion={ejercicioSeleccionado}
                    onClose={() => setActiveWindowModify(false)}
                    onSave={handleSaveAsignacion}
                ></ModifyWindow>
            ) : activeWindowDelete ? (
                <DeleteWindow
                    isOpen={true}
                    asignacion={ejercicioSeleccionado}
                    onClose={() => setActiveWindowDelete(false)}
                    onSave={handleSaveAsignacion}
                ></DeleteWindow>
            ) : ""}
            </React.Fragment>
        )
}