from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.schemas.rutina import RutinaCreate, RutinaRead, RutinaUpdate
from api.db.database import SessionLocal
from api.models.rutina import Rutina

router = APIRouter(prefix="/api/rutinas", tags=["rutinas"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/crear", response_model = RutinaRead)
def crear_rutina(rutina: RutinaCreate, db: Session = Depends(get_db)):
    db_rutina = Rutina(**rutina.dict())
    db.add(db_rutina)
    db.commit()
    db.refresh(db_rutina)
    return db_rutina

@router.get("/", response_model=list[RutinaRead])
def listar_rutinas(db: Session= Depends(get_db)):
    return db.query(Rutina).all()

@router.get("/{id}", response_model=RutinaRead)
def obtener_rutina(id: int, db: Session = Depends(get_db)):
    rutina = db.query(Rutina).filter(Rutina.id == id).first()
    if not rutina:
        raise HTTPException(status_code=404, detail="La rutina no existe.")
    return rutina

@router.put("/modificar/{id}", response_model=RutinaRead)
def modificar_rutina(id: int, rutina_data: RutinaUpdate, db: Session = Depends(get_db)):
    rutina = db.query(Rutina).filter(Rutina.id == id).first()
    if not rutina:
        raise HTTPException(status_code=404, detail="La rutina no existe.")
    for field, value in rutina_data.dict(exclude_unset=True).items():
        setattr(rutina, field, value)
    
    db.commit()
    db.refresh(rutina)
    return rutina

@router.delete("/eliminar/{id}", response_model=RutinaRead)
def eliminar_rutina(id: int, db: Session = Depends(get_db)):
    rutina = db.query(Rutina).filter(Rutina.id == id).first()
    if not rutina:
        raise HTTPException(status_code=404, detail="La rutina no existe.")
    db.delete(rutina)
    db.commit()
    return rutina