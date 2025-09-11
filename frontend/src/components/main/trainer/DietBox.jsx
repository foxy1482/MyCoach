import React, { act, useEffect, useState } from "react"
import { GetUserByID } from "../../../utils/getUser";
import { LoadAllIcons } from "../../utilities/LoadCRUDIcons";
import { GetExerciseData, ListRExercises } from "../../../utils/getRoutine";
import { GetPlanByID } from "../../../utils/getPlan";
import { ShowSvg } from "../../utilities/ShowSvg";
import { useNavigate } from "react-router-dom";
import '../../../../css/StyleTrainerRoutine.css'
import { DeleteWindow } from './dietaCRUD/asignacion/DeleteWindow.jsx'
import { CreateWindow } from "./dietaCRUD/asignacion/CreateWindow.jsx";
import { ListDietMeals, GetFood, GetFoodCals } from "../../../utils/getDiet.js";
import { ClientModalMeal } from "./dietaCRUD/ClientModalMeal.jsx";
import { ModifyWindowD } from "./dietaCRUD/ModifyWindow.jsx";
import { DeleteWindowD } from "./dietaCRUD/DeleteWindow.jsx";

export function DietBox({ dieta, token, activeWindowDelete, setActiveWindowDelete, activeWindowDeleteD, setActiveWindowDeleteD, handleSaveDieta
    , activeWindowModifyD, setActiveWindowModifyD
    })
{
    const [reload, startReload] = useState(false);
    const [cantComidas, setCantComidas] = useState(0);
    const [macrosTotal, setMacrosTotal] = useState({});
    const [usuario, setUsuario] = useState(null);
    const [comidas, setComidas] = useState({});
    const [comidaModal, setComidaModal] = useState(false);
    const [plan, setPlan] = useState({});
    const [esEntrenador, setEsEntrenador] = useState(false);

    const [activeWindowAsign, setActiveWindowAsign] = useState(false);
    const [activeWindowModifyA, setActiveWindowModifyA] = useState(false);
    const [comidaSeleccionada, setComidaSeleccionada] = useState(null);

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
                const planData = await GetPlanByID(dieta.plan_id);
                setPlan(planData)

                const comidasData = await ListDietMeals(dieta.id);

                const comidasCalsData = await GetFoodCals(dieta.id);
                
                // Le agrega las kcal de cada una
                const comidasFusionadas = await Promise.all(
                    comidasData.map(async (comida) => {
                        
                        let comidaBase = comidasCalsData.find(c => c.comida_id === comida.comida_id);
                    
                        if (!comidaBase) comidaBase = {};
                    
                        const alimentosConMacros = await Promise.all(
                            comida.alimentos.map(async (alimento) => {
                                const alimentoInfo = await GetFood(alimento.id);
                            
                                return {
                                    ...alimento,
                                    ...alimentoInfo
                                };
                            })
                        );
                    
                        return {
                            ...comida,
                            ...comidaBase,
                            alimentos: alimentosConMacros
                        };
                    })
                );

                const totalComidas = comidasFusionadas.length;
                const totalKcal = comidasFusionadas.reduce((acum, comida) => acum + comida.calorias_totales, 0);
                const totalCarb = comidasFusionadas.reduce((acum, comida) => acum + comida.carbohidratos_g, 0);
                const totalProte = comidasFusionadas.reduce((acum, comida) => acum + comida.proteinas_g, 0);
                const totalGrasa = comidasFusionadas.reduce((acum, comida) => acum + comida.grasas_g, 0);
                            
                setComidas(comidasFusionadas);
                setMacrosTotal({
                    "calorias": totalKcal,
                    "carbohidratos" : totalCarb,
                    "proteinas" : totalProte,
                    "grasas" : totalGrasa
                });
                setCantComidas(totalComidas);

            } catch (error) {
                console.error('Error obteniendo cliente:', error);
            }
        }
    fetchData();
    },[token,navigate, comidas.length, dieta?.id, activeWindowModifyA, activeWindowDelete, activeWindowAsign, reload])

    const handleSaveAsignacion = async (action, newValue = null, setLoading = null, id=null)=>
    {
        if (action == "POST")
        {
            if (!newValue) return;
            try
            {
                const responseAsC = await fetch(`/api/api/dietas/comida/crear/`, {
                    method: "POST",
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify({
                        "comida" : {
                            "nombre" : newValue.nombre,
                            "dieta_id" : newValue.dieta_id,
                            "orden" : newValue.orden,
                        },
                        "data" : {token}
                    })
                })
                const dataRes = responseAsC.json();
                return dataRes;
            } catch (e) {
                console.error("Error asignando dieta: " + e)
            } finally {
                setLoading(false);
            }
        }
        else if (action == "PUT")
        {
            if (!newValue) return;
            try
            {
                const responseAsC = await fetch(`/api/api/dietas/comida/modificar/${newValue.id}`, {
                    method: "POST",
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify({
                        "comida_data" : {
                            "nombre" : newValue.nombre,
                            "dieta_id" : newValue.dieta_id,
                            "orden" : newValue.orden,
                        },
                        "data" : {token}
                    })
                })
                const dataRes = responseAsC.json();
                return dataRes;
            } catch (e) {
                console.error("Error asignando dieta: " + e)
            } finally {
                setLoading(false);
            }
        }
        else if (action == "DELETE")
        {
            const responseAsC = await fetch(`/api/api/dietas/comida/eliminar/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({token})
            })
            const dataRes = responseAsC.json();
            return dataRes;
        }
    }

    const retornarInformacion = ()=>
        (
            <div className="info p-3.5 grid grid-rows-3 lg:grid-cols-2 lg:grid-rows-2">
                <p className="font-inter text-3xl py-2 col-span-2 font-bold lg:col-span-1 m-auto text-center">{dieta.nombre}</p>
                <div className="flex flex-col lg:justify-center row-span-3 row-start-4 col-start-2 gap-6 lg:row-start-1 h-full">
                        <button onClick={()=> setActiveWindowAsign(true)} className="cursor-pointer ml-auto lg:mx-auto flex flex-row bg-primary text-white justify-center w-46 px-4 py-2 rounded-lg font-medium hover:bg-secondary transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 items-center space-x-2">
                            <span className="font-normal font-chalet-paris text-3xl">+</span>
                            <span className="font-inter font-semibold text-nowrap">Agregar comida</span>
                        </button>
                        <button onClick={()=> setActiveWindowModifyD(true)} className="cursor-pointer ml-auto lg:mx-auto flex flex-row bg-yellow-300/25 text-white justify-center w-46 px-4 py-2 rounded-lg font-medium hover:bg-yellow-300/50 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 items-center space-x-2">
                            <ShowSvg name={"modify"} size={16}></ShowSvg>
                            <span className="font-inter font-semibold text-neutral-600">Modificar</span>
                        </button>
                        <button onClick={()=> setActiveWindowDeleteD(true)} className="cursor-pointer ml-auto lg:mx-auto flex flex-row bg-red-500/10 text-white justify-center w-46 px-4 py-2 rounded-lg font-medium hover:bg-red-500/20 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 items-center space-x-2">
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
                        <ShowSvg name={"bars"} size={24} className="stroke-orangeM fill-orangeM mr-1"></ShowSvg>
                        <span className={`mr-1`}>{comidas.length == 0 ? "Sin comidas" : comidas.length + (comidas.length > 1 ? " comidas" : " comida")}</span>
                    </div>
                
                </div>
                <div className="my-2 font-inter col-span-2 lg:col-span-1 row-start-3 col-start-1">
                    <p className="font-medium text-md lg:text-lg text-gray-700">{dieta.descripcion}</p>
                </div>
            </div>
        )
    
        const retornarComidas = ()=>
            {
                return <ul className="ejercicios-lista flex flex-col gap-y-4 font-inter">
                            {comidas.map((comida, index)=> (
                                <li key={comida.orden} className={`bg-gradient-to-br ${comida.orden == 1 ? "from-orange-50 to-yellow-50 border-orange-200 text-orange-600" : comida.orden == cantComidas ? "from-purple-50 to-purple-50 border-purple-200 text-purple-600" : "from-teal-50 to-teal-50 border-teal-200 text-teal-600"}
                                border-2 rounded-xl p-6 h-46 transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                                `}>
                                    <div className="size-full relative">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="comida-icon">
                                                    <ShowSvg name={comida.orden == 1 ? "sun" : comida.orden == cantComidas ? "moon" : "apple"} size={40}></ShowSvg>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900">{comida.nombre_comida}</h3>
                                            </div>
                                            <div className="flex flex-row gap-x-3">
                                                <button onClick={()=> {setComidaSeleccionada(comida); setComidaModal(true)}} className="rounded-lg font-inter bg-secondary/80 text-white font-semibold px-3 py-1 text-sm cursor-pointer">Ver detalles</button>
                                                <span className="bg-white/80 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                                                    {comida.calorias_totales + " kcal"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-700 font-medium">
                                                {comida.alimentos.length + " alimentos"}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {comida.alimentos.map((alim) => (
                                                    <span key={alim.id} className="bg-white/60 text-gray-700 px-2 py-1 rounded-lg text-xs">{alim.nombre}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="buttons absolute bottom-0 right-0 flex gap-y-4 flex-col">
                                            <button className="cursor-pointer ml-auto lg:mx-auto flex flex-row bg-blue-500/10 text-white justify-center w-46 px-4 py-2 rounded-lg font-medium hover:bg-blue-500/20 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 items-center space-x-2">
                                                <ShowSvg name={"link"} size={16} className="text-blue-400"></ShowSvg>
                                            </button>
                                            <button onClick={()=> {
                                                setComidaSeleccionada(comida);
                                                setActiveWindowDelete(true)}} className="cursor-pointer ml-auto lg:mx-auto flex flex-row bg-red-500/10 text-white justify-center w-46 px-4 py-2 rounded-lg font-medium hover:bg-red-500/20 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 items-center space-x-2">
                                                <ShowSvg name={"delete"} size={16} className="text-red-400"></ShowSvg>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
            }
        return (
            <React.Fragment>
            <div className="routine-info m-8 bg-white rounded-2xl shadow-lg p-8 md:row-span-2">
                {Object.keys(dieta).length > 0 ? retornarInformacion() : (
                    <div className="rounded-lg">
                    <p className="font-inter text-lg">Cargando datos..</p>
                    </div>
                )}
            </div>
            <div className="routine-details m-8 p-3 md:row-span-2">
                <h2 className="font-inter bg-primary/50 py-2 rounded-3xl text-center text-black/40 font-bold text-[1.75rem] my-6">Comidas</h2>
                <div className="flex flex-col xl:grid 2xl:grid-cols-2 gap-x-12">
                    {comidas.length > 0 ? retornarComidas() : <p className="font-coda">No hay comidas.</p> }
                </div>
            </div>
            { activeWindowAsign ? (
                <CreateWindow
                    dietaActual={dieta}
                    onClose={()=> setActiveWindowAsign(false)}
                    onSave={handleSaveAsignacion}
                ></CreateWindow>
            ) : activeWindowModifyD ? (
                <ModifyWindowD
                    isOpen={true}
                    dieta={dieta}
                    onClose={()=> setActiveWindowModifyD(false)}
                    onSave={handleSaveDieta}
                ></ModifyWindowD>
            ) : activeWindowDeleteD ? (
                <DeleteWindowD
                    isOpen={true}
                    dieta={dieta}
                    onClose={()=> setActiveWindowDeleteD(false)}
                    onSave={handleSaveDieta}
                />
            ) : activeWindowDelete ? (
                <DeleteWindow
                    isOpen={true}
                    asignacion={comidaSeleccionada}
                    onClose={() => setActiveWindowDelete(false)}
                    onSave={handleSaveAsignacion}
                ></DeleteWindow>
            ) : comidaModal ? (
                <ClientModalMeal
                    comida={comidaSeleccionada}
                    modalActivo={comidaModal}
                    setModalActivo={setComidaModal}
                    reload={reload}
                    startReload={startReload}
                    token={token}
                ></ClientModalMeal>
            ) : ""}
            </React.Fragment>
        )
}