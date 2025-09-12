import { API_URL } from "./config";

export async function GetUserRoutine(userID)
{
    const responseClienteRutina = await fetch(`${API_URL}/api/clientes/cliente_rutina/${userID}`)
    const ClienteRutina = await responseClienteRutina.json();
    const responseRutina = await fetch(`${API_URL}/api/rutinas/${ClienteRutina.rutina_id}`);
    const rutina = await responseRutina.json();
    return rutina;
}

export async function GetRoutineAsignationData(userID)
{
    const responseClienteRutina = await fetch(`${API_URL}/api/clientes/cliente_rutina/${userID}`)
    const ClienteRutina = await responseClienteRutina.json();
    return ClienteRutina;
}

export async function ListRExercises(routineID)
{
    const responseRutinaEjercicio = await fetch(`${API_URL}/api/rutinas/${routineID}/ejercicios`);
    const rutinaEjercicios = await responseRutinaEjercicio.json();
    return rutinaEjercicios;
}

export async function GetExerciseData(routineID, exerciseID)
{
    const responseEjercicio = await fetch(`${API_URL}/api/rutinas/${routineID}/${exerciseID}/`)
    const ejercicioData = await responseEjercicio.json();
    return ejercicioData;
}

export async function GetAllRoutines()
{
    const responseRutinas = await fetch(`${API_URL}/api/rutinas/`);
    const rutinas = await responseRutinas.json();
    return rutinas;
}

export async function GetAllExercises()
{
    const responseEjercicios = await fetch(`${API_URL}/api/rutinas/ejercicios/`);
    const ejercicios = await responseEjercicios.json();
    return ejercicios;
}