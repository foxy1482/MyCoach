export async function GetUserDiet(userID)
{
    const responseClienteDieta = await fetch(`/api/api/clientes/cliente_dieta/${userID}`)
    const ClienteDieta = await responseClienteDieta.json();
    const responseDieta = await fetch(`/api/api/dietas/${ClienteDieta.dieta_id}`);
    const dieta = await responseDieta.json();
    return dieta;
}

export async function ListDietMeals(dietID)
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

export async function GetDietAsignationData(userID)
{
    const responseClienteDieta = await fetch(`/api/api/clientes/cliente_dieta/${userID}`)
    const ClienteDieta = await responseClienteDieta.json();
    return ClienteDieta;
}
/*
export async function GetDietAsignationData(dietID)
{
    const responseClienteDieta = await fetch(`/api/api/clientes/cliente_dieta/${ID}`)
    const ClienteDieta = await responseClienteDieta.json();
    return ClienteDieta;
}
*/
export async function GetFood(foodID)
{
    const responseAlimento = await fetch(`/api/api/dietas/alimento/obtener/${foodID}`);
    const alimento = await responseAlimento.json();
    return alimento;
}

export async function GetAllDiets()
{
    const resDietas = await fetch("/api/api/dietas/");
    const dietas = resDietas.json();
    return dietas;
}

export async function GetAllFoods()
{
    const resAlimentos = await fetch("/api/api/dietas/alimento/listar/");
    const alimentos = resAlimentos.json();
    return alimentos;
}

export async function GetMealFoodAD(mealID, foodID)
{
    const resAsig = await fetch(`/api/api/dietas/comida/${mealID}/alimento/${foodID}`);
    const asignacion = resAsig.json();
    return asignacion;
}