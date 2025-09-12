import { API_URL } from "./config";

export async function GetUserControls(userID)
{
    const responseControles = await fetch(`${API_URL}/api/clientes/pesaje/consultar/${userID}`)
    const controles = await responseControles.json();
    return controles;
}