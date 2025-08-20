import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import {useNavigate} from "react-router-dom"
import { GetUserID } from "../../../utils/getUser";
import { GetUserControls } from "../../../utils/getControls";
import ReactECharts from 'echarts-for-react';

export function ShowControlData()
{
    const [controles, setControles] = useState([]);
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
            <div className="controls__lastcontrol font-coda">
                <div className="lcindicator-fecha flex flex-col my-4.5">
                    <span className="lcindicator__label text-lg font-bold">Fecha</span>
                    <span className="lcindicator__data">{nuevaFecha}</span>
                </div>
                <div className="lcindicator-peso flex flex-col my-4.5">
                    <span className="lcindicator__label text-lg font-bold">Peso</span>
                    <span className="lcindicator__data">{ultimoControl.peso} kg</span>
                </div>
                <div className="lcindicator-porcgraso flex flex-col my-4.5">
                    <span className="lcindicator__label text-lg font-bold">Porcentaje graso</span>
                    <span className="lcindicator__data">{ultimoControl.grasa_corporal} %</span>
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
        <div className="dashboard-controls my-3 p-3 border border-neutral-500/30 rounded-xs md:col-span-2">
            <h2 className="font-chalet-paris font-bold text-[1.75rem] my-6">Último control realizado</h2>
            <div className="dashboard-controls-wrapper flex flex-col md:grid md:grid-cols-2">
                <div className="dashboard-controls-container my-auto flex flex-col rounded-lg p-2.5 md:col-span-2">
                    {controles && controles.length > 0 ? cargarControles(controles[controles.length - 1]) : "No hay controles recientes."}
                </div>
                <div className="controls-graphics w-full flex flex-col md:flex-row m-2.5 md:col-span-2">
                    {controles && controles.length > 0 ? ( 
                        <React.Fragment>
                            {cargarGraficoPeso(controles)}
                            {cargarGraficoGrasa(controles)}
                        </React.Fragment>
                    ) : ( "Cargando gráficos.." )}
                </div>
            </div>
        </div>
    )
}