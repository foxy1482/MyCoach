from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.schemas.dieta_comida import ComidaCreate, ComidaRead, ComidaUpdate
from api.db.database import SessionLocal
from api.models.dieta_comida import Comida
from api.core.dependencies import role_required

router = APIRouter(prefix="/api/dietas", tags=["dietas"])

def get_db():
    db = SessionLocal()
    try: 
        yield db
    finally: 
        db.close()

@router.post("/comida/crear", response_model=ComidaRead)
def crear_comida(comida: ComidaCreate, db: Session = Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    db_comida = Comida(**comida.dict())
    db.add(db_comida)
    db.commit()
    db.refresh(db_comida)
    return db_comida

@router.get("/comida/", response_model=list[ComidaRead])
def listar_comidas(db: Session = Depends(get_db)):
    return db.query(Comida).all()

@router.get("/comida/{id}", response_model=ComidaRead)
def buscar_comida(id: int, db: Session = Depends(get_db)):
    comida = db.query(Comida).filter(Comida.id == id).first()
    if not comida:
        raise HTTPException(status_code=404, detail="La comida especificada no existe.")
    return comida

@router.put("/comida/modificar/{id}", response_model=ComidaRead)
def modificar_comida(id: int, comida_data: ComidaUpdate, db: Session = Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    comida = db.query(Comida).filter(Comida.id == id).first()
    if not comida:
        raise HTTPException(status_code=404, detail="La comida especificada no existe.")
    for field, value in comida_data.dict(exclude_unset=True).items():
        setattr(comida, field, value)
    db.commit()
    db.refresh(comida)
    return comida

@router.delete("/comida/eliminar/{id}", response_model=ComidaRead)
def eliminar_comida(id: int, db: Session = Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    comida = db.query(Comida).filter(Comida.id == id).first()
    if not comida:
        raise HTTPException(status_code=404, detail="La comida especificada no existe.")
    db.delete(comida)
    db.commit()
    return comida