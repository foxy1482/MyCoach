import React, {useState, useEffect } from 'react';
import { LoadAllIcons } from '../../utilities/LoadCRUDIcons';
import { ExerciseBox } from './ExerciseBox.jsx';
import Cookies from 'js-cookie';
import { GetAuthUserID, GetAllClients } from '../../../utils/getUser.js';
import { GetAllExercises } from '../../../utils/getRoutine.js';
import { GetAllFoods } from '../../../utils/getDiet.js';
import { CreateWindow } from './alimentosCRUD/CreateWindow.jsx'
import { ShowSvg } from '../../utilities/ShowSvg.jsx';
import { FoodBox } from './FoodBox.jsx';

export function DisplayMyFoods()
{
    let token = Cookies.get('token');
    const [usuario, setUsuario] = useState({ "rol" : { "id" : 0 } });
    const [alimentos, setAlimentos] = useState(null);
    const [alimentoActivo, setAlimentoActivo] = useState(null);
    const esDemo = usuario.rol.id == 4;

    const [activeWindowCreateF, setActiveWindowCreateF] = useState(false);
    const [activeWindowModifyF,  setActiveWindowModifyF] = useState(false);
    const [activeWindowDeleteF, setActiveWindowDeleteF] = useState(false);

    const deps = [token, activeWindowCreateF, activeWindowDeleteF, activeWindowModifyF]
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

            const alimentosData = await GetAllFoods();
            setAlimentos(alimentosData);

        }
        fetchData();
    },deps)

    const handleSaveAlimento = async (action, newValue = null)=>{
            if (action == "POST")
            {
                const responseCrEj = await fetch(`/api/api/dietas/alimento/crear`,
                    {
                        method: 'POST',
                        headers : {
                            'Content-Type' : 'application/json'
                        },
                        body: JSON.stringify({ "alimento" :
                            {
                                "nombre" : newValue.nombre,
                                "calorias_100g" : newValue.calorias_100g,
                                "proteinas" : newValue.proteinas,
                                "grasas" : newValue.grasas,
                                "carbohidratos" : newValue.carbohidratos
                            }
                        , "data" : { token }})
                    }
                );
                const dataRes = await responseCrEj.json();
                return dataRes;
            }
            else if (action == "PUT")
            {
                const responseModEj = await fetch(`/api/api/dietas/alimento/modificar/${alimentoActivo.id}`,
                    {
                        method: 'PUT',
                        headers : {
                            'Content-Type' : 'application/json'
                        },
                        body: JSON.stringify({ "alimento_data" :
                            {
                                "nombre" : newValue.nombre,
                                "calorias_100g" : newValue.calorias_100g,
                                "proteinas" : newValue.proteinas,
                                "grasas" : newValue.grasas,
                                "carbohidratos" : newValue.carbohidratos
                            }
                        , "data" : { token }})
                    }
                );
                const dataRes = await responseModEj.json();
                window.location.reload();
                return dataRes;
            }
            else if (action == "DELETE")
            {
                const responseElimEj = await fetch(`/api/api/dietas/alimento/eliminar/${alimentoActivo.id}`,
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
                        <h2 className='text-xl font-bold text-neutral-800 font-inter'>Mis alimentos</h2>
                        <button onClick={()=> setActiveWindowCreateF(true)} className='bg-primary flex size-12 rounded-xl text-2xl font-inter text-white my-6 shadow-lg hover:bg-secondary cursor-pointer'>
                            <span className='m-auto'>+</span>
                        </button>
                    </div>
                    <div className="list-main overflow-y-auto h-full flex flex-col">
                        <ul className='flex flex-col font-inter'>
                            {alimentos ? (
                                alimentos.map((r, index)=>(
                                    <li key={index} onClick={()=>setAlimentoActivo(alimentos[index])} className={`p-4 border-y border-gray-200 cursor-pointer transition-all duration-200 hover:bg-primary/10 border-r-4 ${alimentoActivo == alimentos[index] ? "border-r-primary bg-primary/20" : ""}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 flex flex-row gap-x-2">
                                                <span className='font-bold text-secondary/50 text-lg'>{r.id}</span>
                                                <h3 className='font-semibold text-primary text-lg'>{r.nombre}</h3>
                                            </div>
                                            <div className="flex space-x-2 text-neutral-500">
                                                <button onClick={()=> setActiveWindowDeleteF(true)} className='flex cursor-pointer'>
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
                    {alimentos && alimentoActivo ? (
                        <FoodBox alimento={alimentoActivo} token={token} activeWindowModifyF={activeWindowModifyF} setActiveWindowModifyF={setActiveWindowModifyF}
                        handleSaveAlimento={handleSaveAlimento} activeWindowDeleteF={activeWindowDeleteF} setActiveWindowDeleteF={setActiveWindowDeleteF} activeWindowCreateF={activeWindowCreateF} setActiveWindowCreateF={setActiveWindowCreateF}></FoodBox>
                    ) : (
                        <div className='m-auto text-center font-carlito text-neutral-500/80'>Selecciona un ejercicio</div>
                    )}
                    {activeWindowCreateF ? (
                        <CreateWindow
                            isOpen={true}
                            onClose={()=> setActiveWindowCreateF(false)}
                            onSave={handleSaveAlimento}
                        ></CreateWindow>
                    ) : ""}
                    <div className="my-6"></div>
                </div>
            </div>
        </div>
    )
}