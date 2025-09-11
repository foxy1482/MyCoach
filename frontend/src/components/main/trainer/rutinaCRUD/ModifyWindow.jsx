import { useState } from "react"

export function ModifyWindowR({ isOpen, onClose, rutina, onSave })
{
    const [newValue, setNewValue] = useState(rutina);
    const [personalizada, setPersonalizada] = useState(newValue.es_personalizada);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Llamás a la función que hace el PUT
        await onSave("PUT", newValue);

        onClose(); // cerrás el modal
        window.location.reload();
    };

    if (!isOpen) return null;
    else return (
    <div className="fixed z-20 inset-0 flex items-center justify-center bg-black/50">
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="form-header max-w-64 mb-6">
                <h2 className="font-bold font-inter text-2xl w-full">Modificar Rutina</h2>
                <h3 className="text-neutral-500 text-lg">{rutina.nombre}</h3>
            </div>
        <form onSubmit={handleSubmit}>
            <div className="form-inputs flex flex-col gap-y-4">
            <div className="input flex flex-row w-auto">
                <label htmlFor="form-nombre" className="my-auto w-16 font-semibold font-inter text-secondary/80">Nombre</label>
                <input
                    id="form-nombre"
                    type="text"
                    value={newValue.nombre}
                    onChange={(e) => setNewValue(prev => ({ ...prev, nombre: e.target.value }))}
                    className="border border-transparent px-2 my-auto border-b-2 border-b-neutral-600 w-fit font-coda focus:outline-0 focus:border-b-primary focus:scale-110 mx-4 transition"
                />
            </div>
            <div className="input flex flex-row w-auto">
                <label htmlFor="form-plan" className="my-auto w-16 font-semibold font-inter text-secondary/80">Plan</label>
                <input
                    id="form-plan"
                    type="number"
                    value={newValue.plan_id}
                    onChange={(e) => setNewValue(prev => ({ ...prev, plan_id: e.target.value }))}
                    className="border border-transparent px-2 my-auto border-b-2 border-b-neutral-600 w-fit font-coda focus:outline-0 focus:border-b-primary focus:scale-110 mx-4 transition"
                />
            </div>
            <div className="input flex flex-row">
                <label htmlFor="form-es_personalizada" className="my-auto w-16 font-semibold font-inter text-secondary/80">Personalizada</label>
                <input
                    id="form-es_personalizada"
                    checked={personalizada}
                    type="checkbox"
                    onChange={(e) => {
                            setPersonalizada(e.target.checked)
                            setNewValue(prev => ({ ...prev, es_personalizada: e.target.checked }))
                        }
                    }
                    className="border border-transparent px-2 my-auto border-b-2 border-b-neutral-600 w-24 text-center font-coda focus:outline-0 focus:border-b-primary focus:scale-110 mx-4 transition"
                />
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
