import { useState } from "react"

export function ModifyWindow({ isOpen, onClose, fieldType, fieldName, currentValue, onSave })
{
  const [newValue, setNewValue] = useState(currentValue);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Llamás a la función que hace el PUT
    await onSave("PUT", newValue);

    onClose(); // cerrás el modal
    window.location.reload(); // recargás la página (si querés que refresque todo)
  };

  if (!isOpen) return null;
  if (currentValue == "M" || currentValue == "F")
  {
    return (
      <div className="fixed z-20 inset-0 flex items-center justify-center bg-black/50">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-bold">Modificar {fieldName}</h2>
            <div className="flex gap-4">
                <label className="flex items-center">
                    <input
                        type="radio"
                        name="sexo"
                        value="M"
                        checked={newValue === "M"}
                        onChange={(e) => setNewValue(e.target.value)}
                        className="accent-indigo-500"
                        required
                    />
                    <span className="ml-2">Masculino</span>
                </label>
                <label className="flex items-center">
                    <input
                        type="radio"
                        name="sexo"
                        value="F"
                        checked={newValue === "F"}
                        onChange={(e) => setNewValue(e.target.value)}
                        className="accent-pink-500"
                        required
                    />
                    <span className="ml-2">Femenino</span>
                </label>
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
    )
  }
  else return (
    <div className="fixed z-20 inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold">Modificar {fieldName}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type={fieldType == "int" ? "number" : "text"}
            value={newValue}
            onChange={(e) => {setNewValue(e.target.value)}}
            className="border p-2 rounded w-full mt-2"
          />
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
