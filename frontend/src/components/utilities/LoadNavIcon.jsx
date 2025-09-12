import React, { useState } from "react"
import { ShowSvg } from "./ShowSvg"
import { TrainerPanel } from "../header/TrainerPanel";
import { useNavigate } from "react-router-dom";

export function LoadNavIcon({ name, size })
{
    const navigate = useNavigate();
    const [activePanel, setActivePanel] = useState(false);

    let nameCap = name.charAt(0).toUpperCase() + name.slice(1)
    if (name == "panel") return (
        <React.Fragment>
            <button onClick={()=> setActivePanel(true)} className={`nav__link nav__link${name} group flex flex-col items-center px-4 z-10`}>
                <ShowSvg name={`${name}`} size={size} className="nav-icon mx-auto"></ShowSvg>
                <span className="group-hover:translate-0 z-5 group-hover:visible invisible -translate-y-20 text-nowrap absolute -bottom-8 items-center font-coda transition bg-yellow-200 text-neutral-400 rounded-lg px-4 py-1">
                    {nameCap}
                </span>
            </button>
            {activePanel ? (
                <TrainerPanel activePanel={activePanel} setActivePanel={setActivePanel}></TrainerPanel>
            ) : ""}
        </React.Fragment>
    )
    return (
        <button onClick={()=> navigate(name == "inicio" ? "/dashboard" : name == "usuario" ? "/perfil" : `/${name}`)} className={`cursor-pointer nav__link nav__link-${name} group flex flex-col items-center px-4 z-10`}>
            <ShowSvg name={`${name}`} size={size} className="nav-icon mx-auto"></ShowSvg>
            <span className={`group-hover:translate-0 z-5 group-hover:visible invisible -translate-y-20 text-nowrap absolute -bottom-8 items-center font-coda transition bg-yellow-200 text-neutral-400 rounded-lg px-4 py-1`}>
                {name == "usuario" ? "Mi perfil" : nameCap}
                </span>
        </button>
    )
}