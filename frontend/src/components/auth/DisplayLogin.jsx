import React, { useState } from "react"
import Cookies from 'js-cookie'
import '../../../css/StyleAuth.css'
import { DisplayDashboard } from "../main/dashboard/DisplayDashboard";
import { useNavigate } from "react-router-dom";

export function DisplayLogin() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [invalidos, setInvalidos] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://mycoach-yqq1.onrender.com/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
            },
                body: JSON.stringify({ username, password }),
            });
        
            if (!response.ok) {
                setInvalidos(true);
                throw new Error('Credenciales inválidas');
            } 
            if (invalidos) setInvalidos(false);
            const data = await response.json();
            Cookies.set('token', data.token, { expires: 1})
            navigate("/dashboard");
        } catch (error) {
            console.error('Error al loguear:', error.message);
        }
    };
    let isLogged = Cookies.get('token');
    window.addEventListener("load", ()=>
    {
        if (isLogged != null)
        {
            navigate('/dashboard')
        }
        else{
            console.log("No esta logueado")
        }
    })


    return (
        <React.Fragment>
            <div className="auth-card min-w-96 max-h-[850px] w-auto max-w-2xl my-12 m-auto flex flex-col bg-neutral-50 rounded-2xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] border border-zinc-500/40">
                <div className="w-40 h-12 justify-center items-center flex bg-green-300 rounded-tl-2xl rounded-br-3xl">
                    <div className="text-slate-500 text-2xl font-normal font-coda">Login</div>
                </div>
                <div className="separator mx-auto my-3 w-10/12 border border-neutral-600/50"></div>
                <form onSubmit={handleSubmit} className="form-container w-full max-w-xl p-8 h-auto mx-auto my-auto origin-rotate-180 outline-stone-500 flex flex-col">
                    <label htmlFor="form-username" className="authform__label select-none w-40 h-6 left-[32px] justify-start text-slate-500 text-base font-normal font-coda focus:outline-0">Nombre de usuario</label>
                    <input type='text' required id="form-username" value={username} onChange={(e) => setUsername(e.target.value)} className="authform__input w-full p-2 font-inter text-neutral-800/60 h-8 left-[30px] bg-neutral-200/50 rounded-lg" />
                    <label htmlFor="form-password" className="authform__label select-none w-40 h-6 left-[32px] justify-start text-slate-500 text-base font-normal font-coda focus:outline-0">Contraseña</label>
                    <input type='password' required id="form-password" value={password} onChange={(e) => setPassword(e.target.value)} className="authform__input w-full p-2 font-inter text-neutral-800/60 h-8 left-[30px]  bg-neutral-200/50 rounded-lg" />
                    <input type="submit" value="Iniciar sesión" className="authform__input w-50 max-h-9 mx-auto border border-teal-300 text-teal-300 hover:text-white  hover:bg-teal-300 text-lg font-normal font-coda rounded-lg shadow-[0px_0px_15px_1px_rgba(44,158,170,0.35)] my-10 mt-12 cursor-pointer" />
                    {invalidos ? (
                        <span className="text-red-600 font-inter">Credenciales inválidas.</span>
                    ) : ""}
                </form>
                <div className="auth-options mb-4 flex flex-col font-carlito text-neutral-500/80 mx-auto justify-center text-center">
                    <a href="/changepwd" className="options__forgot font-coda text-blue-500 transition hover:scale-120">¿Olvidaste tu contraseña?</a>
                    <a href="/register" className="options__register font-bold transition hover:scale-120 hover:text-neutral-700">Crear una cuenta</a>
                </div>
            </div>
        </React.Fragment>
    )
}