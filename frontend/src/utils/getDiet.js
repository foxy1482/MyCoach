export async function GetUserDiet(userID)
{
    const responseClienteDieta = await fetch(`/api/api/clientes/cliente_dieta/${userID}`)
    const ClienteDieta = await responseClienteDieta.json();
    const responseDieta = await fetch(`/api/api/dietas/${ClienteDieta.dieta_id}`);
    const dieta = await responseDieta.json();
    return dieta;
}

export async function ListDietFoods(dietID)
{
    const responseDietaComida = await fetch(`/api/api/dietas/${dietID}/comida/detalles/`);
    const dietaComida = await responseDietaComida.json();
    return dietaComida;
}

export async function GetFoodCals(dietID)
{
    const responseComidaCal = await fetch(`/api/api/dietas/${dietID}/comida/`);
    const comidaCals = await responseComidaCal.json();
    return comidaCals;
}