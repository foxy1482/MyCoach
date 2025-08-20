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
                <h3 className="font-inter font-bold text-2xl">Alumnos</h3>
                {alumnos && !alumnoActivo ? 
                (
                    alumnos.map((trainee, index) => 
                    (
                        <a key={index} className="trainee alumno border border-neutral-500/50 rounded-lg p-2 my-2 w-60 group hover:scale-120 transition cursor-pointer" onClick={()=>setAlumnoActivo(alumnos[index])}>{trainee.nombre + " " + trainee.apellido}
                            <span className="trainee-name alumno-nombre font-inter text-neutral-500 group-hover:text-black select-none"></span>
                        </a>
                    ))
                ) : alumnos && alumnoActivo ? (
                    <ModalAlumnoRutinas alumnoActivo={alumnoActivo} setAlumnoActivo={setAlumnoActivo}></ModalAlumnoRutinas>
                ) : (
                    <span>Cargando alumnos..</span>
                )}
            </div>
        </section>
    )
}