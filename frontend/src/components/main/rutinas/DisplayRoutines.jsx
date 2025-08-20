import {useNavigate} from "react-router-dom"
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { GetUserID } from "../../../utils/getUser";
import { GetUserRoutine, ListRExercises, GetExerciseData, GetRoutineAsignationData } from "../../../utils/getRoutine.js";
import { GetPlanByID } from "../../../utils/getPlan.js";
import '../../../../css/StyleListExercises.css'
import { TrainerDisplayRoutines } from "./TrainerDisplayRoutines.jsx";


export function DisplayRoutines()
{
    const [ejerciciosHoy, setEjerciciosHoy] = useState({});
    const [rutina, setRutina] = useState({});
    const [plan, setPlan] = useState({});

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
        <div className="border border-neutral-500/50 rounded-lg p-3.5">
            <p className="font-inter text-lg font-bold py-2">Nombre: <span className="font-normal font-inter">{rutina.nombre}</span></p>
            <p className="font-inter text-lg font-bold py-2">Plan: <span className="font-normal font-inter">{plan.nombre}</span></p>
            <p className="font-inter text-lg font-bold py-2">Tiempo transcurrido: <span className="font-normal font-inter">{rutina.since_days}</span></p>
        </div>
    )

    const retornarEjercicios = ()=>
    {
        return Object.entries(ejerciciosHoy).map(([grupo, ejercicios]) => (
                <div key={grupo} className="grupo-muscular my-6.5 border border-neutral-500/50 rounded-lg p-2.5">
                    <h3 className="text-emerald-400 font-chalet-newyork text-lg font-bold">{grupo}</h3>
                    <ul className="ejercicios-lista">
                        <li className="ejercicios-lista__li mt-2 border border-transparent border-b-neutral-500/50">
                            <span className="font-inter text-emerald-700 text-center font-bold">Nombre</span>
                            <span className="font-inter text-emerald-700 font-bold text-center">Series</span>
                            <span className="font-inter text-emerald-700 font-bold text-center">Reps</span>
                            <span className="font-inter text-emerald-700 font-bold text-center">RIR</span>
                        </li>
                    {ejercicios.map((ej) => (
                        <li key={ej.id} className="ejercicios-lista__li m-0.5 py-1">
                        <span className="items-center font-inter my-auto">{ej.nombre}</span>
                        <span className="items-center font-inter text-lg text-center">{ej.series}</span>
                        <span className="items-center font-inter text-lg text-center">{ej.repeticiones}</span>
                        <span className="items-center font-inter text-lg text-center">{ej.rir}</span>
                        </li>
                    ))}
                    </ul>
                </div>
                ))
    }

    return (
        <React.Fragment>
        <div className="routine-info my-3 p-3 border border-neutral-500/30 rounded-xs md:row-span-2">
            <h2 className="font-chalet-paris font-bold text-[1.75rem] my-6">Tu rutina</h2>
            {Object.keys(rutina).length > 0 ? retornarInformacion() : (
                <div className="border border-neutral-500/50 rounded-lg">
                <p className="font-inter text-lg">Cargando datos..</p>
                </div>
            )}
        </div>
        <div className="routine-details my-3 p-3 border border-neutral-500/30 rounded-xs md:row-span-2">
            <h2 className="font-chalet-paris font-bold text-[1.75rem] my-6">Detalles de la rutina</h2>
            {Object.keys(ejerciciosHoy).length > 0 ? retornarEjercicios() : <p className="font-coda">No tenés ejercicios para hoy.</p> }
        </div>
        <TrainerDisplayRoutines></TrainerDisplayRoutines>
        </React.Fragment>
    )
}