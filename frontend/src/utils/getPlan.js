export async function GetPlanByID(planID)
{
    const responsePlan = await fetch(`/api/api/planes/${planID}`)
    const plan = await responsePlan.json();
    return plan;
}

export async function GetAllPlans()
{
    const resPlanes = await fetch("/api/api/planes/");
    const planes = await resPlanes.json();
    return planes;
}