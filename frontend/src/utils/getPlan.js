import { API_URL } from "./config";

export async function GetPlanByID(planID)
{
    const responsePlan = await fetch(`${API_URL}/api/planes/${planID}`)
    const plan = await responsePlan.json();
    return plan;
}

export async function GetAllPlans()
{
    const resPlanes = await fetch(`${API_URL}/api/planes/`);
    const planes = await resPlanes.json();
    return planes;
}