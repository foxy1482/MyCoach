import {useNavigate} from "react-router-dom"
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { GetUserID } from "../../../utils/getUser";
import { GetUserRoutine, ListRExercises, GetExerciseData } from "../../../utils/getRoutine.js";
import { ShowSvg } from "../../utilities/ShowSvg.jsx";

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
                <div key={grupo} className="grupo-muscular my-6.5 bg-gradient-to-br from-white to-neutral-100 shadow-lg rounded-lg p-2.5">
                    <ul className="ejercicios-lista space-y-3">
                    {ejercicios.map((ej) => (
                        <li key={ej.id} className="ejercicios-lista__li group flex items-center p-4 rounded-xl border transition duration-200 bg-primary/2 hover:shadow-md hover:bg-success/12 border-success/30">
                        <div className="items-center font-inter text-lg text-center flex flex-row">
                        <div className="size-4 rounded-full bg-neutral-500 m-0 group-hover:bg-success transition"></div>
                            <div className="flex flex-col items-center m-auto">
                                <span className="items-center font-inter my-auto font-semibold">{ej.nombre}</span>
                                <span className="text-sm">{grupo}</span>
                            </div>
                        </div>
                        <div className="items-center font-inter text-lg text-center flex flex-col">
                            <span className="font-semibold">{ej.series}</span>
                            <span className="text-sm">Series</span>
                        </div>
                        <div className="items-center font-inter text-lg text-center flex flex-col">
                            <span className="font-semibold">{ej.repeticiones}</span>
                            <span className="text-sm">Reps</span>
                        </div>
                        <div className="items-center text-secondary bg-white/80 rounded-lg shadow-lg font-inter text-lg text-center flex flex-col">
                            <span className="font-semibold">{ej.rir}</span>
                            <span className="text-sm">RIR</span>
                        </div>
                        </li>
                    ))}
                    </ul>
                </div>
                ))
    }

    return (
        <div className="dashboard-exercises bg-white rounded-2xl shadow-lg p-6 my-3 hover:shadow-xl transition duration-300 md:row-span-2">
            <div className="exercises-header flex flex-row items-center justify-between my-6 w-fit gap-x-2">
                <ShowSvg name={"fire"} size={24} className="text-primary"></ShowSvg>
                <h2 className="font-inter font-bold text-[1.75rem] my-6 w-fit">Tu rutina de hoy</h2>
            </div>
            {Object.keys(ejerciciosHoy).length > 0 ? retornarEjercicios() : <p className="font-coda">No tenés ejercicios para hoy.</p> }
        </div>
    )
}