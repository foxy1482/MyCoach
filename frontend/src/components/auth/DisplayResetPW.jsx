import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/config";

export function DisplayResetPW()
{
    const [error, setError] = useState('');
    const [data, setData] = useState(null);
    const [newPass, setNewPass] = useState('');
    const [newPassRep, setNewPassRep] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (newPass != newPassRep)
        {
            setError("Las contraseñas no coinciden.");
            return;
        }
        try {
            const fetchLink = window.location.pathname
            const tokenPrev = new URLSearchParams(window.location.search);
            const tokenReady = tokenPrev.get('token');
            const response = await fetch(`${API_URL}/auth${fetchLink}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
            },
                body: JSON.stringify({ token: tokenReady, new_password: newPass }),
            });
        
            if (!response.ok) {
                throw new Error('Credenciales inválidas');
            } 
            const dataNew = await response.json();
            setData(dataNew);
        } catch (error) {
            console.error('Error al loguear:', error.message);
            setError(error.message)
        }
    };

    const volverLogin = ()=>
    {
        navigate("/")
    }

    if (data != null) return (
        <div className="auth-card-ready min-w-96 w-auto max-w-2xl my-12 m-auto flex flex-col bg-neutral-50 rounded-2xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] border border-zinc-500/40">
            <div className="w-65 h-12 justify-center items-center flex bg-green-300 rounded-tl-2xl rounded-br-3xl">
                <div className="text-slate-500 text-2xl font-normal font-coda">Contraseña olvidada</div>
            </div>
            <div className="separator mx-auto my-3 w-10/12 border border-neutral-600/50"></div>
            <div className="auth-card__message-container p-5 py-24 flex flex-col">
                <h2 className="text-xl font-inter font-bold">Aviso</h2>
                <span className="font-inter">{data.message}</span>
                <button onClick={volverLogin} className="m-auto my-4 px-6 py-2 bg-red-300 rounded-lg font-coda text-xl text-white hover:bg-red-400 cursor-pointer">Volver</button>
            </div>
        </div>
    )
    else return (
        <div className="auth-card min-w-96 max-h-[850px] w-auto max-w-2xl my-12 m-auto flex flex-col bg-neutral-50 rounded-2xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] border border-zinc-500/40">
            <div className="w-65 h-12 justify-center items-center flex bg-green-300 rounded-tl-2xl rounded-br-3xl">
                <div className="text-slate-500 text-2xl font-normal font-coda">Contraseña olvidada</div>
            </div>
            <div className="separator mx-auto my-3 w-10/12 border border-neutral-600/50"></div>
            <form onSubmit={handleSubmit} className="form-container w-full max-w-xl p-8 h-auto mx-auto my-auto origin-rotate-180 outline-stone-500 flex flex-col">
                <label htmlFor="form-username" className="authform__label select-none h-6 left-[32px] justify-start text-slate-500 text-base font-normal font-coda focus:outline-0">Nueva contraseña</label>
                <input type='password' required id="form-newpassword" value={newPass} onChange={(e) => setNewPass(e.target.value)} className="authform__input w-full p-2 font-inter text-neutral-800/60 h-8 left-[30px] bg-neutral-200/50 rounded-lg" />
                <label htmlFor="form-password" className="authform__label select-none h-6 left-[32px] justify-start text-slate-500 text-base font-normal font-coda focus:outline-0">Repetir nueva contraseña</label>
                <input type='password' required id="form-password" value={newPassRep} onChange={(e) => setNewPassRep(e.target.value)} className="authform__input w-full p-2 font-inter text-neutral-800/60 h-8 left-[30px]  bg-neutral-200/50 rounded-lg" />
                <input type="submit" value="Iniciar sesión" className="authform__input w-50 max-h-9 mx-auto border border-teal-300 text-teal-300 hover:text-white  hover:bg-teal-300 text-lg font-normal font-coda rounded-lg shadow-[0px_0px_15px_1px_rgba(44,158,170,0.35)] my-10 mt-12 cursor-pointer" />
                {error && <p className="text-red-500 font-inter text-sm text-center">{error}</p>}
            </form>
        </div>
    )
}