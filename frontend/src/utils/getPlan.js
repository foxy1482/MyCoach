export async function GetPlanByID(planID)
{
    const responsePlan = await fetch(`/api/api/planes/${planID}`)
    const plan = await responsePlan.json();
    return plan;
}