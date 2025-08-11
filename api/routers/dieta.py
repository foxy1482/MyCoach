from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.schemas.dieta import DietaCreate, DietaRead, DietaUpdate
from api.db.database import SessionLocal
from api.models.dieta import Dieta
from api.core.dependencies import role_required

router = APIRouter(prefix="/api/dietas", tags=["dietas"])

def get_db():
    db = SessionLocal()
    try: 
        yield db
    finally: 
        db.close()

@router.post("/crear", response_model=DietaRead)
def crear_dieta(dieta: DietaCreate, db: Session = Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    db_dieta = Dieta(**dieta.dict())
    db.add(db_dieta)
    db.commit()
    db.refresh(db_dieta)
    return db_dieta

@router.get("/", response_model=list[DietaRead])
def listar_dietas(db: Session = Depends(get_db)):
    return db.query(Dieta).all()


@router.get("/{id}", response_model=DietaRead)
def buscar_dieta(id: int, db: Session = Depends(get_db)):
    dieta = db.query(Dieta).filter(Dieta.id == id).first()
    if not dieta:
        raise HTTPException(status_code=404, detail="Esa dieta no existe.")
    return dieta


@router.put("/modificar/{id}", response_model=DietaRead)
def modificar_dieta(id: int, dieta_data: DietaUpdate, db: Session = Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    dieta = db.query(Dieta).filter(Dieta.id == id).first()
    if not dieta:
        raise HTTPException(status_code=404, detail="Esa dieta no existe.")
    for field, value in dieta_data.dict(exclude_unset=True).items():
        setattr(dieta, field, value)
    
    db.commit()
    db.refresh(dieta)
    return dieta

@router.delete("/eliminar/{id}", response_model=DietaRead)
def eliminar_dieta(id: int, db: Session = Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    dieta = db.query(Dieta).filter(Dieta.id == id).first()
    if not dieta:
        raise HTTPException(status_code=404, detail="Esa dieta no existe.")
    
    db.delete(dieta)
    db.commit()
    return dieta