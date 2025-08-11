from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.schemas.pesaje import PesajeCreate, PesajeRead, PesajeUpdate
from api.db.database import SessionLocal
from api.models.pesaje import Pesaje
from api.core.dependencies import role_required

router = APIRouter(prefix="/api/clientes/pesaje", tags=["pesaje"])

def get_db():
    db = SessionLocal()
    try: 
        yield db
    finally: 
        db.close()

@router.post("/crear", response_model=PesajeRead)
def crear_pesaje(pesaje: PesajeCreate, db: Session = Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    db_pesaje = Pesaje(**pesaje.dict())
    db.add(db_pesaje)
    db.commit()
    db.refresh(db_pesaje)
    return db_pesaje

@router.get("/consultar/{cliente_id}", response_model=list[PesajeRead])
def consultar_pesaje(cliente_id: int, db: Session = Depends(get_db)):
    pesaje = db.query(Pesaje).filter(Pesaje.cliente_id == cliente_id).all()
    if not pesaje:
        raise HTTPException(status_code=404, detail="El pesaje para el cliente ${cliente_id} no existe.")
    return pesaje

@router.put("/modificar/{cliente_id}", response_model=PesajeRead)
def modificar_pesaje(cliente_id: int, pesaje_data: PesajeUpdate, db: Session = Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    pesaje = db.query(Pesaje).filter(Pesaje.cliente_id == cliente_id).first()
    if not pesaje:
        raise HTTPException(status_code=404, detail="El pesaje para el cliente ${cliente_id} no existe.")
    for field, value in pesaje_data.dict(exclude_unset=True).items():
        setattr(pesaje, field, value)
    
    db.commit()
    db.refresh(pesaje)
    return pesaje

@router.delete("/eliminar/{cliente_id}", response_model=PesajeRead)
def eliminar_pesaje(cliente_id: int, db: Session = Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    pesaje = db.query(Pesaje).filter(Pesaje.cliente_id == cliente_id).first()
    if not pesaje:
        raise HTTPException(status_code=404, detail="El pesaje para el cliente especificado no existe.")
    
    db.delete(pesaje)
    db.commit()
    return pesaje