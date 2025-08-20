import React, { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom"
import { GetUserID } from '../../../utils/getUser.js'
import { ListFoods } from "./ListFoods.jsx"
import { ListExercises } from "./ListExercises.jsx"
import { ShowControlData } from "./ShowControlData.jsx"

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
                setCliente(data);
            } catch (error) {
                console.error('Error obteniendo cliente:', error);
            }
        };
        fetchCliente();
    },[token,navigate])
    return (
        <React.Fragment>
            <div className="dashboard-greetings w-full my-12 md:my-6">
                <h2 className="dgreetings__title font-kodchasan text-4xl">Hola, {cliente ? cliente.nombre : '...'}</h2>
                <h3 className="dgreetings__subtitle ml-24 font-kodchasan">Bienvenido al panel de MyCoach.</h3>
            </div>
            <div className="dashboard-container w-full flex flex-col md:grid md:grid-cols-3 md:gap-3">
                <ListFoods />
                <ListExercises />
                <ShowControlData />
            </div>
        </React.Fragment>
    )
}