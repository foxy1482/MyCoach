export async function GetUserPlan(userID)
{
    const responseClientePlan = await fetch(`/api/api/clientes/cliente_plan/${userID}`);
    const ClientePlan = responseClientePlan.json();
    const responsePlan = await fetch(`/api/api/planes/${ClientePlan.plan_id}`);
    const plan = responsePlan.json();
    return plan;
}