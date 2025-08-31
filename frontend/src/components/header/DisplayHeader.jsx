import React, { useEffect, useState } from "react";
import { ShowSvg } from "../utilities/ShowSvg";
import '../../../css/StyleNavbar.css'
import { LoadNavIcon } from "../utilities/LoadNavIcon";
import Cookies from 'js-cookie'
import { GetAuthUserID } from "../../utils/getUser";

export default function Header()
{
    let niSize = "30";
    let token = Cookies.get('token');
    const [esEntrenador, setEsEntrenador] = useState(null);
    useEffect(()=>
    {
        const fetchData = async ()=>
        {
            const usuarioData = await GetAuthUserID(token);
            
            if (usuarioData && usuarioData.rol.id == 2 || usuarioData.rol.id == 3) setEsEntrenador(true);
        }
        fetchData();
    })
    return (
        <header className="header w-full h-12 md:h-9 bg-green-300 relative mb-16 flex items-center">
            <div className="header-wrapper h-full w-fit grid grid-cols-3 mb-16 m-auto">
                <div className="left-nav-container flex flex-row gap-0 mx-auto w-fit content-center h-full">
                    <LoadNavIcon name={"inicio"} size={niSize}></LoadNavIcon>
                    <LoadNavIcon name={"rutinas"} size={niSize}></LoadNavIcon>
                    <LoadNavIcon name={"dietas"} size={niSize}></LoadNavIcon>
                    <LoadNavIcon name={"progreso"} size={niSize}></LoadNavIcon>
                </div>
                <div className="header__nav-container m-auto w-full flex justify-center">
                    <div className="header__nav min-w-96 w-auto h-13 flex justify-center text-center absolute -bottom-12">
                        <h2 className="w-fit h-8 m-auto justify-start -mt-1 text-emerald-800 text-2xl font-normal font-kodchasan">myCOACH!</h2>
                    </div>
                </div>
                <div className="right-nav-container flex flex-row m-x-auto w-full justify-end items-center max-h-8">
                    {esEntrenador ? (
                        <LoadNavIcon name={"panel"} size={niSize}></LoadNavIcon>
                    ) : ""}
                    <LoadNavIcon name={"soporte"} size={niSize}></LoadNavIcon>
                    <LoadNavIcon name={"usuario"} size={niSize}></LoadNavIcon>
                </div>
            </div>
        </header>
    )
}