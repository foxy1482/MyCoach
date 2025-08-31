import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import {useNavigate} from "react-router-dom"
import { GetUserID } from "../../../utils/getUser";
import { GetUserControls } from "../../../utils/getControls";
import ReactECharts from 'echarts-for-react';
import { ShowSvg } from "../../utilities/ShowSvg";

export function ShowControlData()
{
    const [controles, setControles] = useState([]);
    const [verControles, setVerControles] = useState(false);
    let token = Cookies.get('token');
    const navigate = useNavigate();

    useEffect(()=>
    {
        if (!token)
        {
            navigate("/");
            return;
        }
        const fetchData = async ()=>
        {
            try {
                const clienteData = await GetUserID(token);

                const controlesData = await GetUserControls(clienteData.id);
                setControles(controlesData);
            } catch (error)
            {
                console.error('Error obteniendo cliente:', error);
            }
        }
        fetchData();
    },[token,navigate])

    const cargarControles = (ultimoControl)=>
    {
        const fecha = new Date(ultimoControl.fecha + "T12:00:00");
        const nuevaFecha = new Intl.DateTimeFormat("es-AR", {day: "numeric", month: "long", year: "numeric"}).format(fecha);

        return (
            <div className="controls__lastcontrol font-inter">
                <div className="lcindictator-stats grid grid-cols-2 gap-x-6">
                    <div className="lcindicator-peso bg-white rounded-xl p-4 shadow-sm flex flex-col w-full max-w-96 m-auto">
                        <ShowSvg name="weight" size={32} className="text-primary mx-auto"></ShowSvg>
                        <span className="lcindicator__data font-bold text-3xl mx-auto">{ultimoControl.peso} kg</span>
                        <span className="lcindicator__label text-sm text-gray-900 mx-auto">Peso actual</span>
                    </div>
                    <div className="lcindicator-grasa bg-white rounded-xl p-4 shadow-sm flex flex-col w-full max-w-96 m-auto">
                        <ShowSvg name="bars" size={32} className="fill-orange-500 mx-auto"></ShowSvg>
                        <span className="lcindicator__data font-bold text-3xl mx-auto">{ultimoControl.grasa_corporal} %</span>
                        <span className="lcindicator__label text-sm text-gray-900 mx-auto">Porcentaje graso actual</span>
                    </div>
                </div>
                <div className="lcindicator-fecha bg-white/70 p-4 rounded-xl flex items-center justify-between  my-4.5">
                    <span className="lcindicator__label text-lg">Fecha de medición:</span>
                    <span className="lcindicator__data font-bold">{nuevaFecha}</span>
                </div>
            </div>
        )
    }

    const cargarGraficoPeso = (controles)=>
    {
        let fechas = [];
        let pesos = [];
        controles.forEach((control, i) => {
            fechas[i] = control.fecha;
            pesos[i] = control.peso;
        });

        const option = {
            color: ['#f22','#ff7f50'],
            xAxis: {
                type: 'category',
                data: fechas
            },
            yAxis: {
                type: 'value',
                min: 40,
                max: 150
            },
            title: {
                text: "Evolución del\npeso corporal",
                left: 'center',
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            series: [
                {
                    data: pesos,
                    type: 'line'
                }
            ]
        };
        return (
            <div className="grafico-peso w-full md:w-6/12 mx-auto md:mx-0">
                <ReactECharts option={option} style={{ height: '500px', width: '100%' }}></ReactECharts>
            </div>
        )
    }

    const cargarGraficoGrasa = (controles)=>
    {
        let fechas = [];
        let grasas = [];
        controles.forEach((control, i) => {
            fechas[i] = control.fecha;
            grasas[i] = control.grasa_corporal;
        });

        const option = {
            color: ['#ff7f50'],
            xAxis: {
                type: 'category',
                data: fechas
            },
            yAxis: {
                type: 'value',
                min: 3,
                max: 30
            },
            title: {
                text: "Evolución de\nla grasa corporal",
                left: 'center',
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            series: [
                {
                    data: grasas,
                    type: 'line'
                }
            ]
        };
        return (
            <div className="grafico-grasa w-full md:w-6/12 mx-auto md:mx-0 border border-transparent md:border-l-neutral-500/50">
                <ReactECharts option={option} style={{ height: '500px', width: '100%' }}></ReactECharts>
            </div>
        )
    }

    return (
        <div className="dashboard-controls bg-gradient-to-br from-primary/20 to-success/25 rounded-2xl my-3 p-6 md:col-span-2 shadow-xl">
            <div className="controls-header flex flex-row w-full justify-between">
                <h2 className="font-inter font-bold text-[1.75rem] my-6">Último pesaje</h2>
                <button
                onClick={()=> setVerControles(true)}
                className="bg-primary/20 text-primary font-semibold font-inter px-3 py-1 rounded-2xl text-sm h-fit my-auto
                hover:bg-primary hover:text-white transition duration-300 cursor-pointer
                "
                >
                    Ver gráficos
                </button>
            </div>
            <div className="dashboard-controls-wrapper flex flex-col md:grid md:grid-cols-2">
                <div className="dashboard-controls-container my-auto flex flex-col rounded-lg p-2.5 md:col-span-2">
                    {controles && controles.length > 0 ? cargarControles(controles[controles.length - 1]) : "No hay controles recientes."}
                </div>
                <div className={`controls-graphics-wrapper z-20 ${verControles ? "md:translate-y-0 bg-black/70 flex" : "md:-translate-y-full md:bg-transparent hidden"} md:flex justify-items-center overflow-y-auto fixed top-0 left-0 size-full transition-all duration-500`}>
                    <div className="controls-graphics-container flex flex-col bg-white w-96 md:w-2xl m-auto rounded-2xl gap-y-4 p-2">
                            <button onClick={() => setVerControles(false)} className="bg-red-400 rounded-full text-white hover:bg-neutral-500 cursor-pointer transition w-fit">
                                <ShowSvg size="20" name="cross"></ShowSvg>
                            </button>
                        <div className={`controls-graphics flex flex-col md:flex-row md:col-span-2 transition`}>
                            {controles && controles.length > 0 ? ( 
                                <React.Fragment>
                                    {cargarGraficoPeso(controles)}
                                    {cargarGraficoGrasa(controles)}
                                </React.Fragment>
                            ) : ( "Cargando gráficos.." )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}