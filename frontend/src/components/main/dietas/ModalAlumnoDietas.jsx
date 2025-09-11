import { useEffect, useState } from "react";
import { ShowSvg } from '../../utilities/ShowSvg.jsx'
import { GetPlanByID } from "../../../utils/getPlan.js";
import { GetUserDiet, ListDietMeals, GetDietAsignationData, GetFoodCals, GetFood } from "../../../utils/getDiet.js";
import { ModalListDiets } from "./ModalListDiets.jsx";

export function ModalAlumnoDietas({ token, alumnoActivo, setAlumnoActivo }) {
    const [macrosTotal, setMacrosTotal] = useState({});
    const [cantComidas, setCantComidas] = useState({});
    const [comidas, setComidas] = useState(null);
    const [detallesComidas, setDetallesComidas] = useState({});
    const [dieta, setDieta] = useState(null);
    const [plan, setPlan] = useState(null);
    const [nuevaDieta, setNuevaDieta] = useState(false);
    const [activeWindowModify, setActiveWindowModify] = useState(false);
    const [activeWindowDelete, setActiveWindowDelete] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!alumnoActivo) return;

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

        const fetchdieta = async () => {
            try {
                setLoading(true);
            
                const dietaData = await GetUserDiet(alumnoActivo.id);
                if (!dietaData) {
                    setDieta(null);
                    setEjercicios(null);
                    return;
                }
                setDieta(dietaData);
            
                const dietaInfoData = await GetDietAsignationData(alumnoActivo.id)
                    const informacionDieta = {
                        ...dietaData,
                        ...dietaInfoData
                    }
                    setDieta({...informacionDieta, since_days: tiempoTranscurrido(informacionDieta.fecha_asignacion)});
                
                const plan = await GetPlanByID(dietaData.plan_id);
                setPlan(plan);
                
                const comidasData = await ListDietMeals(dietaData.id);
                
                const comidasCalsData = await GetFoodCals(dietaData.id);


                // Le agrega las kcal de cada una
                const comidasFusionadas = await Promise.all(
                    comidasData.map(async (comida)=>{
                        let comidaBase = comidasCalsData.find(c=> c.comida_id, comida.comida_id);

                        if (!comidaBase) comidaBase = "";

                        const alimentosConMacros = await Promise.all(
                            comida.alimentos.map(async (alimento) =>{
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
                        }
                    })
                )
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
            } catch (err) {
                console.error("Error cargando la dieta: ", err);
            } finally {
                setLoading(false);
            }
        };

        fetchdieta();
    }, [alumnoActivo]);



    useEffect(() => {
        const buildComidas = async () => {
            if (!dieta) { setComidas(null); return; }

            const dietaData = await GetUserDiet(alumnoActivo.id);

            const comidasData = await ListDietMeals(dietaData.id);
                
                const comidasCalsData = await GetFoodCals(dietaData.id);


                // Le agrega las kcal de cada una
                const comidasFusionadas = await Promise.all(
                    comidasData.map(async (comida)=>{
                        let comidaBase = comidasCalsData.find(c=> c.comida_id, comida.comida_id);

                        if (!comidaBase) comidaBase = "";

                        const alimentosConMacros = await Promise.all(
                            comida.alimentos.map(async (alimento) =>{
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
                        }
                    })
                )
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
        };
    
        buildComidas();
    },   [dieta?.id]);

    const handleEliminar = async () => {
    try {
        await fetch(`/api/api/clientes/cliente_dieta/${alumnoActivo.id}`, {
            method: "DELETE",
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({ token })
        });
        setDieta(null);
        setComidas(null);
    } catch (err) {
        console.error("Error des-asignando la dieta: ", err);
    }
    };

    const retornarComidas = () => {
    return (
        <div className="dieta font-inter">
            <div className="dieta_data flex flex-col items-center mb-4">
                <span className="text-emerald-700 text-2xl font-bold tracking-wide mb-1">
                    “{dieta.nombre}”
                </span>
                <span className="text-emerald-500 text-base">
                    Del plan <span className="font-bold">{plan.nombre}</span>
                </span>
                <div className="dieta_buttons flex flex-row gap-6 p-1.5 border border-neutral-500/50 rounded-xl">
                    <a href="/myDiets">
                        <ShowSvg size="20" name="link"></ShowSvg>
                    </a>
                    <button className="cursor-pointer" onClick={()=> {
                        setActiveWindowModify(true);
                    }}>
                        <ShowSvg name="modify" size="25"></ShowSvg>  
                    </button>
                    <button className="cursor-pointer" onClick={()=> {setActiveWindowDelete(true)}}>
                        <ShowSvg name="delete" size="25"></ShowSvg>
                    </button>
                </div>
                <div className="useful-data flex flex-row gap-3 font-inter col-span-2">
                    <div className="cuadro bg-orangeM/10 p-4 rounded-xl">
                        <div className="cuadro-container flex items-center justify-between">
                            <div className="cuadro-data">
                                <p className="text-orangeM text-xs font-medium">Comidas</p>
                                <p className="text-xl font-bold text-gray-900">{cantComidas}</p>
                            </div>
                            <div className="cuadro-icon flex items-center">
                                <ShowSvg name={"clock"} size={20} className="text-orangeM m-auto"></ShowSvg>
                            </div>
                        </div>
                    </div>
                    <div className="cuadro bg-primary/10 p-4 rounded-xl">
                        <div className="cuadro-container flex items-center justify-between">
                            <div className="cuadro-data">
                                <p className="text-primary text-xs font-medium">Calorías totales</p>
                                <p className="text-xl font-bold text-gray-900">{macrosTotal.calorias}</p>
                            </div>
                            <div className="cuadro-icon flex items-center">
                                <ShowSvg name={"fire"} size={16} className="text-primary m-auto"></ShowSvg>
                            </div>
                        </div>
                    </div>
                    <div className="cuadro bg-purple-500/10 p-4 rounded-xl">
                        <div className="cuadro-container flex items-center justify-between">
                            <div className="cuadro-data">
                                <p className="text-purple-500 text-xs font-medium">Carbohidratos</p>
                                <p className="text-xl font-bold text-gray-900">{macrosTotal.carbohidratos + " g"}</p>
                            </div>
                            <div className="cuadro-icon flex items-center">
                                <ShowSvg name={"lightning"} size={16} className="text-purple-500 m-auto"></ShowSvg>
                            </div>
                        </div>
                    </div>
                    <div className="cuadro bg-red-400/10 p-4 rounded-xl">
                        <div className="cuadro-container flex items-center justify-between">
                            <div className="cuadro-data">
                                <p className="text-red-400 text-xs font-medium">Proteínas</p>
                                <p className="text-xl font-bold text-gray-900">{macrosTotal.proteinas + " g"}</p>
                            </div>
                            <div className="cuadro-icon flex items-center">
                                <ShowSvg name={"bars"} size={16} className="stroke-red-400 fill-red-400 m-auto"></ShowSvg>
                            </div>
                        </div>
                    </div>
                    <div className="cuadro bg-blue-500/10 p-4 rounded-xl">
                        <div className="cuadro-container flex items-center justify-between">
                            <div className="cuadro-data">
                                <p className="text-blue-500 text-xs font-medium">Grasas</p>
                                <p className="text-xl font-bold text-gray-900">{macrosTotal.grasas + " g"}</p>
                            </div>
                            <div className="cuadro-icon flex items-center">
                                <ShowSvg name={"grasa"} size={16} className="text-blue-500 m-auto"></ShowSvg>
                            </div>
                        </div>
                    </div>
    
                </div>
            </div>
            {comidas.map((comida, index)=> (
                <div key={comida} className={`bg-gradient-to-br ${index == 0 ? "from-orange-50 to-yellow-50 border-orange-200 text-orange-600" : index == cantComidas ? "from-purple-50 to-purple-50 border-purple-200 text-purple-600" : "from-teal-50 to-teal-50 border-teal-200 text-teal-600"}
                border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                `}>
                    
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="comida-icon">
                                    <ShowSvg name={index == 0 ? "sun" : index == cantComidas ? "moon" : "apple"} size={40}></ShowSvg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{comida.nombre_comida}</h3>
                            </div>
                            <span className="bg-white/80 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                                {comida.calorias_totales + " kcal"}
                            </span>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-lg">Alimentos</h3>
                            <ul className="flex flex-col gap-4">
                                {comida.alimentos.map((alim)=>(
                                    <li key={alim.id} className="
                                    bg-white rounded-xl p-2 grid grid-cols-2
                                    ">
                                        <div className="alimento__nombre-cantidad flex flex-col w-fit">
                                            <span>{alim.nombre}</span>
                                            <span className="font-semibold">{alim.cantidad_g + " g"}</span>
                                        </div>
                                        <div className="text-right flex flex-col">
                                            <p className="font-bold text-primary">{((alim.cantidad_g / 100) * alim.calorias_100g) + " kcal"}</p>
                                            <div className="macros ml-auto text-xs text-gray-500 flex flex-row gap-x-2">
                                                <span className="text-primary">{((alim.cantidad_g / 100) * alim.carbohidratos) + " g"}</span>
                                                <span className="text-orangeM">{((alim.cantidad_g / 100) * alim.proteinas) + " g"}</span>
                                                <span className="text-primary">{((alim.cantidad_g / 100) * alim.grasas) + " g"}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                </div>
            ))}
        </div>
    );
};
    return (
        <div className="oscuro w-full h-full fixed top-0 left-0 bg-black/80 z-20 overflow-y-auto flex">
            {loading ? (
                <p className="text-white text-center m-auto">Cargando dieta...</p>
            ) : nuevaDieta && !comidas ? (
                
                <ModalListDiets
                    action="ASIGN"
                    nuevaDieta={nuevaDieta}
                    setNuevaDieta={setNuevaDieta}
                    dieta={dieta}
                    setDieta={setDieta}
                    alumnoActivo={alumnoActivo}
                    setAlumnoActivo={setAlumnoActivo}
                />
                
            ) : activeWindowModify ? (
            
            <ModalListDiets
                action="MODIFY"
                nuevaDieta={activeWindowModify}
                setNuevaDieta={setActiveWindowModify}
                dieta={dieta}
                setDieta={setDieta}
                alumnoActivo={alumnoActivo}
                setAlumnoActivo={setAlumnoActivo}
            />
            
            ) : activeWindowDelete ? (
                
                <div className="p-6 w-full max-w-lg bg-white rounded-xl shadow-lg flex flex-col gap-4 m-auto">
                    <h2 className="font-semibold text-2xl">Eliminar asignación</h2>
                    <span className="text-lg">¿Estás seguro de querer eliminar la asignación de la dieta?</span>
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={()=>setActiveWindowDelete(false)}
                            className="bg-gray-300 px-4 py-2 rounded cursor-pointer border border-transparent transition hover:bg-neutral-600 hover:border-gray-300 hover:text-gray-300"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={()=>{
                                handleEliminar();
                                setActiveWindowDelete(false);
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer border border-transparent transition hover:bg-white hover:border-blue-500 hover:text-blue-500"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
                
            ) : dieta && comidas ? (
                <div className="trainee alumno bg-white border border-neutral-500/50 rounded-lg p-2 my-2 max-w-2xl h-fit group transition m-auto overfloy-y-auto">
                    <button onClick={() => setAlumnoActivo(null)} className="bg-red-400 rounded-full text-white hover:bg-neutral-500 cursor-pointer transition">
                        <ShowSvg size="20" name="cross"></ShowSvg>
                    </button>
                    <div className="alumno__title flex flex-row justify-center gap-1.5">
                        <h2 className="text-center font-bold font-chalet-paris text-3xl">{alumnoActivo.nombre + " " + alumnoActivo.apellido}</h2>
                        <a href="" className="bg-transparent border-neutral-500/50 rounded-lg justify-items-center flex">
                            <ShowSvg size="20" name="link"></ShowSvg>
                        </a>
                    </div>
                    <div className="alumno_dieta">
                        {retornarComidas()}
                    </div>
                </div>
            ) : !comidas ? (
                <div className="trainee alumno bg-white border border-neutral-500/50 rounded-lg p-2 my-auto max-w-96 group transition m-auto flex flex-col h-fit">
                    <button onClick={() => setAlumnoActivo(null)} className="bg-red-400 rounded-full text-white hover:bg-neutral-500 cursor-pointer transition w-fit">
                        <ShowSvg size="20" name="cross"></ShowSvg>
                    </button>
                    <div className="alumno__title flex flex-row justify-center gap-1.5">
                        <h2 className="text-center font-bold font-chalet-paris text-3xl">{alumnoActivo.nombre + " " + alumnoActivo.apellido}</h2>
                        <a href="" className="bg-transparent border-neutral-500/50 rounded-lg justify-items-center flex">
                            <ShowSvg size="20" name="link"></ShowSvg>
                        </a>
                    </div>
                    <button
                        onClick={() => {
                            setNuevaDieta(true);
                        }}
                        className="bg-blue-500 text-white font-inter cursor-pointer hover:bg-blue-400 transition my-4 px-16 w-fit rounded-lg mx-auto"
                    >
                        Asignar dieta
                    </button>
                </div>
            ) : (
                <div className="m-auto flex-col w-60 bg-white">
                    <button onClick={() => setAlumnoActivo(null)} className="bg-red-400 rounded-full text-white hover:bg-neutral-500 cursor-pointer transition">
                        <ShowSvg size="20" name="cross"></ShowSvg>
                    </button>
                    <p className="text-black text-center mx-auto py-6 font-inter">No hay comidas para mostrar.</p>
                </div>
            )}
        </div>
    );
}
