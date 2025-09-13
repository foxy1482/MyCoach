import React from "react";
import { ShowSvg } from "../utilities/ShowSvg";
import { useNavigate } from "react-router-dom";

export function TrainerPanel({ activePanel, setActivePanel })
{
    const navigate = useNavigate();
    return (
        <div className="oscuro top-0 left-0 fixed w-full h-full flex items-center bg-black/25 z-20">
            <div className="trainer-panel bg-white shadow-xl shadow-white/35 p-1 m-auto flex flex-col rounded-lg">
                <button onClick={() => setActivePanel(false)} className="bg-red-400 rounded-full text-white hover:bg-neutral-500 cursor-pointer transition w-fit">
                    <ShowSvg size="20" name="cross"></ShowSvg>
                </button>
                <h2 className="font-semibold text-2xl p-7">Seleccione qué gestionar</h2>
                <ul className="list flex flex-col bg-linear-to-b from-transparent to-secondary/15 px-7 py-5 gap-y-4">
                    <li className="p-3 bg-primary/10 hover:bg-secondary/25 rounded-lg flex flex-row transition duration-100 cursor-pointer">
                        <ShowSvg name={"usuario"} size={"20"} className="mx-3"></ShowSvg>
                        <button onClick={()=> {navigate("/myClients/"); setActivePanel(false)}} className="cursor-pointer font-coda text-lg text-start text-neutral-500 py-1 w-full">Mis clientes</button>
                    </li>
                    <li className="p-3 bg-primary/10 hover:bg-secondary/25 rounded-lg flex flex-row transition duration-100 cursor-pointer">
                    <ShowSvg name={"planes"} size={"20"} className="mx-3"></ShowSvg>
                        <button onClick={()=> {navigate("/myPlans/"); setActivePanel(false)}} className="cursor-pointer font-coda text-lg text-start text-neutral-500 py-1 w-full">Mis planes</button>
                    </li>
                    <li className="p-3 bg-primary/10 hover:bg-secondary/25 rounded-lg flex flex-row transition duration-100 cursor-pointer">
                        <ShowSvg name={"rutinas"} size={"20"} className="mx-3"></ShowSvg>
                        <button onClick={()=> {navigate("/myRoutines/"); setActivePanel(false)}} className="cursor-pointer font-coda text-lg text-start text-neutral-500 py-1 w-full">Mis rutinas</button>
                    </li>
                    <li className="p-3 bg-primary/10 hover:bg-secondary/25 rounded-lg flex flex-row transition duration-100 cursor-pointer">
                        <ShowSvg name={"fire"} size={"20"} className="mx-3"></ShowSvg>
                        <button onClick={()=> {navigate("/myExercises/"); setActivePanel(false)}} className="cursor-pointer font-coda text-lg text-start text-neutral-500 py-1 w-full">Mis ejercicios</button>
                    </li>
                    <li className="p-3 bg-primary/10 hover:bg-secondary/25 rounded-lg flex flex-row transition duration-100 cursor-pointer">
                        <ShowSvg name={"dietas"} size={"20"} className="mx-3"></ShowSvg>
                        <button onClick={()=> {navigate("/myDiets/"); setActivePanel(false)}} className="cursor-pointer font-coda text-lg text-start text-neutral-500 py-1 w-full">Mis dietas</button>
                    </li>
                    <li className="p-3 bg-primary/10 hover:bg-secondary/25 rounded-lg flex flex-row transition duration-100 cursor-pointer">
                        <ShowSvg name={"apple"} size={"20"} className="mx-3"></ShowSvg>
                        <button onClick={()=> {navigate("/myFoods/"); setActivePanel(false)}} className="cursor-pointer font-coda text-lg text-start text-neutral-500 py-1 w-full">Mis alimentos</button>
                    </li>
                </ul>
            </div>
        </div>
    )
}