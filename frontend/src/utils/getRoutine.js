export async function GetUserRoutine(userID)
{
    const responseClienteRutina = await fetch(`/api/api/clientes/cliente_rutina/${userID}`)
    const ClienteRutina = await responseClienteRutina.json();
    const responseRutina = await fetch(`/api/api/rutinas/${ClienteRutina.rutina_id}`);
    const rutina = await responseRutina.json();
    return rutina;
}

export async function GetRoutineAsignationData(userID)
{
    const responseClienteRutina = await fetch(`/api/api/clientes/cliente_rutina/${userID}`)
    const ClienteRutina = await responseClienteRutina.json();
    return ClienteRutina;
}

export async function ListRExercises(routineID)
{
    const responseRutinaEjercicio = await fetch(`/api/api/rutinas/${routineID}/ejercicios`);
    const rutinaEjercicios = await responseRutinaEjercicio.json();
    return rutinaEjercicios;
}

export async function GetExerciseData(routineID, exerciseID)
{
    const responseEjercicio = await fetch(`/api/api/rutinas/${routineID}/${exerciseID}/`)
    const ejercicioData = await responseEjercicio.json();
    return ejercicioData;
}