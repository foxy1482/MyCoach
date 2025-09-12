import { API_URL } from "./config";

export async function GetUserPlan(userID)
{
    const responseClientePlan = await fetch(`${API_URL}/api/clientes/cliente_plan/${userID}`);
    const ClientePlan = await responseClientePlan.json();
    if (!ClientePlan) return {};
    const responsePlan = await fetch(`${API_URL}/api/planes/${ClientePlan.plan_id}`);
    const plan = await responsePlan.json();
    return plan;
}