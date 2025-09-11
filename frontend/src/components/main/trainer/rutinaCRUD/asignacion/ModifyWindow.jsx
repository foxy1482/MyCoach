import { useState } from "react"

export function ModifyWindow({ isOpen, onClose, asignacion, onSave })
{
    const [newValue, setNewValue] = useState(asignacion);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Llamás a la función que hace el PUT
        await onSave("PUT", newValue);
        
        onClose(); // cerrás el modal
        
    };

    if (!isOpen) return null;
    else return (
        <div className="fixed z-20 inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="form-header max-w-64 mb-6">
                    <h2 className="font-bold font-inter text-2xl w-full">Modificar Asignación</h2>
                    <h3 className="text-neutral-500 text-lg">{asignacion.nombre}</h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-inputs flex flex-col gap-y-4">
                        <div className="input flex flex-row w-auto">
                            <label htmlFor="form-dia" className="my-auto w-10 font-semibold font-inter text-secondary/80">Día</label>
                            <input
                                id="form-dia"
                                type="text"
                                value={newValue.dia}
                                onChange={(e) => setNewValue(prev => ({ ...prev, dia: e.target.value }))}
                                className="border border-transparent px-2 my-auto border-b-2 border-b-neutral-600 w-fit font-coda focus:outline-0 focus:border-b-primary focus:scale-110 mx-4 transition"
                            />
                        </div>
                        <div className="input flex flex-row">
                            <label htmlFor="form-series" className="my-auto w-10 font-semibold font-inter text-secondary/80">Series</label>
                            <input
                                id="form-series"
                                type="number"
                                value={newValue.series}
                                onChange={(e) => setNewValue(prev => ({ ...prev, series: Number(e.target.value) }))}
                                className="border border-transparent px-2 my-auto border-b-2 border-b-neutral-600 w-24 text-center font-coda focus:outline-0 focus:border-b-primary focus:scale-110 mx-4 transition"
                            />
                        </div>
                        <div className="input flex flex-row">
                            <label htmlFor="form-reps" className="my-auto w-10 font-semibold font-inter text-secondary/80">Reps</label>
                            <input
                                id="form-reps"
                                type="number"
                                value={newValue.repeticiones}
                                onChange={(e) => setNewValue(prev => ({ ...prev, repeticiones: Number(e.target.value) }))}
                                className="border border-transparent px-2 my-auto border-b-2 border-b-neutral-600 w-24 text-center font-coda focus:outline-0 focus:border-b-primary focus:scale-110 mx-4 transition"
                            />
                        </div>
                        <div className="input flex flex-row">
                            <label htmlFor="form-rir" className="my-auto w-10 font-semibold font-inter text-secondary/80">RIR</label>
                            <input
                                id="form-rir"
                                type="number"
                                value={newValue.rir}
                                onChange={(e) => setNewValue(prev => ({ ...prev, rir: Number(e.target.value) }))}
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
