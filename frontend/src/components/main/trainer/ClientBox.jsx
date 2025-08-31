import React, { useEffect, useState } from "react"
import { GetUserByID } from "../../../utils/getUser";
import { LoadAllIcons } from "../../utilities/LoadCRUDIcons";
import { GetUserPlan } from "../../../utils/getUserPlan";
import { ShowSvg } from "../../utilities/ShowSvg";

export function ClientBox({ cliente, userID, token })
{
    const [usuario, setUsuario] = useState(null);
    const [clientePlan, setClientePlan] = useState(null);

    useEffect(()=>
    {
        if (!cliente?.id || !userID) return;
        const fetchData = async ()=>
        {
            const usuarioData = await GetUserByID(userID, token);
            setUsuario(usuarioData);
            console.log(usuario)
            const clientePlanData = await GetUserPlan(cliente.id);
            setClientePlan(clientePlanData);

        }
        fetchData();
    },[cliente?.id, userID])

    if (cliente && clientePlan && usuario) return (
        <div className="profile-data font-inter flex flex-col lg:grid lg:grid-cols-2">
            <div className='bg-white rounded-2xl shadow-lg p-8 m-8 section-card lg:col-span-2'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
                    <div className="flex items-center space-x-6 my-6 lg:m-0">
                        <div className='img-container relative w-fit'>
                            <img
                            src=""
                            alt="Mi foto de perfil"
                            className='size-24 rounded-full object-cover ring-4 ring-primary/20'
                            />
                            <div className='absolute -bottom-2 -right-2 bg-success size-6 rounded-full border-4 border-white'></div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 text-center m-6">{cliente.nombre + " " + cliente.apellido}</h1>
                            <div className='flex flex-wrap gap-6 text-sm text-gray-600'>
                                <span className='flex items-center gap-2.5'>
                                    <span className="size-2 bg-primary rounded-full -mr-1.5">
                                    </span>
                                        {cliente.edad + " años"}
                                    <LoadAllIcons currentClient={cliente} size="14" type="perfil" campo="edad" fieldType="int" currentValue={cliente.edad} buttons={1}></LoadAllIcons>
                                </span>
                                <span className='flex items-center gap-2.5'>
                                    <span className={`size-2 bg-${cliente.sexo == "F" ? "femenino" : "blue-500"} rounded-full -mr-1.5`}>
                                    </span>
                                        {cliente.sexo == "F" ? "Femenino" : "Masculino"}
                                    <LoadAllIcons currentClient={cliente} size="14" type="perfil" campo="sexo" fieldType="text" currentValue={cliente.sexo} buttons={1}></LoadAllIcons>
                                </span>
                                <span className='flex items-center gap-2.5'>
                                    <span className={`size-2 bg-${clientePlan.nombre ? "primary" : "red-400"} rounded-full -mr-1.5`}>
                                    </span>
                                        {clientePlan.nombre ? "Plan " + clientePlan.nombre : "Ningún plan"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button onClick={()=>alert("Función en desarrollo")} className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-secondary transition duration-200 shadow-md hover:shadow-lg hover:-translate-y-1.5">
                            Ver mi rutina
                        </button>
                        <button onClick={()=>alert("Función en desarrollo")} className="border border-primary text-primary hover:text-white px-6 py-2 rounded-lg font-medium hover:bg-neutral-500 transition-colors duration-200 shadow-md">
                            Editar perfil
                        </button>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 transition-all hover:shadow-2xl m-8 section-card">
                <div className="flex flex-col lg:items-center">
                    <h2 className="font-semibold text-2xl">Datos de la cuenta</h2>
                    <div className="data pb-6 w-9/12 space-y-4 flex flex-col border border-transparent border-b-neutral-500/50">
                        <div className="item flex items-center space-x-3 p-3 rounded-lg hover:bg-primary/5 transition duration-200">
                            <div className="bg-primary/10 p-1.5 size-12 rounded-lg">
                                <ShowSvg name={"username"} size={24}></ShowSvg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Nombre de usuario</p>
                                <p className="font-medium text-gray-600">{usuario ? usuario.username : "Cargando..."}</p>
                            </div>
                        </div>
                        <div className="item flex items-center space-x-3 p-3 rounded-lg hover:bg-primary/5 transition duration-200">
                            <div className="bg-primary/10 p-1.5 size-12 rounded-lg">
                                <ShowSvg name={"email"} size={24}></ShowSvg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-medium text-gray-600">{usuario ? usuario.email : "Cargando..."}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
    else return (
        <p>Cargando perfil...</p>
    )
}