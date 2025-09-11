import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { GetUserID } from "../../../utils/getUser";
import { GetFoodCals, GetUserDiet, ListDietMeals } from '../../../utils/getDiet.js';
import { useNavigate } from "react-router-dom";
import { ShowSvg } from "../../utilities/ShowSvg.jsx"; 


export function ListFoods()
{
    const [dieta, setDieta] = useState(null);
    const [cliente, setCliente] = useState(null);
    const [comidas, setComidas] = useState(null);
    const [calsTotal, setCalsTotal] = useState(0);

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

                const comidasData = await ListDietMeals(dietaData.id);

                const comidasCalData = await GetFoodCals(dietaData.id);
                
                const comidasFusionadas = await comidasData.map(comida => {
                        const extras = comidasCalData.find(c => c.comida_id === comida.comida_id);
                        return { ...comida, ...extras };
                    }
                );
                    
                const totalKcal = comidasFusionadas.reduce((acum, comida) => acum + comida.calorias_totales, 0);
                setComidas(comidasFusionadas);
                setCalsTotal(totalKcal);


                console.log(comidas)
            } catch (error) {
                console.error('Error obteniendo cliente:', error);
            }
        }
        fetchData();
    },[token,navigate])

    const retornarDivs = (comidas)=>
    {
        return comidas.map((c, index) => (
                <div key={c.comida_id} className={`comida-container p-2.5 w-full bg-gradient-to-br from-${index == 0 ? "orange-500 to-yellow-50" : index == 1 ? "blue-50 to-cyan-50" : index == 2 ? "purple-50 to-indigo-50" : "white to-white"} rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition`}>
                    <div className="flex items-center justify-between my-4">
                        <div className="comida-header">
                            <h3 className="comida__title font-bold font-inter">{c.nombre_comida}</h3>
                        </div>
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">{Math.round(c.calorias_totales)} kcal</span>
                    </div>
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
        <div className="dashboard-foods my-3 p-3 rounded-xs md:col-span-2">
            <div className="foods-header flex flex-row items-center justify-between my-6">
                <h2 className="font-inter font-bold text-[1.75rem] my-6 flex flex-row items-center gap-x-2">
                    <ShowSvg name={"stars"} size={24} className="text-primary"></ShowSvg>
                    Tus comidas de Hoy
                </h2>
                <div className="bg-primary text-white rounded-full px-4 py-2 text-sm font-medium">{Math.round(calsTotal)} kcal</div>
            </div>
            
            <div className="space-y-6">
                {comidas && comidas.length > 0 ? retornarDivs(comidas) : "Cargando comidas..."}
            </div>
        </div>
    )
}