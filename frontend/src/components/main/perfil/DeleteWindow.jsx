import { useState } from "react"

export function DeleteWindow({ isOpen, onClose, perfil, onSave })
{

  const handleSubmit = async () => {
  
    await onSave();

    onClose(); // cerrás el modal
    window.location.reload(); // recargás la página (si querés que refresque todo)
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/80">
      <div className="bg-white p-4 rounded-lg shadow-lg font-inter">
        <h2 className="text-lg font-bold">Eliminar tu cuenta</h2>
        <p>Estás seguro de querer eliminar tu cuenta, <span className="font-bold">{perfil.nombre + " "+ perfil.apellido}</span>?</p>
        <p>Perderás acceso a tus rutinas, dietas y progreso guardado.</p>
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
