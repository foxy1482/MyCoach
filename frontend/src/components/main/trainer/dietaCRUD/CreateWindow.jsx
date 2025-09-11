import { useState, useEffect } from "react"
import { GetAllPlans } from "../../../../utils/getPlan";

export function CreateWindowD({ isOpen, onClose, onSave })
{
    const [newValue, setNewValue] = useState({});
    const [planes, setPlanes] = useState([ ]);
    const [seleccion, setSeleccion] = useState(null);

    useEffect(()=>{
        const fetchData = async ()=>
        {
            const resPlanes = await GetAllPlans();
            setPlanes(resPlanes);
        }
        fetchData();
    },[])
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Llamás a la función que hace el PUT
        await onSave("POST", newValue);

        onClose(); // cerrás el modal
    };

    document.addEventListener('input', function (event) {
        if (event.target.tagName.toLowerCase() === 'textarea') {
            event.target.style.height = 'auto'; // Reset height
            event.target.style.height = (event.target.scrollHeight) + 'px'; // Set to new height
        }
    }, false);

    if (!isOpen) return null;
    else return (
    <div className="fixed z-20 inset-0 flex items-center justify-center bg-black/50">
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="form-header max-w-64 mb-6">
                <h2 className="font-bold font-inter text-2xl w-full">Crear Dieta</h2>
            </div>
        <form onSubmit={handleSubmit}>
            <div className="form-inputs flex flex-col gap-y-4">
            <div className="input flex flex-row w-auto">
                <label htmlFor="form-nombre" className="my-auto w-16 font-semibold font-inter text-secondary/80">Nombre</label>
                <input
                    id="form-nombre"
                    type="text"
                    onChange={(e) => setNewValue(prev => ({ ...prev, nombre: e.target.value }))}
                    className="border border-transparent px-2 my-auto border-b-2 border-b-neutral-600 w-fit font-coda focus:outline-0 focus:border-b-primary focus:scale-110 mx-4 transition"
                />
            </div>
            <div className="input flex flex-row w-auto">
                <label htmlFor="form-plan" className="my-auto w-16 font-semibold font-inter text-secondary/80">Plan</label>
                <select
                    id="form-plan"
                    value={seleccion}
                    onChange={(e) => {
                        setSeleccion(Number(e.target.value))
                        setNewValue(prev => ({ ...prev, plan_id: Number(e.target.value)}))
                    }}
                    className="px-2 my-auto border-b-2 border-b-neutral-600 w-fit font-coda focus:scale-110 mx-4 transition"
                >
                    {planes.map((option) => (
                        <option className="font-inter"
                            key={option.id} value={option.id}
                        >{option.nombre}</option>
                    ))}
                </select>
            </div>
            <div className="input flex flex-col w-auto">
                <label htmlFor="form-desc" className="my-auto w-16 font-semibold font-inter text-secondary/80">Descripción</label>
                <textarea
                    id="form-desc"
                    type="text"
                    onChange={(e) => setNewValue(prev => ({ ...prev, descripcion: e.target.value }))}
                    className="border border-transparent px-2 my-auto border-b-2 border-b-neutral-600 font-coda focus:outline-0 focus:border-b-primary focus:scale-110 mx-4 transition resize-none overflow-hidden"
                ></textarea>
            </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-300 px-4 py-2 rounded cursor-pointer border border-transparent transition hover:bg-neutral-600 hover:border-gray-300 hover:text-gray-300"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer border border-transparent transition hover:bg-white hover:border-blue-500 hover:text-blue-500"
                >
                    Guardar
                </button>
            </div>
        </form>
        </div>
    </div>
    );
}
