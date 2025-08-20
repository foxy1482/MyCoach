export async function GetUserControls(userID)
{
    const responseControles = await fetch(`/api/api/clientes/pesaje/consultar/${userID}`)
    const controles = await responseControles.json();
    return controles;
}