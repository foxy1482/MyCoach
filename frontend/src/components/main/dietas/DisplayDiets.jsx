import {useNavigate} from "react-router-dom"
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { GetAuthUserID, GetUserID } from "../../../utils/getUser.js";
import { GetPlanByID } from "../../../utils/getPlan.js";
import { ShowSvg } from "../../utilities/ShowSvg.jsx";
import { GetDietAsignationData, GetFoodCals, GetUserDiet, ListDietMeals, GetFood } from "../../../utils/getDiet.js";
import '../../../../css/StyleDisplayDiets.css'
import { TrainerDisplayDiets } from "./TrainerDisplayDiets.jsx";
import { ClientModalMeal } from "./ClientModalMeal.jsx";
import { LoadScreen } from "../../utilities/LoadScreen.jsx";
import '../../../../css/StyleListFoods.css';

export function DisplayDiets()
{
    const [cantComidas, setCantComidas] = useState(0);
    const [macrosTotal, setMacrosTotal] = useState({});
    const [dieta, setDieta] = useState({});
    const [comidas, setComidas] = useState({});
    const [plan, setPlan] = useState({});
    const [esEntrenador, setEsEntrenador] = useState(false);
    const [modalActivo, setModalActivo] = useState(false);
    const [comidaModal, setComidaModal] = useState(null);
    const [noDieta, setNoDieta] = useState(false);

    let token = Cookies.get('token');
    const navigate = useNavigate();
    useEffect(()=>
    {
        if (!token)
        {
            navigate('/');
            return;
        }

        const tiempoTranscurrido = (fechaISO)=>{
            const fecha = new Date(fechaISO);
            const ahora = new Date();

            const diffMs = ahora - fecha;
            const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diffMeses = Math.floor(diffDias / 30.44); // promedio de días por mes
            const diffAnios = Math.floor(diffMeses / 12);

            if (diffAnios >= 1) {
                return diffAnios === 1 ? "1 año" : `${diffAnios} años`;
            } else if (diffMeses >= 1) {
                return diffMeses === 1 ? "1 mes" : `${diffMeses} meses`;
            } else {
                return diffDias === 1 ? "1 día" : `${diffDias} días`;
            }
        }

        const fetchData = async () => {
            try {
                const clienteData = await GetUserID(token);
                const usuarioData = await GetAuthUserID(token);
                
                if (usuarioData && usuarioData.rol.id == 2 || usuarioData.rol.id == 3) setEsEntrenador(true);

                const dietaData = await GetUserDiet(clienteData.id);
                if (await dietaData.detail) setNoDieta(true);

                const dietaInfoData = await GetDietAsignationData(clienteData.id)
                const informacionDieta = {
                    ...dietaData,
                    ...dietaInfoData
                }
                setDieta({...informacionDieta, since_days: tiempoTranscurrido(informacionDieta.fecha_asignacion)});

                const planData = await GetPlanByID(informacionDieta.plan_id);
                setPlan(planData)

                const comidasData = await ListDietMeals(dietaData.id);

                const comidasCalsData = await GetFoodCals(dietaData.id);

                // Le agrega las kcal de cada una
                const comidasFusionadas = await Promise.all(
                    comidasData.map(async (comida) => {
                        
                        let comidaBase = comidasCalsData.find(c => c.comida_id === comida.comida_id);
                    
                        if (!comidaBase) comidaBase = {};
                    
                        const alimentosConMacros = await Promise.all(
                            comida.alimentos.map(async (alimento) => {
                                const alimentoInfo = await GetFood(alimento.id);
                            
                                return {
                                    ...alimento,
                                    ...alimentoInfo
                                };
                            })
                        );
                    
                        return {
                            ...comida,
                            ...comidaBase,
                            alimentos: alimentosConMacros
                        };
                    })
                );
                const totalComidas = comidasFusionadas.length;
                const totalKcal = comidasFusionadas.reduce((acum, comida) => acum + comida.calorias_totales, 0);
                const totalCarb = comidasFusionadas.reduce((acum, comida) => acum + comida.carbohidratos_g, 0);
                const totalProte = comidasFusionadas.reduce((acum, comida) => acum + comida.proteinas_g, 0);
                const totalGrasa = comidasFusionadas.reduce((acum, comida) => acum + comida.grasas_g, 0);
                            
                setComidas(comidasFusionadas);
                setMacrosTotal({
                    "calorias": totalKcal,
                    "carbohidratos" : totalCarb,
                    "proteinas" : totalProte,
                    "grasas" : totalGrasa
                });
                setCantComidas(totalComidas);
            } catch (error) {
                console.error('Error obteniendo cliente:', error);
            }
        }
    fetchData();
    },[token,navigate])

    const retornarInformacion = ()=>
    (
        <div className="info p-3.5 flex flex-col lg:grid lg:grid-cols-2 lg:grid-rows-2">
            <p className="font-inter text-3xl py-2 font-bold">{dieta.nombre}</p>
            <div className="flex justify-end lg:row-start-1 lg:col-start-2 row-start-3 ">
                    <button className="hidden bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 items-center space-x-2">
                        <span className="font-normal font-chalet-paris text-3xl">+</span>
                        <span className="font-inter font-semibold text-lg">Agregar comida</span>
                    </button>
                    <button className="hidden bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 items-center space-x-2">
                        <ShowSvg name={"stars"} size={24}></ShowSvg>
                        <span className="font-inter font-semibold text-lg">Crear comida</span>
                    </button>
                </div>
            <div className="icons flex flex-col lg:flex-row gap-x-4 lg:col-span-2 my-2">
                <div className="font-inter text-lg text-gray-600 py-2 flex items-center">
                    <div className="size-4 mx-1  bg-primary rounded-full mr-2"></div>
                    {plan.nombre}
                </div>
                
                <div className="font-inter text-lg text-gray-600 py-2 flex items-center">
                    <ShowSvg name={"relojArena"} size={24} className="fill-orange-500 stroke-orange-500 text-orange-500 mr-1"></ShowSvg>
                    <span className="font-bold mr-1">{dieta.since_days}</span>con la dieta
                </div>
            </div>
            <div className="useful-data grid grid-cols-1 md:grid-cols-5 gap-3 font-inter col-span-2">
                <div className="cuadro bg-orangeM/10 p-4 rounded-xl">
                    <div className="cuadro-container flex items-center justify-between">
                        <div className="cuadro-data">
                            <p className="text-orangeM text-sm font-medium">Comidas</p>
                            <p className="text-2xl font-bold text-gray-900">{cantComidas}</p>
                        </div>
                        <div className="cuadro-icon flex items-center">
                            <ShowSvg name={"clock"} size={40} className="text-orangeM m-auto"></ShowSvg>
                        </div>
                    </div>
                </div>
                <div className="cuadro bg-primary/10 p-4 rounded-xl">
                    <div className="cuadro-container flex items-center justify-between">
                        <div className="cuadro-data">
                            <p className="text-primary text-sm font-medium">Calorías totales</p>
                            <p className="text-2xl font-bold text-gray-900">{macrosTotal.calorias.toFixed(2)}</p>
                        </div>
                        <div className="cuadro-icon flex items-center">
                            <ShowSvg name={"fire"} size={32} className="text-primary m-auto"></ShowSvg>
                        </div>
                    </div>
                </div>
                <div className="cuadro bg-purple-500/10 p-4 rounded-xl">
                    <div className="cuadro-container flex items-center justify-between">
                        <div className="cuadro-data">
                            <p className="text-purple-500 text-sm font-medium">Carbohidratos</p>
                            <p className="text-2xl font-bold text-gray-900">{macrosTotal.carbohidratos.toFixed(2) + " g"}</p>
                        </div>
                        <div className="cuadro-icon flex items-center">
                            <ShowSvg name={"lightning"} size={32} className="text-purple-500 m-auto"></ShowSvg>
                        </div>
                    </div>
                </div>
                <div className="cuadro bg-red-400/10 p-4 rounded-xl">
                    <div className="cuadro-container flex items-center justify-between">
                        <div className="cuadro-data">
                            <p className="text-red-400 text-sm font-medium">Proteínas</p>
                            <p className="text-2xl font-bold text-gray-900">{macrosTotal.proteinas.toFixed(2) + " g"}</p>
                        </div>
                        <div className="cuadro-icon flex items-center">
                            <ShowSvg name={"bars"} size={32} className="stroke-red-400 fill-red-400 m-auto"></ShowSvg>
                        </div>
                    </div>
                </div>
                <div className="cuadro bg-blue-500/10 p-4 rounded-xl">
                    <div className="cuadro-container flex items-center justify-between">
                        <div className="cuadro-data">
                            <p className="text-blue-500 text-sm font-medium">Grasas</p>
                            <p className="text-2xl font-bold text-gray-900">{macrosTotal.grasas.toFixed(2) + " g"}</p>
                        </div>
                        <div className="cuadro-icon flex items-center">
                            <ShowSvg name={"grasa"} size={32} className="text-blue-500 m-auto"></ShowSvg>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )

    const retornarComidas = ()=>
    {
        return <ul className="comidas-lista flex flex-col gap-y-4 font-inter lg:grid lg:grid-cols-2 gap-6">
                    {comidas.map((comida, index)=> (
                        <li key={comida} className={`comidas-lista__li bg-gradient-to-br ${comida.orden == 1 ? "from-orange-50 to-yellow-50 border-orange-200 text-orange-600" : comida.orden == cantComidas ? "from-purple-50 to-purple-50 border-purple-200 text-purple-600" : "from-teal-50 to-teal-50 border-teal-200 text-teal-600"}
                        border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                        `}>
                            <button onClick={()=> {setComidaModal(comida); setModalActivo(true)}} className="size-full cursor-pointer">
                                <div className="flex flex-col lg:flex-row items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="comida-icon">
                                            <ShowSvg name={comida.orden == 1 ? "sun" : comida.orden == cantComidas ? "moon" : "apple"} size={40}></ShowSvg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">{comida.nombre_comida}</h3>
                                    </div>
                                    <div className="flex flex-row gap-x-3">
                                        <div className="rounded-lg font-inter bg-secondary/80 text-white font-semibold px-3 py-1 text-sm cursor-pointer">Ver detalles</div>
                                        <span className="bg-white/80 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                                            {comida.calorias_totales + " kcal"}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-700 font-medium">
                                        {comida.alimentos.length > 1 ? comida.alimentos.length + " alimentos" : "1 alimento"}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {comida.alimentos.map((alim) => (
                                            <span key={alim.id} className="bg-white/60 text-gray-700 px-2 py-1 rounded-lg text-xs">{alim.nombre}</span>
                                        ))}
                                    </div>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
    }

    return (
        <React.Fragment>
        <div className="diet-info m-8 bg-white rounded-2xl shadow-lg p-8 md:row-span-2">
            {Object.keys(dieta).length > 0 && macrosTotal.calorias ? retornarInformacion() : noDieta ? (
                <div className="font-inter">
                    No tienes una dieta asignada. Tu entrenador debe asignarte una.
                </div>
            ) : (
                <div className="rounded-lg">
                    <LoadScreen></LoadScreen>
                </div>
            )}
        </div>
        <div className="diet-details m-8 p-3 md:row-span-2">
            <h2 className="font-inter bg-primary/50 py-2 rounded-3xl text-center text-black/40 font-bold text-[1.75rem] my-6">Comidas</h2>
            <div className="flex flex-col">
                {Object.keys(comidas).length > 0 && Object.keys(macrosTotal).length > 0 && cantComidas > 0 ? retornarComidas() : <p className="font-coda">La dieta no tiene comidas asignadas.</p>}
            </div>
        </div>
        {esEntrenador ? <TrainerDisplayDiets></TrainerDisplayDiets> : ""}
        {modalActivo ?
                <ClientModalMeal comida={comidaModal} modalActivo={modalActivo} setModalActivo={setModalActivo} />
            : ""}
        </React.Fragment>
    )
}