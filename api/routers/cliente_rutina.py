from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.schemas.cliente_rutina import ClienteRutinaCreate, ClienteRutinaRead, ClienteRutinaUpdate
from api.db.database import SessionLocal
from api.models.cliente_rutina import ClienteRutina
from api.core.dependencies import role_required

router = APIRouter(prefix="/api/clientes", tags=["clientes"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/cliente_rutina/asignar", response_model= ClienteRutinaRead)
def asignar_rutina(clienteRutina: ClienteRutinaCreate, db: Session = Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    db_clienteRutina = ClienteRutina(**clienteRutina.dict())
    db.add(db_clienteRutina)
    db.commit()
    db.refresh(db_clienteRutina)
    return db_clienteRutina


@router.get("/cliente_rutina/{cliente_id}", response_model=ClienteRutinaRead)
def obtener_cliente_rutina(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(ClienteRutina).filter(ClienteRutina.cliente_id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="El cliente no tiene una rutina asignada.")
    return cliente


@router.put("/cliente_rutina/{cliente_id}", response_model=ClienteRutinaRead)
def actualizar_cliente_rutina(cliente_id: int, cliente_rutina_data: ClienteRutinaUpdate, db: Session = Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    cliente_rutina = db.query(ClienteRutina).filter(ClienteRutina.cliente_id == cliente_id).first()
    if not cliente_rutina:
        raise HTTPException(status_code=404, detail = "El cliente no posee una rutina asignada. Asígnesela antes de cambiarla.")
    for field, value in cliente_rutina_data.dict(exclude_unset=True).items():
        setattr(cliente_rutina, field, value)
    
    db.commit()
    db.refresh(cliente_rutina)
    return cliente_rutina


@router.delete("/cliente_rutina/{cliente_id}", response_model=ClienteRutinaRead)
def eliminar_cliente_rutina(cliente_id: int, db: Session = Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    cliente_rutina = db.query(ClienteRutina).filter(ClienteRutina.cliente_id == cliente_id).first()
    if not cliente_rutina:
        raise HTTPException(status_code=404, detail = "El cliente no posee una rutina asignada.")
    
    db.delete(cliente_rutina)
    db.commit()
    return cliente_rutina