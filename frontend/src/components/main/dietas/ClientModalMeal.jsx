import { ShowSvg } from "../../utilities/ShowSvg"

export function ClientModalMeal({ comida, modalActivo, setModalActivo })
{
    return (
        <div className="oscuro fixed top-0 left-0 size-full z-20 flex bg-black/80">
            <div className="bg-white rounded-2xl shadow-2xl max-w-[460px] lg:max-w-4xl w-full max-h-[80vh] overflow-hidden font-inter m-auto">

                <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">{comida.nombre_comida}</h2>
                        <button onClick={() => setModalActivo(null)} className="bg-red-400 rounded-full text-white hover:bg-neutral-500 cursor-pointer transition">
                            <ShowSvg size="20" name="cross"></ShowSvg>
                        </button>
                    </div>
                    <div className="text-green-100 mt-2">
                        {"Total - " + comida.calorias_totales + " kcal"}
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-96">
                    <ul className="space-y-4">
                        {comida.alimentos.map((alimento) => (
                            <li key={alimento.nombre} className=
                            "flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition duration-200">
                                <div className="flex items-center space-x-4">
                                    <div className="size-3 bg-primary rounded-full"></div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{alimento.nombre}</h4>
                                        <p className="text-sm text-gray-600">{alimento.cantidad_g} g</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-primary">{((alimento.cantidad_g / 100) * alimento.calorias_100g) + " kcal"}</p>
                                    <div className="macros text-xs text-gray-500 flex flex-row gap-x-2">
                                        <span className="text-primary">{((alimento.cantidad_g / 100) * alimento.carbohidratos).toFixed(2) + " g"}</span>
                                        <span className="text-orangeM">{((alimento.cantidad_g / 100) * alimento.proteinas).toFixed(2) + " g"}</span>
                                        <span className="text-primary">{((alimento.cantidad_g / 100) * alimento.grasas).toFixed(2) + " g"}</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6 p-4 border-t border-gray-200">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <p className="text-2xl font-bold text-primary">{comida.proteinas_g.toFixed(2) + "g"}</p>
                                <p className="text-sm text-gray-600">Proteínas</p>
                            </div>
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <p className="text-2xl font-bold text-primary">{comida.carbohidratos_g.toFixed(2) + "g"}</p>
                                <p className="text-sm text-gray-600">Carbohidratos</p>
                            </div>
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <p className="text-2xl font-bold text-primary">{comida.grasas_g.toFixed(2) + "g"}</p>
                                <p className="text-sm text-gray-600">Grasas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}