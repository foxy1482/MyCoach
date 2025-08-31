import React, {useState, useEffect } from 'react';
import { LoadAllIcons } from '../../utilities/LoadCRUDIcons';
import { ClientBox } from './ClientBox.jsx';
import Cookies from 'js-cookie';
import { GetAuthUserID, GetAllClients } from '../../../utils/getUser.js';

export function DisplayMyClients()
{
    let token = Cookies.get('token');
    const [usuario, setUsuario] = useState(null);
    const [alumnos, setAlumnos] = useState(null);
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
            const usuarioData = await GetAuthUserID(token);
            setUsuario(usuarioData);

            const alumnosData = await GetAllClients();
            setAlumnos(alumnosData);

        }
        fetchData();
    },[token])

    return (
        <div className='wrapper relative flex h-auto'>
            <div className='w-80 bg-white shadow-lg border-r border-gray-200'>
                <div className="list-header p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between my-4">
                        <h2 className='text-xl font-bold text-neutral-800 font-inter'>Mis clientes</h2>
                    </div>
                    <div className="list-main overflow-y-auto h-full">
                        <ul className='flex flex-col'>
                            {alumnos ? (
                                alumnos.map((trainee, index)=>(
                                    <li key={index} onClick={()=>setAlumnoActivo(alumnos[index])} className={`p-4 border-y border-gray-200 cursor-pointer transition-all duration-200 hover:bg-primary/10 border-r-4 ${alumnoActivo == alumnos[index] ? "border-r-primary bg-primary/20" : ""}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h3 className='font-semibold text-primary text-lg'>{trainee.nombre + " " + trainee.apellido}</h3>
                                            </div>
                                            <div className="flex space-x-2">
                                                <LoadAllIcons size="16" fieldType="text" buttons={0} type="perfil" currentClient={trainee}></LoadAllIcons>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            ) : "..."}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {alumnos && alumnoActivo ? (
                        <ClientBox cliente={alumnoActivo} userID={alumnoActivo.usuario_id} token={token}></ClientBox>
                    ) : (
                        <div className='m-auto text-center font-carlito text-neutral-500/80'>Selecciona un cliente</div>
                    )}
                    <div className="my-6"></div>
                </div>
            </div>
        </div>
    )
}