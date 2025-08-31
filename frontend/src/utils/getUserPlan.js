export async function GetUserPlan(userID)
{
    const responseClientePlan = await fetch(`/api/api/clientes/cliente_plan/${userID}`);
    const ClientePlan = await responseClientePlan.json();
    if (!ClientePlan) return {};
    const responsePlan = await fetch(`/api/api/planes/${ClientePlan.plan_id}`);
    const plan = await responsePlan.json();
    return plan;
}