import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom"
import { GetAuthUserID } from '../../utils/getUser.js'

export function DisplayStart() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        edad: 0,
        sexo: "",
    });
    const [usuario, setUsuario] = useState({});
    const token = Cookies.get('token');

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm({ ...form, [name]: type === "number" ? Number(value) : value });
    };

    useEffect(()=>
    {
        if (!token)
        {
            navigate('/');
            return;
        }
        const fetchCliente = async () => {
            try {
                const data = await GetAuthUserID(token);
                setUsuario(data);
            } catch (error) {
                console.error('Error obteniendo cliente:', error);
            }
        };
        fetchCliente();
    },[token])
    const handleSubmit = async (e) => {
            e.preventDefault();
            const datosCuenta = {
                ... form,
                "usuario_id" : usuario.id
            }
            try
            {
                const responseForm = await fetch("/api/api/clientes/crear",{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(datosCuenta)
                })
                console.log(datosCuenta)
                if (!responseForm.ok) {
                    throw new Error('Credenciales inválidas');
                }
                navigate("/dashboard");
            } catch (error)
            {
                console.error("Error al registrar los datos del cliente: ", error)
            }
        };
    

    return (
        <div className="flex items-center justify-center min-h-screen font-inter">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl"
            >
                <h2 className="text-2xl font-bold mb-4 text-indigo-700">Termina de crear tu cuenta</h2>
                <h3 className="text-lg mb-6">Es necesario que completes los siguientes datos para poder utilizar la plataforma.</h3>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="nombre">
                        Tu nombre
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="apellido">
                        Apellido
                    </label>
                    <input
                        type="text"
                        id="apellido"
                        name="apellido"
                        value={form.apellido}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="edad">
                        Edad
                    </label>
                    <input
                        type="number"
                        id="edad"
                        name="edad"
                        value={form.edad}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        min="0"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Sexo</label>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="sexo"
                                value="M"
                                checked={form.sexo === "M"}
                                onChange={handleChange}
                                className="accent-indigo-500"
                                required
                            />
                            <span className="ml-2">Masculino</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="sexo"
                                value="F"
                                checked={form.sexo === "F"}
                                onChange={handleChange}
                                className="accent-pink-500"
                                required
                            />
                            <span className="ml-2">Femenino</span>
                        </label>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition hover:cursor-pointer"
                >
                    Continuar
                </button>
            </form>
        </div>
    );
}