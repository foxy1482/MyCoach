export function DeleteWindow({ isOpen, onClose, ejercicio, onSave })
{
    const handleSubmit = async (e) => {

        await onSave("DELETE");
        
        onClose();
        
    };

    if (!isOpen) return null;
    else return (
        <div className="fixed z-20 inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="form-header max-w-64 mb-6">
                    <h2 className="font-bold font-inter text-2xl w-full">Eliminar Ejercicio</h2>
                    <h3 className="text-neutral-500 text-lg">{ejercicio.nombre}</h3>
                </div>
                <p>¿Estás seguro de querer eliminar este ejercicio? No hay vuelta atrás.</p>
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        type="button"
                        onClick={()=>onClose()}
                        className="bg-gray-300 px-4 py-2 rounded cursor-pointer border border-transparent transition hover:bg-neutral-600 hover:border-gray-300 hover:text-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={()=>{handleSubmit(); onClose();}}
                        className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer border border-transparent transition hover:bg-white hover:border-red-500 hover:text-red-500"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
