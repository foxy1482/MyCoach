from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.schemas.alimento import AlimentoCreate, AlimentoRead, AlimentoUpdate
from api.db.database import SessionLocal
from api.models.alimento import Alimento
from api.core.dependencies import role_required

router = APIRouter(prefix="/api/dietas", tags=["dietas"])

def get_db():
    db = SessionLocal()
    try: 
        yield db
    finally: 
        db.close()

@router.post("/alimento/crear", response_model=AlimentoRead)
def crear_alimento(alimento: AlimentoCreate, db: Session = Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    db_alimento = Alimento(**alimento.dict())
    db.add(db_alimento)
    db.commit()
    db.refresh(db_alimento)
    return db_alimento

@router.get("/alimento/obtener/{id}", response_model=AlimentoRead)
def obtener_alimento(id: int, db: Session = Depends(get_db)):
    alimento = db.query(Alimento).filter(Alimento.id == id).first()
    if not alimento:
        raise HTTPException(status_code=404, detail="El alimento no existe.")
    return alimento

@router.put("/alimento/modificar/{id}",response_model=AlimentoRead)
def modificar_alimento(id: int, alimento_data: AlimentoUpdate, db: Session = Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    alimento = db.query(Alimento).filter(Alimento.id == id).first()
    if not alimento:
        raise HTTPException(status_code=404, detail="El alimento no existe.")
    for field, value in alimento_data.dict(exclude_unset=True).items():
        setattr(alimento_data, field, value)
    
    db.commit()
    db.refresh(alimento)
    return alimento

@router.delete("/alimento/eliminar/{id}", response_model=AlimentoRead)
def eliminar_alimento(id: int, db: Session = Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    alimento = db.query(Alimento).filter(Alimento.id == id).first()
    if not alimento:
        raise HTTPException(status_code=404, detail="El alimento no existe.")
    
    db.delete(alimento)
    db.commit()
    return alimento