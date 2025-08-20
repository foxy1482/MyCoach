import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { GetUserID } from "../../../utils/getUser";
import { GetUserDiet, ListDietFoods } from '../../../utils/getDiet.js';
import { useNavigate } from "react-router-dom";

export function ListFoods()
{
    const [dieta, setDieta] = useState(null);
    const [cliente, setCliente] = useState(null);
    const [comidas, setComidas] = useState(null);
    let token = Cookies.get('token');
    const navigate = useNavigate();
    useEffect(()=>
    {
        if (!token)
        {
            navigate('/');
            return;
        }
        const fetchData = async () => {
            try {
                const clienteData = await GetUserID(token);
                setCliente(clienteData);

                const dietaData = await GetUserDiet(clienteData.id);
                setDieta(dietaData);

                const comidasData = await ListDietFoods(dietaData.id);
                setComidas(comidasData);

            } catch (error) {
                console.error('Error obteniendo cliente:', error);
            }
        }
        fetchData();
    },[token,navigate])

    const retornarDivs = (comidas)=>
    {
        return comidas.map((c) => (
                <div key={c.comida_id} className="comida-container p-2.5 rounded-lg border border-neutral-500/50 w-full">
                    <h3 className="comida__title font-bold font-chalet-newyork">{c.nombre_comida}</h3>
                    <ul>
                        {c.alimentos.map((coAl)=>
                        (
                            <li key={coAl.id} className="comida-alimento p-1.5 border border-transparent border-b-neutral-500/50 grid grid-cols-3">
                                <p className="font-inter col-span-2">{coAl.nombre}</p>
                                <span className="font-inter font-bold text-end">{coAl.cantidad_g} g</span>
                            </li>
                        ))}
                    </ul>
                </div>
        ));
    }
    return (
        <div className="dashboard-foods my-3 p-3 border border-neutral-500/30 rounded-xs md:col-span-2">
            <h2 className="font-chalet-paris font-bold text-[1.75rem] my-6">Tus comidas de hoy</h2>
            {comidas && comidas.length > 0 ? retornarDivs(comidas) : "Cargando comidas..."}
        </div>
    )
}