import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function Logout()
{
    const navigate = useNavigate();
    let token = Cookies.get('token');
    useEffect(()=>
    {
        Cookies.remove('token');
        navigate('/');
        return;
    },[navigate])

    return (
        <div>
            <div className="font-coda text-center text-5xl w-full">Cerrando sesión...</div>
        </div>
    )
}