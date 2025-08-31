import React, {useState, useEffect} from 'react';
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';
import { GetAuthUserID, GetUserID } from '../../../utils/getUser';
import { LoadAllIcons } from '../../utilities/LoadCRUDIcons';
import { GetUserPlan } from '../../../utils/getUserPlan';
import { ShowSvg } from '../../utilities/ShowSvg';

export function DisplayProfile()
{
    const [cliente, setCliente] = useState({});
    const [usuario, setUsuario] = useState(null);
    const [clientePlan, setClientePlan] = useState(null);
    let token = Cookies.get('token');
    const navigate = useNavigate();
    useEffect(()=>{
        if (!token)
        {
            navigate('/');
            return;
        }
        const fetchCliente = async () => {
            try {
                const data = await GetUserID(token);
                setCliente(data);
                const usuarioData = await GetAuthUserID(token);
                setUsuario(usuarioData);

                const cPlanData = await GetUserPlan(data.id);
                setClientePlan(cPlanData);
            } catch (error) {
                console.error('Error obteniendo cliente:', error);
            }
        };
        fetchCliente();
    },[token,navigate])
    if (cliente && clientePlan)
    {
        return (
            <div className="profile-container">
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
                                                {cliente.edad} años
                                            <LoadAllIcons size="14" type="perfil" campo="edad" fieldType="int" currentValue={cliente.edad} buttons={1}></LoadAllIcons>
                                        </span>
                                        <span className='flex items-center gap-2.5'>
                                            <span className={`size-2 bg-${cliente.sexo == "F" ? "pink-500" : "blue-500"} rounded-full -mr-1.5`}>
                                            </span>
                                                {cliente.sexo == "F" ? "Femenino" : "Masculino"}
                                            <LoadAllIcons size="14" type="perfil" campo="sexo" fieldType="text" currentValue={cliente.sexo} buttons={1}></LoadAllIcons>
                                        </span>
                                        <span className='flex items-center gap-2.5'>
                                            <span className={`size-2 bg-${!clientePlan ? "primary" : "red-400"} rounded-full -mr-1.5`}>
                                            </span>
                                                {!clientePlan ? "Plan " + clientePlan.nombre : "Ningún plan"}
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
                                <button onClick={()=>navigate("/perfil/logout")} className='bg-blue-500/10 border border-blue-400/20 rounded-lg px-3 text-blue-400 cursor-pointer'>
                                    <ShowSvg name={"logout"} size={32} className='text-blue-400'></ShowSvg>
                                </button>
                                <button onClick={()=>{}} className='bg-red-700/30 border border-red-800/20 rounded-lg px-3 cursor-pointer'>
                                    <ShowSvg name={"delete"} size={32} className='text-red-800 fill-red-800'></ShowSvg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 transition-all hover:shadow-2xl m-8 section-card">
                        <div className="flex flex-col lg:items-center">
                            <h2 className="font-semibold text-2xl">Datos de la cuenta</h2>
                            <div className="data pb-6 w-9/12 space-y-4 flex flex-col border border-transparent border-b-neutral-500/50">
                                <div className="item flex items-center space-x-3 p-3 rounded-lg hover:bg-primary/5 transition duration-200">
                                    <div className="bg-primary/10 p-1.5 rounded-lg">
                                        <ShowSvg name={"username"} size={24}></ShowSvg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Nombre de usuario</p>
                                        <p className="font-medium text-gray-600">{usuario ? usuario.username : "Cargando..."}</p>
                                    </div>
                                </div>
                                <div className="item flex items-center space-x-3 p-3 rounded-lg hover:bg-primary/5 transition duration-200">
                                    <div className="bg-primary/10 p-1.5 rounded-lg">
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
            </div>
        )
    }
    else{
        return <p>Cargando perfil...</p>
    }
}