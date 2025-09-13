import React, { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom"
import { GetUserID } from '../../../utils/getUser.js'
import { ListFoods } from "./ListFoods.jsx"
import { ListExercises } from "./ListExercises.jsx"
import { ShowControlData } from "./ShowControlData.jsx"
import { LoadScreen } from "../../utilities/LoadScreen.jsx"
import '../../../../css/Dashboard.css'

export function DisplayDashboard()
{
    const [cliente, setCliente] = useState(null);
    let token = Cookies.get('token');
    const navigate = useNavigate();

    useEffect(()=>
    {
        if (!token)
        {
            navigate('/');
            return;
        }
        const fetchCliente = async () => {
            try {
                const data = await GetUserID(token);
                if (!data.nombre) {
                    navigate("/comienzo");
                    return;
                }
                setCliente(data);
            } catch (error) {
                console.error('Error obteniendo cliente:', error);
            }
        };
        fetchCliente();
    },[token,navigate])
    return (
        <React.Fragment>
            <div className="greetings-wrapper bg-white rounded-2xl shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 size-32 bg-primary/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 size-24 bg-secondary/10 rounded-full translate-y-12 -translate-x-12"></div>
                <div className="dashboard-greetings w-full my-12 md:my-6 relative p-8">
                    <h2 className="dgreetings__title font-inter text-4xl font-bold">¡Hola de nuevo, {cliente ? cliente.nombre : '...'}!</h2>
                    <h3 className="dgreetings__subtitle my-6 font-inter">Bienvenido al panel de MyCoach.</h3>
                </div>
            </div>
            <div className="dashboard-container w-full flex flex-col lg:grid lg:grid-cols-3 lg:gap-3">
                <ListFoods />
                <ListExercises />
                <ShowControlData />
            </div>
        </React.Fragment>
    )
}