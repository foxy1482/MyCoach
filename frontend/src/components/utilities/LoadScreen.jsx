export function LoadScreen()
{
    return (
        <div className="fixed top-0 left-0 opacity-100 size-full bg-white z-50 flex justify-center">
            <img src="/img/loading.gif" alt="Cargando.." width={96} height={96} className="m-auto"/>
        </div>
    )
}