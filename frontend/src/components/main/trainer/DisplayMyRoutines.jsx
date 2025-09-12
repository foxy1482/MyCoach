import React, {useState, useEffect } from 'react';
import { LoadAllIcons } from '../../utilities/LoadCRUDIcons';
import { RoutineBox } from './RoutineBox.jsx';
import Cookies from 'js-cookie';
import { GetAuthUserID, GetAllClients } from '../../../utils/getUser.js';
import { GetAllRoutines } from '../../../utils/getRoutine.js';
import { CreateWindowR } from "./rutinaCRUD/CreateWindow.jsx";
import { ShowSvg } from '../../utilities/ShowSvg.jsx';
import { API_URL } from '../../../utils/config.js';

export function DisplayMyRoutines()
{
    let token = Cookies.get('token');
    const [usuario, setUsuario] = useState({ "rol" : { "id" : 0 } });
    const [rutinas, setRutinas] = useState(null);
    const [rutinaActiva, setRutinaActiva] = useState(null);
    const esDemo = usuario.rol.id == 4;

    const [activeWindowRoutineCreate, setActiveWindowRoutineCreate] = useState(false);
    const [activeWindowRoutineDelete, setActiveRoutineWindowDelete] = useState(false);

    const [activeWindowDelete, setActiveWindowDelete] = useState(false);

    const deps = [token, activeWindowDelete, activeWindowRoutineCreate, activeWindowRoutineDelete]
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

            const rutinasData = await GetAllRoutines();
            setRutinas(rutinasData);

        }
        fetchData();
    },deps)

    const handleSaveRutina = async (action, newValue = null)=>{
            if (action == "POST")
            {
                const responseCrEj = await fetch(`${API_URL}/api/rutinas/crear`,
                    {
                        method: 'POST',
                        headers : {
                            'Content-Type' : 'application/json'
                        },
                        body: JSON.stringify({ "rutina" :
                            {
                                "nombre" : newValue.nombre,
                                "plan_id" : newValue.plan_id,
                                "es_personalizada" : newValue.es_personalizada
                            }
                        , "data" : { token }})
                    }
                );
                const dataRes = await responseCrEj.json();
                return dataRes;
            }
            else if (action == "PUT")
            {
                const responseModEj = await fetch(`${API_URL}/api/rutinas/modificar/${rutinaActiva.id}`,
                    {
                        method: 'PUT',
                        headers : {
                            'Content-Type' : 'application/json'
                        },
                        body: JSON.stringify({ "rutina_data" :
                            {
                                "nombre" : newValue.nombre,
                                "plan_id" : newValue.plan_id,
                                "es_personalizada" : newValue.es_personalizada
                            }
                        , "data" : { token }})
                    }
                );
                const dataRes = await responseModEj.json();
                return dataRes;
            }
            else if (action == "DELETE")
            {
                const responseElimEj = await fetch(`${API_URL}/api/rutinas/eliminar/${rutinaActiva.id}`,
                    {
                        method: 'DELETE',
                        headers : {
                            'Content-Type' : 'application/json'
                        },
                        body: JSON.stringify({token})
                    }
                );
                const dataRes = await responseElimEj.json();
                window.location.reload();
                return dataRes;
            }
        }

    return (
        <div className='wrapper relative flex h-auto'>
            <div className='w-90 bg-white shadow-lg border-r border-gray-200'>
                <div className="list-header p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between my-4 w-full">
                        <h2 className='text-xl font-bold text-neutral-800 font-inter'>Mis rutinas</h2>
                        <button onClick={()=> setActiveWindowRoutineCreate(true)} className='bg-primary flex size-12 rounded-xl text-2xl font-inter text-white my-6 shadow-lg hover:bg-secondary cursor-pointer'>
                            <span className='m-auto'>+</span>
                        </button>
                    </div>
                    <div className="list-main overflow-y-auto h-full flex flex-col">
                        <ul className='flex flex-col font-inter'>
                            {rutinas ? (
                                rutinas.map((r, index)=>(
                                    <li key={index} onClick={()=>setRutinaActiva(rutinas[index])} className={`p-4 border-y border-gray-200 cursor-pointer transition-all duration-200 hover:bg-primary/10 border-r-4 ${rutinaActiva == rutinas[index] ? "border-r-primary bg-primary/20" : ""}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 flex flex-row gap-x-2">
                                                <span className='font-bold text-secondary/50 text-lg'>{r.id}</span>
                                                <h3 className='font-semibold text-primary text-lg'>{r.nombre}</h3>
                                            </div>
                                            <div className="flex space-x-2 text-neutral-500">
                                                <button onClick={()=> setActiveRoutineWindowDelete(true)} className='flex cursor-pointer'>
                                                    <ShowSvg name={"delete"} size={16}></ShowSvg>
                                                </button>
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
                {esDemo ? (
                    <div className="flex mx-auto text-center justify-center">
                        <span className="text-lg font-inter text-red-500">Algunas funciones están deshabilitadas en la versión demo.</span>
                    </div>
                ) : ""}
                <div className="p-8">
                    {rutinas && rutinaActiva ? (
                        <RoutineBox rutina={rutinaActiva} token={token} activeWindowDelete={activeWindowDelete} setActiveWindowDelete={setActiveWindowDelete}
                        handleSaveRutina={handleSaveRutina} activeRoutineWindowDelete={activeWindowRoutineDelete} setActiveRoutineWindowDelete={setActiveRoutineWindowDelete}></RoutineBox>
                    ) : (
                        <div className='m-auto text-center font-carlito text-neutral-500/80'>Selecciona una rutina</div>
                    )}
                    {activeWindowRoutineCreate ? (
                        <CreateWindowR
                            isOpen={true}
                            onClose={()=> setActiveWindowRoutineCreate(false)}
                            onSave={handleSaveRutina}
                        ></CreateWindowR>
                    ) : ""}
                    <div className="my-6"></div>
                </div>
            </div>
        </div>
    )
}