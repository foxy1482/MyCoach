import { useEffect, useState } from "react";
import { ModalListRoutines } from "./ModalListRoutines";
import { GetUserRoutine, ListRExercises, GetExerciseData } from "../../../utils/getRoutine";
import { ShowSvg } from '../../utilities/ShowSvg.jsx'
import { GetPlanByID } from "../../../utils/getPlan.js";

export function ModalAlumnoRutinas({ token, alumnoActivo, setAlumnoActivo }) {
    const [ejercicios, setEjercicios] = useState(null);
    const [rutina, setRutina] = useState(null);
    const [nuevaRutina, setNuevaRutina] = useState(false);
    const [activeWindowModify, setActiveWindowModify] = useState(false);
    const [activeWindowDelete, setActiveWindowDelete] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!alumnoActivo) return;

        const fetchRutina = async () => {
            try {
                setLoading(true);
            
                const rutinaData = await GetUserRoutine(alumnoActivo.id);
                if (!rutinaData) {
                    setRutina(null);
                    setEjercicios(null);
                    return;
                }
            
                setRutina(rutinaData);
            
                const ejerciciosData = await ListRExercises(rutinaData.id);
            
                const detalles = await Promise.all(
                ejerciciosData.map(async (e) => {
                    const detalle = await GetExerciseData(rutinaData.id, e.id);
                    return {
                        ...detalle,
                        nombre: e.nombre,
                        grupo_muscular: e.grupo_muscular
                        };
                    })
                );
                const plan = await GetPlanByID(rutinaData.plan_id);

                const agrupados = {
                  rutina: rutinaData.nombre,
                  plan: plan.nombre,
                  dias: detalles.reduce((acc, ej) => {
                  if (!acc[ej.dia]) {
                    acc[ej.dia] = {};
                  }

                  if (!acc[ej.dia][ej.grupo_muscular]) {
                    acc[ej.dia][ej.grupo_muscular] = [];
                  }
                  acc[ej.dia][ej.grupo_muscular].push(ej);
                  return acc;
                }, {})
              };
            
                setEjercicios(agrupados);
            } catch (err) {
                console.error("Error cargando la rutina: ", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRutina();
    }, [alumnoActivo]);

    useEffect(() => {
      const buildEjercicios = async () => {
        if (!rutina) { setEjercicios(null); return; }
      
        const ejerciciosData = await ListRExercises(rutina.id);
        const detalles = await Promise.all(
          ejerciciosData.map(async (e) => {
            const detalle = await GetExerciseData(rutina.id, e.id);
            return { ...detalle, nombre: e.nombre, grupo_muscular: e.grupo_muscular };
          })
        );
        const plan = await GetPlanByID(rutina.plan_id);
      
        const agrupados = {
          rutina: rutina.nombre,
          plan: plan.nombre,
          dias: detalles.reduce((acc, ej) => {
            if (!acc[ej.dia]) acc[ej.dia] = {};
            if (!acc[ej.dia][ej.grupo_muscular]) acc[ej.dia][ej.grupo_muscular] = [];
            acc[ej.dia][ej.grupo_muscular].push(ej);
            return acc;
          }, {}),
        };
      
        setEjercicios(agrupados);
      };
    
      buildEjercicios();
    }, [rutina?.id]);

    const handleEliminar = async () => {
    try {
      await fetch(`/api/api/clientes/cliente_rutina/${alumnoActivo.id}`, {
        method: "DELETE",
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ token })
      });
      setRutina(null);
      setEjercicios(null);
    } catch (err) {
      console.error("Error des-asignando la rutina: ", err);
    }
  };

  const retornarEjercicios = () => {
  return (
    <div className="rutina font-inter">
      <div className="rutina_data flex flex-col items-center mb-4">
        <span className="text-emerald-700 text-2xl font-bold tracking-wide mb-1">
          “{ejercicios.rutina}”
        </span>
        <span className="text-emerald-500 text-base">
          Del plan <span className="font-bold">{ejercicios.plan}</span>
        </span>
        <div className="rutina_buttons flex flex-row gap-6 p-1.5 border border-neutral-500/50 rounded-xl">
          <a href="">
            <ShowSvg size="20" name="link"></ShowSvg>
          </a>
          <button className="cursor-pointer" onClick={()=> {
              setActiveWindowModify(true);
          }}>
              <ShowSvg name="modify" size="25"></ShowSvg>  
          </button>
          <button className="cursor-pointer" onClick={()=> {setActiveWindowDelete(true)}}>
              <ShowSvg name="delete" size="25"></ShowSvg>
          </button>
        </div>
      </div>
      {Object.entries(ejercicios.dias).map(([dia, grupos]) => (
        <div
          key={dia}
          className="grupo-muscular my-8 border border-emerald-200 bg-emerald-50/60 rounded-2xl p-4 w-full max-w-2xl mx-auto shadow-lg"
        >
          <h2 className="text-emerald-700 text-xl font-bold font-inter mb-2 flex items-center gap-2">
            {dia}
          </h2>
          {Object.entries(grupos).map(([grupo, ejercicioss]) => (
            <div key={grupo} className="mb-4">
              <h3 className="text-emerald-400 font-chalet-newyork text-lg font-bold mb-2 flex items-center gap-2">
                {grupo}
              </h3>
              <ul className="ejercicios-lista divide-y divide-emerald-100 rounded-lg overflow-hidden bg-white shadow">
                <li className="ejercicios-lista__li py-2 px-2 grid grid-cols-4 gap-2 bg-emerald-100 text-xs font-semibold text-emerald-700">
                  <span className="text-center">Nombre</span>
                  <span className="text-center">Series</span>
                  <span className="text-center">Reps</span>
                  <span className="text-center">RIR</span>
                </li>
                {ejercicioss.map((ej) => (
                  <li
                    key={ej.id}
                    className="ejercicios-lista__li py-2 px-2 grid grid-cols-4 gap-2 text-xs hover:bg-emerald-50 transition"
                  >
                    <span className="text-center">{ej.nombre}</span>
                    <span className="text-center">{ej.series}</span>
                    <span className="text-center">{ej.repeticiones}</span>
                    <span className="text-center">{ej.rir}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
  return (
    <div className="oscuro w-full h-full fixed top-0 left-0 bg-black/80 z-20 overflow-y-auto flex">
      {loading ? (
        <p className="text-white text-center m-auto">Cargando rutina...</p>
      ) : nuevaRutina && !ejercicios ? (
        <ModalListRoutines
          action="ASIGN"
          nuevaRutina={nuevaRutina}
          setNuevaRutina={setNuevaRutina}
          rutina={rutina}
          setRutina={setRutina}
          alumnoActivo={alumnoActivo}
          setAlumnoActivo={setAlumnoActivo}
        />
      ) : activeWindowModify ? (
        
      <ModalListRoutines
          action="MODIFY"
          nuevaRutina={activeWindowModify}
          setNuevaRutina={setActiveWindowModify}
          rutina={rutina}
          setRutina={setRutina}
          alumnoActivo={alumnoActivo}
          setAlumnoActivo={setAlumnoActivo}
        />
    
      ) : activeWindowDelete ? (
        <div className="p-6 w-full max-w-lg bg-white rounded-xl shadow-lg flex flex-col gap-4 m-auto">
          <h2 className="font-semibold text-2xl">Eliminar asignación</h2>
          <span className="text-lg">¿Estás seguro de querer eliminar la asignación de la rutina?</span>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={()=>setActiveWindowDelete(false)}
              className="bg-gray-300 px-4 py-2 rounded cursor-pointer border border-transparent transition hover:bg-neutral-600 hover:border-gray-300 hover:text-gray-300"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={()=>{
                handleEliminar();
                setActiveWindowDelete(false);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer border border-transparent transition hover:bg-white hover:border-blue-500 hover:text-blue-500"
            >
              Confirmar
            </button>
          </div>
        </div>
      ) : rutina && ejercicios ? (
        <div className="trainee alumno bg-white border border-neutral-500/50 rounded-lg p-2 my-2 max-w-96 h-fit group transition m-auto overfloy-y-auto">
          <button onClick={() => setAlumnoActivo(null)} className="bg-red-400 rounded-full text-white hover:bg-neutral-500 cursor-pointer transition">
            <ShowSvg size="20" name="cross"></ShowSvg>
          </button>
          <div className="alumno__title flex flex-row justify-center gap-1.5">
            <h2 className="text-center font-bold font-chalet-paris text-3xl">{alumnoActivo.nombre + " " + alumnoActivo.apellido}</h2>
            <a href="" className="bg-transparent border-neutral-500/50 rounded-lg justify-items-center flex">
              <ShowSvg size="20" name="link"></ShowSvg>
            </a>
          </div>
          <div className="alumno_rutina">
            <h2 className="font-inter text-xl font-semibold mb-4">Rutina asignada</h2>
            {retornarEjercicios()}
          </div>
        </div>
      ) : !ejercicios ? (
        <div className="trainee alumno bg-white border border-neutral-500/50 rounded-lg p-2 my-auto max-w-96 group transition m-auto flex flex-col h-fit">
          <button onClick={() => setAlumnoActivo(null)} className="bg-red-400 rounded-full text-white hover:bg-neutral-500 cursor-pointer transition w-fit">
            <ShowSvg size="20" name="cross"></ShowSvg>
          </button>
          <div className="alumno__title flex flex-row justify-center gap-1.5">
            <h2 className="text-center font-bold font-chalet-paris text-3xl">{alumnoActivo.nombre + " " + alumnoActivo.apellido}</h2>
            <a href="" className="bg-transparent border-neutral-500/50 rounded-lg justify-items-center flex">
              <ShowSvg size="20" name="link"></ShowSvg>
            </a>
          </div>
          <button
            onClick={() => {
              setNuevaRutina(true);
            }}
            className="bg-blue-500 text-white font-inter cursor-pointer hover:bg-blue-400 transition my-4 px-16 w-fit rounded-lg mx-auto"
          >
            Asignar rutina
          </button>
        </div>
      ) : (
        <div className="m-auto flex-col w-60 bg-white">
          <button onClick={() => setAlumnoActivo(null)} className="bg-red-400 rounded-full text-white hover:bg-neutral-500 cursor-pointer transition">
            <ShowSvg size="20" name="cross"></ShowSvg>
          </button>
          <p className="text-black text-center mx-auto py-6 font-inter">No hay ejercicios para mostrar</p>
        </div>
      )}
    </div>
  );
}
