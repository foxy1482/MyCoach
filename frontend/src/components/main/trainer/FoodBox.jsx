import React, { act, useEffect, useState } from "react"
import { GetUserByID } from "../../../utils/getUser";
import { LoadAllIcons } from "../../utilities/LoadCRUDIcons";
import { GetExerciseData, ListRExercises } from "../../../utils/getRoutine";
import { GetPlanByID } from "../../../utils/getPlan";
import { ShowSvg } from "../../utilities/ShowSvg";
import { useNavigate } from "react-router-dom";
import '../../../../css/StyleTrainerRoutine.css'
import { ModifyWindow } from './alimentosCRUD/ModifyWindow.jsx'
import { DeleteWindow } from "./alimentosCRUD/DeleteWindow.jsx";


export function FoodBox({ alimento, token, activeWindowDeleteF, setActiveWindowDeleteF, handleSaveAlimento, activeWindowModifyF, setActiveWindowModifyF, activeWindowCreateF, setActiveWindowCreateF })
{
    const clavesNutris = ["proteinas","grasas","carbohidratos"];

    const propiedadMaxima = clavesNutris.reduce((maxKey, key) => {
        return alimento[key] > alimento[maxKey] ? key : maxKey;
    });
    const totalMacros = clavesNutris.reduce((sum, key) => sum + alimento[key], 0);

    const porcentajes = Object.fromEntries(
        clavesNutris.map(key => [
            key,
            ((alimento[key] / totalMacros) * 100).toFixed(2) + "%"
        ])
    );
    

    function capitalizar(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    const retornarInformacion = ()=>
        (
            <div className="info p-3.5 flex flex-col">
                <div className="text-center my-8 col-span-2">
                    <div className={`inline-flex p-6 rounded-full mb-6 ${propiedadMaxima == "proteinas" ? "bg-red-100" : propiedadMaxima == "grasas" ? "bg-yellow-100" : "bg-orange-100"}`}>
                        <ShowSvg name={"apple"} size={80} className={propiedadMaxima == "proteinas" ? "text-red-600" : propiedadMaxima == "grasas" ? "text-yellow-600" : "text-orange-600"}></ShowSvg>
                    </div>
                    <h1 className="font-inter text-4xl my-4 py-2 col-span-2 font-bold lg:col-span-1 m-auto text-center">{alimento.nombre}</h1>
                    <div className={`inline-flex items-center px-6 py-3 rounded-full border-2
                        ${propiedadMaxima == "proteinas" ? "bg-red-100 text-red-600 border-red-200" : propiedadMaxima == "grasas" ? "bg-yellow-100 text-yellow-600 border-yellow-200" : "bg-orange-100 text-orange-600 border-orange-200"}`}>
                        <span className="font-semibold text-lg font-inter">{capitalizar(propiedadMaxima)}</span>
                    </div>
                    <div className="buttons flex flex-row w-fit m-auto gap-x-4 mt-5">
                        <button onClick={()=> setActiveWindowModifyF(true)} className="cursor-pointer ml-auto lg:mx-auto flex flex-row bg-yellow-300/25 text-white justify-center p-4 rounded-2xl font-medium hover:bg-yellow-300/50 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 items-center space-x-2">
                            <ShowSvg name={"modify"} size={32}></ShowSvg>
                        </button>
                        <button onClick={()=> setActiveWindowDeleteF(true)} className="cursor-pointer ml-auto lg:mx-auto flex flex-row bg-red-500/10 text-white justify-center p-4 rounded-2xl font-medium hover:bg-red-500/20 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 items-center space-x-2">
                            <ShowSvg name={"delete"} size={32} className="text-red-400"></ShowSvg>
                        </button>
                        
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-gray-900 my-4">Macronutrientes (100g)</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <li className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition duration-300 hover hover:-translate-y-1">
                                <div className="bg-primary/10 p-4 rounded-full inline-flex mb-4">
                                    <ShowSvg name={"fire"} size={24} className="text-primary"></ShowSvg>
                                </div>
                                <p className="text-3xl  font-bold text-gray-900 my-2">{alimento.calorias_100g}</p>
                                <p className="text-sm font-medium text-gray-600">Calorías</p>
                            </li>
                            <li className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition duration-300 hover hover:-translate-y-1">
                                <div className="bg-red-100 p-4 rounded-full inline-flex mb-4">
                                    <ShowSvg name={"fire"} size={24} className="text-red-600"></ShowSvg>
                                </div>
                                <p className="text-3xl  font-bold text-gray-900 my-2">{alimento.proteinas.toFixed(2)} g</p>
                                <p className="text-sm font-medium text-gray-600">Proteínas</p>
                            </li>
                            <li className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition duration-300 hover hover:-translate-y-1">
                                <div className="bg-orange-100 p-4 rounded-full inline-flex mb-4">
                                    <ShowSvg name={"stars"} size={24} className="text-orange-600"></ShowSvg>
                                </div>
                                <p className="text-3xl  font-bold text-gray-900 my-2">{alimento.carbohidratos.toFixed(2)} g</p>
                                <p className="text-sm font-medium text-gray-600">Carbohidratos</p>
                            </li>
                            <li className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition duration-300 hover hover:-translate-y-1">
                                <div className="bg-yellow-100 p-4 rounded-full inline-flex mb-4">
                                    <ShowSvg name={"grasa"} size={24} className="text-yellow-600"></ShowSvg>
                                </div>
                                <p className="text-3xl  font-bold text-gray-900 my-2">{alimento.grasas.toFixed(2)} g</p>
                                <p className="text-sm font-medium text-gray-600">Grasas</p>
                            </li>
                        </ul>
                        <div className="mt-8 bg-white/70 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-gray-900 my-4 text-center">
                                Distribución de macronutrientes
                            </h3>
                            <div className="flex items-center space-x-8 gap-y-2 justify-center">
                                <div className="text-center">
                                    <div className="size-4 bg-red-500 rounded-full mx-auto"></div>
                                    <p className="text-sm font-medium text-gray-700">Proteínas</p>
                                    <p className="text-xs text-gray-500">{porcentajes.proteinas}</p>
                                </div>
                                <div className="text-center">
                                    <div className="size-4 bg-orange-500 rounded-full mx-auto"></div>
                                    <p className="text-sm font-medium text-gray-700">Carbohidratos</p>
                                    <p className="text-xs text-gray-500">{porcentajes.carbohidratos}</p>
                                </div>
                                <div className="text-center">
                                    <div className="size-4 bg-yellow-500 rounded-full mx-auto"></div>
                                    <p className="text-sm font-medium text-gray-700">Grasas</p>
                                    <p className="text-xs text-gray-500">{porcentajes.grasas}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        )
        return (
            <React.Fragment>
            <div className="routine-info m-8 bg-white rounded-2xl shadow-lg p-8 md:row-span-2">
                {Object.keys(alimento).length > 0 ? retornarInformacion() : (
                    <div className="rounded-lg">
                    <p className="font-inter text-lg">Cargando datos..</p>
                    </div>
                )}
            </div>
            {activeWindowModifyF ? (
                <ModifyWindow
                    isOpen={true}
                    alimento={alimento}
                    onClose={()=> setActiveWindowModifyF(false)}
                    onSave={handleSaveAlimento}
                ></ModifyWindow>
            ) : activeWindowDeleteF ? (
                <DeleteWindow
                    isOpen={true}
                    alimento={alimento}
                    onClose={()=> setActiveWindowDeleteF(false)}
                    onSave={handleSaveAlimento}
                />
            ) : ""}
            </React.Fragment>
        )
}