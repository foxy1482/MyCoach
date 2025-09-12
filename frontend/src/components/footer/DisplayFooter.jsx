import React from "react";
import { useNavigate } from "react-router-dom";

export default function Footer()
{
    const navigate = useNavigate();
    return (
        <footer className="footer relative flex flex-col mt-12 bg-white w-full ">
            
            <div className="footer-container grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl m-auto relative ">
                <div className="footer-groupL flex flex-col">
                    <div className="footer-logo m-auto mt-12 md:my-auto flex flex-col">
                        <h2 className="footer__logo-title text-teal-500 text-5xl font-normal font-coda [text-shadow:_0px_0px_5px_rgb(60_255_177_/_0.50)]">myCOACH!</h2>
                        <span className="footer__logo-subtitle ml-24 text-zinc-700 text-lg font-normal font-carlito">Take control of your training.</span>
                    </div>
                </div>
                <div className="footer-groupR grid grid-cols-2 md:grid-cols-3 my-6 w-full md:w-fit p-1 md:mr-10">
                    <div className="separator col-span-2 md:col-span-1 md:row-span-2 mx-auto my-2 md:ml-auto md:mr-4 md:my-auto w-10/12 h-0.5 md:w-0 md:h-10/12 border-b md:border-l border-neutral-600/30"></div>
                    <div className="footer-sections max-w-72 m-auto my-0 flex flex-col p-4">
                        <h3 className="text-center text-black text-lg font-normal font-doppio-one">Secciones</h3>
                        <ul className="list-disc font-carlito">
                            <li className="ml-2.5 text-zinc-700 font-normal font-carlito"><button className="cursor-pointer" onClick={()=> navigate("/rutinas")}>Mis rutinas</button></li>
                            <li className="ml-2.5 text-zinc-700 font-normal font-carlito"><button className="cursor-pointer" onClick={()=> navigate("/dietas")}>Mis dietas</button></li>
                            <li className="ml-2.5 text-zinc-700 font-normal font-carlito"><button className="cursor-pointer" onClick={()=> navigate("/progreso")}>Mis controles</button></li>
                        </ul>
                    </div>
                    <div className="footer-auth max-w-72 m-auto my-0 flex flex-col p-4">
                        <h3 className="text-center text-black text-lg font-normal font-doppio-one">Autenticación</h3>
                        <ul className="list-disc font-carlito">
                            <li className="ml-2.5 text-zinc-700 font-normal font-carlito"><button className="cursor-pointer" onClick={()=> navigate("/perfil")}>Ver perfil</button></li>
                            <li className="ml-2.5 text-zinc-700 font-normal font-carlito"><button className="cursor-pointer" onClick={()=> navigate("/perfil/logout")}>Cerrar sesión</button></li>
                            <li className="ml-2.5 text-zinc-700 font-normal font-carlito"><button className="cursor-pointer" onClick={()=> navigate("/perfil#eliminar")}>Eliminar mi cuenta</button></li>
                        </ul>
                    </div>
                    <div className="footer-contact max-w-72 m-auto my-0 flex flex-col col-span-2 mb-12">
                        <h3 className="text-center text-black text-lg font-normal font-doppio-one">Contacto</h3>
                        <ul className="left-[615px] top-[67px] justify-start">
                            <li className="ml-2.5 text-zinc-700 font-normal font-carlito"><span className="font-bold">Teléfono</span> +5491130307604</li>
                            <li className="ml-2.5 text-zinc-700 font-normal font-carlito"><span className="font-bold">Correo</span> lastratobiaspp@gmail.com</li>
                        </ul>
                    </div>
                </div>
            </div>
            <picture alt="" className="absolute left-0 bottom-0">
                <source media="(max-width: 500px)" srcSet="/img/footer-figure.svg" />
                <source media="(min-width: 501px) and (max-width: 1120px)" srcSet="/img/footer-figure2.svg" />
                <source media="(min-width: 1121px) and (max-width: 1550px)" srcSet="/img/footer-figure3.svg" />
                <source media="(max-width: 1800px)" srcSet="/img/footer-figure4.svg" />
                <img src="/img/footer-figure3.svg" alt="" />
            </picture>
        </footer>
    )
}