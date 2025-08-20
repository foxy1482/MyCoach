import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function DisplayChangePW()
{
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [data, setData] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:8000/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
            },
                body: JSON.stringify({ email }),
            });
        
            if (!response.ok) {
                throw new Error('Credenciales inválidas');
            } 
        
            const dataNew = await response.json();
            setData(dataNew);
        } catch (error) {
            console.error('Error al enviar el correo:', error.message);
        }
    };

    const volverLogin = ()=>
    {
        navigate("/")
    }

    const checkerMail =()=>
    (
        data != null ? (
            <div className="auth-card-ready min-w-96 w-auto max-w-2xl my-12 m-auto flex flex-col bg-neutral-50 rounded-2xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] border border-zinc-500/40">
                <div className="w-65 h-12 justify-center items-center flex bg-green-300 rounded-tl-2xl rounded-br-3xl">
                    <div className="text-slate-500 text-2xl font-normal font-coda">Contraseña olvidada</div>
                </div>
                <div className="separator mx-auto my-3 w-10/12 border border-neutral-600/50"></div>
                <div className="auth-card__message-container p-5 py-24 flex flex-col">
                    <h2 className="text-xl font-inter font-bold">Aviso</h2>
                    <span className="font-inter">{data.msg}</span>
                    <button onClick={volverLogin} className="m-auto my-4 px-6 py-2 bg-red-300 rounded-lg font-coda text-xl text-white hover:bg-red-400 cursor-pointer">Volver</button>
                </div>
            </div>
        ) : ( <div className="auth-card min-w-96 max-h-[850px] w-auto max-w-2xl my-12 m-auto flex flex-col bg-neutral-50 rounded-2xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] border border-zinc-500/40">
            <div className="w-96 h-full relative overflow-hidden flex flex-col rounded-tl-2xl">
                <div className="w-65 h-12 justify-center items-center flex bg-green-300 rounded-tl-2xl rounded-br-3xl">
                    <div className="text-slate-500 text-2xl font-normal font-coda">Contraseña olvidada</div>
                </div>
                <div className="separator mx-auto my-3 w-10/12 border border-neutral-600/50"></div>
                    <form onSubmit={handleSubmit} className="form-container w-full max-w-xl p-8 h-auto mx-auto my-auto origin-rotate-180 outline-stone-500 flex flex-col px-5">
                        <h2 className="text-xl font-inter font-bold">Introduce tu correo electrónico</h2>
                        <span className="font-inter">Te enviaremos un enlace para que puedas cambiar tu contraseña</span>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="authform__input w-full p-2 font-inter text-neutral-800/60 h-8 left-[30px]  bg-neutral-200/50 rounded-lg"/>
                        <input type="submit" value="Enviar" className="authform__input w-50 max-h-9 mx-auto border border-teal-300 text-teal-300 hover:text-white  hover:bg-teal-300 text-lg font-normal font-coda rounded-lg shadow-[0px_0px_15px_1px_rgba(44,158,170,0.35)] my-10 mt-12 cursor-pointer" />
                    </form>
                </div>
            </div>
    ))
    return checkerMail();
}