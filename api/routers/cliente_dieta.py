from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.schemas.cliente_dieta import ClienteDietaCreate, ClienteDietaRead, ClienteDietaUpdate
from api.db.database import SessionLocal
from api.models.cliente_dieta import ClienteDieta
from api.core.dependencies import role_required

router = APIRouter(prefix="/api/clientes", tags=["clientes"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/cliente_dieta/asignar", response_model= ClienteDietaRead)
def asignar_dieta(clienteDieta: ClienteDietaCreate, db: Session = Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    db_clienteRutina = ClienteDieta(**clienteDieta.dict())
    db.add(db_clienteRutina)
    db.commit()
    db.refresh(db_clienteRutina)
    return db_clienteRutina


@router.get("/cliente_dieta/{cliente_id}", response_model=ClienteDietaRead)
def obtener_cliente_dieta(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(ClienteDieta).filter(ClienteDieta.cliente_id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="El cliente no tiene una dieta asignada.")
    return cliente


@router.put("/cliente_dieta/{cliente_id}", response_model=ClienteDietaRead)
def actualizar_cliente_dieta(cliente_id: int, cliente_dieta_data: ClienteDietaUpdate, db: Session = Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    cliente_dieta = db.query(ClienteDieta).filter(ClienteDieta.cliente_id == cliente_id).first()
    if not cliente_dieta:
        raise HTTPException(status_code=404, detail = "El cliente no posee una dieta asignada. Asígnesela antes de cambiarla.")
    for field, value in cliente_dieta_data.dict(exclude_unset=True).items():
        setattr(cliente_dieta, field, value)
    
    db.commit()
    db.refresh(cliente_dieta)
    return cliente_dieta


@router.delete("/cliente_dieta/{cliente_id}", response_model=ClienteDietaRead)
def eliminar_cliente_dieta(cliente_id: int, db: Session = Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    cliente_dieta = db.query(ClienteDieta).filter(ClienteDieta.cliente_id == cliente_id).first()
    if not cliente_dieta:
        raise HTTPException(status_code=404, detail = "El cliente no posee una dieta asignada.")
    
    db.delete(cliente_dieta)
    db.commit()
    return cliente_dieta