import React, { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { ShowSvg } from "./ShowSvg"
import { ModifyWindow } from "../main/perfil/ModifyWindow.jsx";
import { GetUserID } from "../../utils/getUser";
import { DeleteWindow } from "../main/perfil/DeleteWindow.jsx";

export function LoadAllIcons({ size, fieldType, buttons = 2, type, campo, currentValue, method = null, currentClient = null })
{
    const token = Cookies.get('token')
    const [cliente, setCliente] = useState(null);
    const [clienteRutina, setClienteRutina] = useState(null);
    const [activeWindowModify, setActiveWindowModify] = useState(false);
    const [activeWindowDelete, setActiveWindowDelete] = useState(false);
    
    useEffect(()=>{
        if (currentClient)
        {
            setCliente(currentClient);
            return;
        }

        const fetchData = async ()=>
        {
            const clienteData = await GetUserID(token);
            setCliente(clienteData);
        }
        fetchData();
    },[token])

    const handleSave = async (action, newValue = null)=>
    {
        if (action == "PUT")
        {
            switch (type)
            {
                case "perfil":
                    cliente[campo] = newValue;
                    const responsePerfil = await fetch(`/api/api/clientes/${cliente.id}`,{
                        method: action,
                        headers: {
                            'Content-Type' : 'application/json'
                        },
                        body: JSON.stringify({ cliente_data : cliente, data : { token : token } })
                    })
                    const dataPerfil = await responsePerfil.json();
                    return dataPerfil;
            }
        }
        else if (action == "DELETE")
        {
            switch (type)
            {
                case "perfil":
                    const response = await fetch(`/api/api/clientes/${cliente.id}`,{
                        method: action,
                        headers: {
                            'Content-Type' : 'application/json'
                        },
                        body: JSON.stringify({token})
                    })
                    return await response.json();        
            }
        }
    }
    if (activeWindowModify) {return (
        <ModifyWindow
            fieldType={fieldType}
            isOpen={true}
            currentValue={currentValue}
            fieldName={campo}
            onClose={() => setActiveWindowModify(false)}
            onSave={handleSave}
        ></ModifyWindow>
    )}
    else if (activeWindowDelete) {
        return (
            <DeleteWindow
                isOpen={true}
                type={type}
                onClose={() => setActiveWindowDelete(false)}
                onSave={handleSave}
            ></DeleteWindow>
        )
    }
    else {
        if (buttons == 2) return (
            
            <React.Fragment>
                <button className="cursor-pointer" onClick={()=> {
                    setActiveWindowModify(true);
                }}>
                    <ShowSvg name="modify" size={size}></ShowSvg>  
                </button>
                <button className="cursor-pointer" onClick={()=> setActiveWindowDelete(true)}>
                    <ShowSvg name="delete" size={size}></ShowSvg>
                </button>
            </React.Fragment>

        )
        if (buttons == 1) return (
            <React.Fragment>
                <button className="cursor-pointer" onClick={()=> {
                    setActiveWindowModify(true);
                }}>
                    <ShowSvg name="modify" size={size}></ShowSvg>  
                </button>
            </React.Fragment>
        )
        if (buttons == 0) return (
            <button className="cursor-pointer" onClick={()=> setActiveWindowDelete(true)}>
                    <ShowSvg name="delete" size={size}></ShowSvg>
                </button>
        )
    }
}