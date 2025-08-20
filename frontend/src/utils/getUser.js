export async function GetUserID(token)
{
    const responseUsuario = await fetch('/api/auth/perfil', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "token" : token
        })
    });
    const usuario = await responseUsuario.json();
    const responseCliente = await fetch(`/api/api/clientes/userID/${usuario.id}`);
    const cliente = await responseCliente.json();
    return cliente;
}

export async function GetAuthUserID(token)
{
    const responseUsuario = await fetch('/api/auth/perfil', {
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
    const responseClientes = await fetch("/api/api/clientes/");
    const clientes = await responseClientes.json();
    return clientes;
}
