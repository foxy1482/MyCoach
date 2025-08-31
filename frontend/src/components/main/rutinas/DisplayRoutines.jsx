import {useNavigate} from "react-router-dom"
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { GetAuthUserID, GetUserID } from "../../../utils/getUser";
import { GetUserRoutine, ListRExercises, GetExerciseData, GetRoutineAsignationData } from "../../../utils/getRoutine.js";
import { GetPlanByID } from "../../../utils/getPlan.js";
import { TrainerDisplayRoutines } from "./TrainerDisplayRoutines.jsx";
import { ShowSvg } from "../../utilities/ShowSvg.jsx";

export function DisplayRoutines()
{
    const [ejerciciosHoy, setEjerciciosHoy] = useState({});
    const [rutina, setRutina] = useState({});
    const [plan, setPlan] = useState({});
    const [esEntrenador, setEsEntrenador] = useState(false);

    let token = Cookies.get('token');
    const navigate = useNavigate();
    useEffect(()=>
    {
        if (!token)
        {
            navigate('/');
            return;
        }

        const tiempoTranscurrido = (fechaISO)=>{
            const fecha = new Date(fechaISO);
            const ahora = new Date();

            const diffMs = ahora - fecha;
            const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diffMeses = Math.floor(diffDias / 30.44); // promedio de días por mes
            const diffAnios = Math.floor(diffMeses / 12);

            if (diffAnios >= 1) {
                return diffAnios === 1 ? "1 año" : `${diffAnios} años`;
            } else if (diffMeses >= 1) {
                return diffMeses === 1 ? "1 mes" : `${diffMeses} meses`;
            } else {
                return diffDias === 1 ? "1 día" : `${diffDias} días`;
            }
        }

        const fetchData = async () => {
            try {
                const clienteData = await GetUserID(token);
                const usuarioData = await GetAuthUserID(token);
                
                if (usuarioData && usuarioData.rol.id == 2 || usuarioData.rol.id == 3) setEsEntrenador(true);

                const rutinaData = await GetUserRoutine(clienteData.id);

                const rutinaInfoData = await GetRoutineAsignationData(clienteData.id)
                const informacionRutina = {
                    ...rutinaData,
                    ...rutinaInfoData
                }
                setRutina({...informacionRutina, since_days: tiempoTranscurrido(informacionRutina.fecha_asignacion)});

                const planData = await GetPlanByID(informacionRutina.plan_id);
                setPlan(planData)

                const ejerciciosData = await ListRExercises(rutinaData.id);
                let detalles = [];
                for (const e of ejerciciosData) {
                    const detalle = await GetExerciseData(rutinaData.id, e.id);

                    detalles.push({ ...detalle, nombre: e.nombre, grupo_muscular: e.grupo_muscular });
                }

                const agrupados = detalles.reduce((acc, ej) => {
                    if (!acc[ej.grupo_muscular]) acc[ej.grupo_muscular] = [];
                    acc[ej.grupo_muscular].push(ej);
                    return acc;
                }, {});

                setEjerciciosHoy(agrupados);
            } catch (error) {
                console.error('Error obteniendo cliente:', error);
            }
        }
    fetchData();
    },[token,navigate])

    const retornarInformacion = ()=>
    (
        <div className="p-3.5 grid grid-rows-3 grid-cols-1 lg:grid-cols-2 lg:grid-rows-2">
            <p className="font-inter text-3xl py-2 font-bold">{rutina.nombre}</p>
            <div className="flex justify-end lg:row-start-1 lg:col-start-2 row-start-3 ">
                    <button className="hidden bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 items-center space-x-2">
                        <span className="font-normal font-chalet-paris text-3xl">+</span>
                        <span className="font-inter font-semibold text-lg">Agregar ejercicio</span>
                    </button>
                </div>
            <div className="icons flex flex-row gap-x-4 lg:col-span-2">
                <div className="font-inter text-lg text-gray-600 py-2 flex items-center">
                    <div className="size-3 bg-primary rounded-full mr-2"></div>
                    Plan {plan.nombre}
                </div>
                
                <div className="font-inter text-lg text-gray-600 py-2 flex items-center">
                    <ShowSvg name={"relojArena"} size={24} className="fill-orange-500 stroke-orange-500 text-orange-500 mr-1"></ShowSvg>
                    <span className="font-bold mr-1">{rutina.since_days}</span>con la rutina
                </div>

            </div>
        </div>
    )

    const retornarEjercicios = ()=>
    {
        return Object.entries(ejerciciosHoy).map(([grupo, ejercicios]) => (
                <div key={grupo} className="max-w-2xl mx-auto grupo-muscular my-6 rounded-lg p-2.5">
                    <ul className="ejercicios-lista flex flex-col gap-y-4">
                    {ejercicios.map((ej, index) => (
                        <li key={ej.id} className="ejercicios-lista__li group flex flex-col p-4 rounded-xl bg-white shadow-lg hover:bg-primary/5 transition hover:scale-110 duration-150">
                        <div className="items-center font-inter text-lg text-center flex flex-row">
                            <div className="flex flex-row items-center m-auto">
                                <span className="items-center font-inter my-auto font-semibold">{ej.nombre}</span>
                                <div className="buttons">

                                </div>
                            </div>
                        </div>
                        <div className="icons flex flex-row gap-x-4">
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
                            <div className="flex w-full justify-end gap-x-1">
                                <span className="text-sm p-3 my-auto h-fit rounded-xl bg-primary/10 text-primary font-bold">{grupo}</span>
                                <span className="font-coda my-auto h-fit text-sm bg-secondary text-white rounded-xl p-2">N°{index+1}</span>
                            </div>
                        </div>
                        </li>
                    ))}
                    </ul>
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
            <div className="flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-3">
                {Object.keys(ejerciciosHoy).length > 0 ? retornarEjercicios() : <p className="font-coda">No tenés ejercicios para hoy.</p> }
            </div>
        </div>
        {esEntrenador ? <TrainerDisplayRoutines></TrainerDisplayRoutines> : ""}
        </React.Fragment>
    )
}