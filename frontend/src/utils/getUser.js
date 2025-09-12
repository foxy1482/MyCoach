import { API_URL } from "./config";

export async function GetUserID(token)
{
    const responseUsuario = await fetch(`${API_URL}/auth/perfil`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "token" : token
        })
    });
    const usuario = await responseUsuario.json();
    const responseCliente = await fetch(`${API_URL}/api/clientes/userID/${usuario.id}`);
    const cliente = await responseCliente.json();
    return cliente;
}

export async function GetAuthUserID(token)
{
    const responseUsuario = await fetch(`${API_URL}/auth/perfil`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "token" : token
        })
    });
    const usuario = await responseUsuario.json();
    return usuario;
}

export async function GetAllClients()
{
    const responseClientes = await fetch(`${API_URL}/api/clientes/`);
    const clientes = await responseClientes.json();
    return clientes;
}

export async function GetUserByID(id, token)
{
    const response = await fetch(`${API_URL}/auth/usuario/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({token})
    });
    const usuario = await response.json();
    return usuario;
}