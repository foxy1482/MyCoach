import React from "react";
import { ShowSvg } from "../utilities/ShowSvg";

export function TrainerPanel({ activePanel, setActivePanel })
{
    return (
        <div className="oscuro top-0 left-0 fixed w-full h-full flex items-center bg-black/25 z-20">
            <div className="bg-white shadow-lg p-1 m-auto flex flex-col">
                <button onClick={() => setActivePanel(false)} className="bg-red-400 rounded-full text-white hover:bg-neutral-500 cursor-pointer transition w-fit">
                    <ShowSvg size="20" name="cross"></ShowSvg>
                </button>
                <h2 className="font-semibold text-2xl p-7">Seleccione qué gestionar</h2>
                <ul className="list flex flex-col bg-linear-to-b from-transparent to-secondary/15 p-7 gap-y-4">
                    <li className="p-3 bg-primary/10 hover:bg-secondary/25 rounded-lg flex flex-row transition duration-100 cursor-pointer">
                        <ShowSvg name={"usuario"} size={"20"} className="mx-3"></ShowSvg>
                        <a href="/myClients/" className="font-coda text-lg text-start text-neutral-500">Mis clientes</a>
                    </li>
                    <li className="p-3 bg-primary/10 hover:bg-secondary/25 rounded-lg flex flex-row transition duration-100 cursor-pointer">
                    <ShowSvg name={"planes"} size={"20"} className="mx-3"></ShowSvg>
                        <a href="/myPlans/" className="font-coda text-lg text-start text-neutral-500">Mis planes</a>
                    </li>
                    <li className="p-3 bg-primary/10 hover:bg-secondary/25 rounded-lg flex flex-row transition duration-100 cursor-pointer">
                        <ShowSvg name={"rutinas"} size={"20"} className="mx-3"></ShowSvg>
                        <a href="/myRoutines/" className="font-coda text-lg text-start text-neutral-500">Mis rutinas</a>
                    </li>
                    <li className="p-3 bg-primary/10 hover:bg-secondary/25 rounded-lg flex flex-row transition duration-100 cursor-pointer">
                        <ShowSvg name={"dietas"} size={"20"} className="mx-3"></ShowSvg>
                        <a href="/myDiets/" className="font-coda text-lg text-start text-neutral-500">Mis dietas</a>
                    </li>
                </ul>
            </div>
        </div>
    )
}