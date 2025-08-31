import {useNavigate} from "react-router-dom"
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { GetAuthUserID, GetAllClients } from "../../../utils/getUser.js";
import { ModalAlumnoRutinas } from "./ModalAlumnoRutinas.jsx";


export function TrainerDisplayRoutines()
{
    let token = Cookies.get('token');
    const navigate = useNavigate();
    const [cliente, setCliente] = useState({});
    const [alumnos, setAlumnos] = useState([]);
    const [alumnoActivo, setAlumnoActivo] = useState(null);

    useEffect(()=>
    {
        if (!token)
        {
            navigate('/');
            return;
        }
        const fetchData = async ()=>
        {
            const clienteData = await GetAuthUserID(token);
            setCliente(clienteData);

            const alumnosData = await GetAllClients();
            setAlumnos(alumnosData);

        }
        fetchData();
    },[token, navigate])

    if (!cliente) return null;
    
    if (cliente.rol_id == 1) return (
            <React.Fragment></React.Fragment>
        )
    else return (
        <section className="trainer-section w-6/12 m-auto">
            <div className="trainer-title flex items-center space-x-4">
                <span className="h-px flex-grow bg-neutral-600"></span>
                <span className="font-coda text-lg font-medium text-neutral-600 whitespace-nowrap">Herramientas de entrenador</span>
                <span className="h-px flex-grow bg-neutral-600"></span>
            </div>
            <div className="trainer-trainees flex flex-col">
                {alumnos && !alumnoActivo ? 
                (
                    <React.Fragment>
                    <h3 className="font-inter font-bold text-2xl">Alumnos</h3>
                    {alumnos.map((trainee, index) => 
                    (
                        <a key={index} className="trainee alumno bg-white shadow-lg rounded-lg p-3 my-3 group hover:scale-110 transition cursor-pointer flex flex-row" onClick={()=>setAlumnoActivo(alumnos[index])}>
                            <div className="size-3 rounded-full mx-3 my-auto bg-neutral-500 group-hover:bg-success"></div>
                            <span className="trainee-name alumno-nombre font-inter text-lg text-neutral-500 group-hover:text-neutral-800 select-none">
                                {trainee.nombre + " " + trainee.apellido}
                            </span>
                        </a>
                    ))}
                    </React.Fragment>
                ) : alumnos && alumnoActivo ? (
                    <ModalAlumnoRutinas token={token} alumnoActivo={alumnoActivo} setAlumnoActivo={setAlumnoActivo}></ModalAlumnoRutinas>
                ) : (
                    <span>Cargando alumnos..</span>
                )}
            </div>
        </section>
    )
}