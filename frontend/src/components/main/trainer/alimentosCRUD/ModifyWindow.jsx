import { useState } from "react"

export function ModifyWindow({ isOpen, alimento, onClose, onSave })
{
    const [newValue, setNewValue] = useState(alimento);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSave("PUT", newValue);

        onClose();
    };

    if (!isOpen) return null;
    else return (
    <div className="fixed z-20 inset-0 flex items-center justify-center bg-black/50">
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="form-header max-w-64 mb-6">
                <h2 className="font-bold font-inter text-2xl w-full">Modificar Alimento</h2>
            </div>
        <form onSubmit={handleSubmit}>
            <div className="form-inputs flex flex-col gap-y-4">
            <div className="input flex flex-row w-auto">
                <label htmlFor="form-nombre" className="my-auto w-24 font-semibold font-inter text-secondary/80">Nombre</label>
                <input
                    id="form-nombre"
                    type="text"
                    value={newValue.nombre}
                    onChange={(e) => setNewValue(prev => ({ ...prev, nombre: e.target.value }))}
                    className="border border-transparent px-2 my-auto border-b-2 border-b-neutral-600 w-fit font-coda focus:outline-0 focus:border-b-primary focus:scale-110 mx-4 transition"
                />
            </div>
            <div className="input flex flex-row w-auto">
                <label htmlFor="form-calorias" className="my-auto w-24 font-semibold font-inter text-secondary/80">Calorías c/100g</label>
                <input
                    id="form-calorias"
                    type="number"
                    value={newValue.calorias_100g}
                    onChange={(e) => setNewValue(prev => ({ ...prev, calorias_100g: e.target.value }))}
                    className="border border-transparent px-2 my-auto border-b-2 border-b-neutral-600 w-fit font-coda focus:outline-0 focus:border-b-primary focus:scale-110 mx-4 transition"
                />
            </div>
            <div className="input flex flex-row w-auto">
                <label htmlFor="form-proteinas" className="my-auto w-24 font-semibold font-inter text-secondary/80">Proteínas</label>
                <input
                    id="form-proteinas"
                    type="number"
                    value={newValue.proteinas}
                    onChange={(e) => setNewValue(prev => ({ ...prev, proteinas: e.target.value }))}
                    className="border border-transparent px-2 my-auto border-b-2 border-b-neutral-600 w-fit font-coda focus:outline-0 focus:border-b-primary focus:scale-110 mx-4 transition"
                />
            </div>
            <div className="input flex flex-row w-auto">
                <label htmlFor="form-grasas" className="my-auto w-24 font-semibold font-inter text-secondary/80">Grasas</label>
                <input
                    id="form-grasas"
                    type="number"
                    value={newValue.grasas}
                    onChange={(e) => setNewValue(prev => ({ ...prev, grasas: e.target.value }))}
                    className="border border-transparent px-2 my-auto border-b-2 border-b-neutral-600 w-fit font-coda focus:outline-0 focus:border-b-primary focus:scale-110 mx-4 transition"
                />
            </div>
            <div className="input flex flex-row w-auto">
                <label htmlFor="form-carbos" className="my-auto w-24 font-semibold font-inter text-secondary/80">Carbohidratos</label>
                <input
                    id="form-carbos"
                    type="number"
                    value={newValue.carbohidratos}
                    onChange={(e) => setNewValue(prev => ({ ...prev, carbohidratos: e.target.value }))}
                    className="border border-transparent px-2 my-auto border-b-2 border-b-neutral-600 w-fit font-coda focus:outline-0 focus:border-b-primary focus:scale-110 mx-4 transition"
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
