import {useNavigate} from "react-router-dom"
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { GetUserID } from "../../../utils/getUser";
import { GetUserRoutine, ListRExercises, GetExerciseData } from "../../../utils/getRoutine.js";
import '../../../../css/StyleListExercises.css'

export function ListExercises()
{
    const [ejerciciosHoy, setEjerciciosHoy] = useState({});

    let token = Cookies.get('token');
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
                const clienteData = await GetUserID(token);

                const rutinaData = await GetUserRoutine(clienteData.id);

                const ejerciciosData = await ListRExercises(rutinaData.id);

                // Extracción del día de hoy
                const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
                const hoy = diasSemana[new Date().getDay()];


                let detalles = [];
                for (const e of ejerciciosData) {
                    const detalle = await GetExerciseData(rutinaData.id, e.id);
                    
                    detalles.push({ ...detalle, nombre: e.nombre, grupo_muscular: e.grupo_muscular });
                }

                const filtrados = detalles.filter(d => d.dia === hoy);

                const agrupados = filtrados.reduce((acc, ej) => {
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
        <div className="dashboard-exercises my-3 p-3 border border-neutral-500/30 rounded-xs md:row-span-2">
            <h2 className="font-chalet-paris font-bold text-[1.75rem] my-6">Tu rutina de hoy</h2>
            {Object.keys(ejerciciosHoy).length > 0 ? retornarEjercicios() : <p className="font-coda">No tenés ejercicios para hoy.</p> }
        </div>
    )
}