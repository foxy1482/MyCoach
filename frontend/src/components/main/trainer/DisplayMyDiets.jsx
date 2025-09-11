import { useState, useEffect } from "react";
import { GetAllDiets } from "../../../utils/getDiet";
import { DietBox } from "./DietBox";
import Cookies from 'js-cookie';
import { GetAuthUserID } from "../../../utils/getUser";
import { ShowSvg } from "../../utilities/ShowSvg";
import { CreateWindowD } from "./dietaCRUD/CreateWindow";

export function DisplayMyDiets()
{
    let token = Cookies.get('token');
    const [usuario, setUsuario] = useState({ "rol" : { "id" : 0}});
    const [dietas, setDietas] = useState(null);
    const [dietaActiva, setDietaActiva] = useState(null);
    const esDemo = usuario.rol.id == 4;

    const [activeWindowCreateD, setActiveWindowCreateD] = useState(false);
    const [activeWindowModifyD,  setActiveWindowModifyD] = useState(false);
    const [activeWindowDeleteD, setActiveWindowDeleteD] = useState(false);

    const [activeWindowDelete, setActiveWindowDelete] = useState(false);


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

            const dietasData = await GetAllDiets();
            setDietas(dietasData);

        }
        fetchData();
    },[token, activeWindowCreateD, activeWindowDeleteD, activeWindowModifyD]);

    const handleSaveDieta = async( action, newValue = null )=>
    {
        if (action == "POST")
        {
            const responseCrD = await fetch("/api/api/dietas/crear",
                {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        "dieta" : {
                            "nombre" : newValue.nombre,
                            "plan_id" : newValue.plan_id,
                            "descripcion" : newValue.descripcion
                        },
                        "data" : {token}
                    })
                }
            );
            const dataRes = await responseCrD.json();
            return dataRes;
        }
        else if (action == "PUT")
        {
            const responseCrD = await fetch(`/api/api/dietas/modificar/${dietaActiva.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        "dieta_data" : {
                            "nombre" : newValue.nombre,
                            "plan_id" : newValue.plan_id,
                            "descripcion" : newValue.descripcion
                        },
                        "data" : {token}
                    })
                }
            );
            const dataRes = await responseCrD.json();
            return dataRes;
        }
        else if (action == "DELETE")
        {
            const responseCrD = await fetch(`/api/api/dietas/eliminar/${dietaActiva.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({token})
                }
            );
            const dataRes = await responseCrD.json();
            return dataRes;
        }
    
    }

    return (
        <div className='wrapper relative flex h-auto'>
            <div className='w-90 bg-white shadow-lg border-r border-gray-200'>
                <div className="list-header p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between my-4 w-full">
                        <h2 className='text-xl font-bold text-neutral-800 font-inter'>Mis dietas</h2>
                        <button onClick={()=> setActiveWindowCreateD(true)} className='bg-primary flex size-12 rounded-xl text-2xl font-inter text-white my-6 shadow-lg hover:bg-secondary cursor-pointer'>
                            <span className='m-auto'>+</span>
                        </button>
                    </div>
                    <div className="list-main overflow-y-auto h-full flex flex-col">
                        <ul className='flex flex-col font-inter'>
                            {dietas ? (
                                dietas.map((r, index)=>(
                                    <li key={index} onClick={()=>setDietaActiva(dietas[index])} className={`p-4 border-y border-gray-200 cursor-pointer transition-all duration-200 hover:bg-primary/10 border-r-4 ${dietaActiva == dietas[index] ? "border-r-primary bg-primary/20" : ""}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 flex flex-row gap-x-2">
                                                <span className='font-bold text-secondary/50 text-lg'>{r.id}</span>
                                                <h3 className='font-semibold text-primary text-lg'>{r.nombre}</h3>
                                            </div>
                                            <div className="flex space-x-2 text-neutral-500">
                                                <button onClick={()=> setActiveWindowDeleteD(true)} className='flex cursor-pointer'>
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
                    {dietas && dietaActiva ? (
                        <DietBox    dieta={dietaActiva} token={token} handleSaveDieta={handleSaveDieta}
                                    activeWindowModifyD={activeWindowModifyD} setActiveWindowModifyD={setActiveWindowModifyD}
                                    activeWindowDelete={activeWindowDelete} setActiveWindowDelete={setActiveWindowDelete}
                                    activeWindowDeleteD={activeWindowDeleteD} setActiveWindowDeleteD={setActiveWindowDeleteD}
                        ></DietBox>
                    ) : (
                        <div className='m-auto text-center font-carlito text-neutral-500/80'>Selecciona una dieta</div>
                    )}
                    {activeWindowCreateD ? (
                        <CreateWindowD
                            isOpen={true}
                            onClose={()=> setActiveWindowCreateD(false)}
                            onSave={handleSaveDieta}
                        ></CreateWindowD>
                    ) : ""}
                    <div className="my-6"></div>
                </div>
            </div>
        </div>
    )
}