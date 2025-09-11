import React, { act, useEffect, useState } from "react"
import { GetUserByID } from "../../../utils/getUser";
import { LoadAllIcons } from "../../utilities/LoadCRUDIcons";
import { GetExerciseData, ListRExercises } from "../../../utils/getRoutine";
import { GetPlanByID } from "../../../utils/getPlan";
import { ShowSvg } from "../../utilities/ShowSvg";
import { useNavigate } from "react-router-dom";
import '../../../../css/StyleTrainerRoutine.css'
import { ModifyWindow } from './ejercicioCRUD/ModifyWindow.jsx'
import { DeleteWindow } from "./ejercicioCRUD/DeleteWindow.jsx";


export function ExerciseBox({ ejercicio, token, activeExWindowDelete, setActiveExWindowDelete, handleSaveEjercicio, activeWindowExModify, setActiveWindowExModify, activeExWindowCreate, setActiveExWindowCreate })
{
    const [usuario, setUsuario] = useState(null);
    const [ejercicios, setEjercicios] = useState({});
    const [plan, setPlan] = useState({});
    const [esEntrenador, setEsEntrenador] = useState(false);

    const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null);

    const navigate = useNavigate();
    
    /*useEffect(()=>
    {
        if (!token)
        {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                
            } catch (error) {
                console.error('Error obteniendo cliente:', error);
            }
        }
    fetchData();
    },[token,navigate, ejercicios.length, rutina?.id, activeWindowModify, activeWindowDelete, activeWindowCreate])
    */
    const retornarInformacion = ()=>
        (
            <div className="info p-3.5 grid grid-cols-1 lg:grid-cols-2">
                <div className="text-center my-8 col-span-2">
                    <div className="inline-flex p-6 rounded-full bg-purple-100 mb-6">
                        <ShowSvg name={"lightning"} size={80} className="text-purple-600"></ShowSvg>
                    </div>
                    <h1 className="font-inter text-4xl my-4 py-2 col-span-2 font-bold lg:col-span-1 m-auto text-center">{ejercicio.nombre}</h1>
                    <div className="inline-flex items-center px-6 py-3 rounded-full border-2 bg-purple-100 text-purple-600 border-purple-200">
                        <span className="font-semibold text-lg font-inter">{ejercicio.grupo_muscular}</span>
                    </div>
                    <div className="buttons flex flex-row w-fit m-auto gap-x-4 mt-5">
                        <button onClick={()=> setActiveWindowExModify(true)} className="cursor-pointer ml-auto lg:mx-auto flex flex-row bg-yellow-300/25 text-white justify-center p-4 rounded-2xl font-medium hover:bg-yellow-300/50 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 items-center space-x-2">
                            <ShowSvg name={"modify"} size={32}></ShowSvg>
                        </button>
                        <button onClick={()=> setActiveExWindowDelete(true)} className="cursor-pointer ml-auto lg:mx-auto flex flex-row bg-red-500/10 text-white justify-center p-4 rounded-2xl font-medium hover:bg-red-500/20 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 items-center space-x-2">
                            <ShowSvg name={"delete"} size={32} className="text-red-400"></ShowSvg>
                        </button>
                        
                    </div>
                </div>
                <div className="space-y-6 lg:mr-auto w-full lg:max-w-9/12">
                    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-gray-900 my-4">Información del ejercicio</h3>
                        <ul className="space-y-4 font-inter">
                            <li className="flex items-center justify-between p-3 bg-white/70 rounded-lg">
                                <span className="font-medium text-gray-700">Nombre</span>
                                <span className="font-bold text-gray-900">{ejercicio.nombre}</span>
                            </li>
                            <li className="flex items-center justify-between p-3 bg-white/70 rounded-lg">
                                <span className="font-medium text-gray-700">Grupo muscular</span>
                                <span className="px-3 py-1 rounded-full font-semibold bg-purple-100 text-purple-600 border-purple-200">{ejercicio.grupo_muscular}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                
            </div>
        )
        return (
            <React.Fragment>
            <div className="routine-info m-8 bg-white rounded-2xl shadow-lg p-8 md:row-span-2">
                {Object.keys(ejercicio).length > 0 ? retornarInformacion() : (
                    <div className="rounded-lg">
                    <p className="font-inter text-lg">Cargando datos..</p>
                    </div>
                )}
            </div>
            { activeWindowExModify ? (
                <ModifyWindow
                    isOpen={true}
                    ejercicio={ejercicio}
                    onClose={()=> setActiveWindowExModify(false)}
                    onSave={handleSaveEjercicio}
                ></ModifyWindow>
            ) : activeExWindowDelete ? (
                <DeleteWindow
                    isOpen={true}
                    ejercicio={ejercicio}
                    onClose={()=> setActiveExWindowDelete(false)}
                    onSave={handleSaveEjercicio}
                />
            ) : ""}
            </React.Fragment>
        )
}