import React from "react"
import { ShowSvg } from "./ShowSvg"

export function LoadNavIcon({ name, size })
{
    let nameCap = name.charAt(0).toUpperCase() + name.slice(1)
    return (
        <a href={name == "inicio" ? "/dashboard" : name == "usuario" ? "/perfil" : `/${name}` } className={`nav__link nav__link-${name} group flex flex-col items-center px-4 z-10`}>
            <ShowSvg name={`${name}`} size={size} className="nav-icon mx-auto"></ShowSvg>
            <span className={`group-hover:translate-0 z-5 group-hover:visible invisible -translate-y-20 text-nowrap absolute -bottom-8 items-center font-coda transition bg-yellow-200 text-neutral-400 rounded-lg px-4 py-1`}>
                {name == "usuario" ? "Mi perfil" : nameCap}
                </span>
        </a>
    )
}