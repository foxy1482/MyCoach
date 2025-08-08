from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from sqlalchemy.orm import Session
from api.schemas.ejercicio import EjercicioCreate, EjercicioRead, EjercicioUpdate
from api.db.database import SessionLocal
from api.models.ejercicio import Ejercicio

router = APIRouter(prefix="/api/rutinas", tags=["rutinas"])

def get_db():
    db = SessionLocal()
    try: 
        yield db
    finally: 
        db.close()

@router.post("/ejercicios/crear", response_model=EjercicioCreate)
def crear_ejercicio(ejercicio: EjercicioCreate, db: Session = Depends(get_db)):
    db_ejercicio = Ejercicio(**ejercicio.dict())
    db.add(db_ejercicio)
    db.commit()
    db.refresh(db_ejercicio)
    return db_ejercicio

@router.get("/ejercicios/{id}", response_model=EjercicioRead)
def obtener_ejercicio(id: int, db: Session = Depends(get_db)):
    ejercicio = db.query(Ejercicio).filter(Ejercicio.id == id).first()
    if not ejercicio:
        raise HTTPException(status_code=404, detail="El ejercicio no existe.")
    return ejercicio

@router.get("/ejercicios/", response_model=list[EjercicioRead])
def buscar_ejercicios(query: Optional[str] = Query(default=None), db: Session = Depends(get_db)):
    if query:
        ejercicios = db.query(Ejercicio).filter(Ejercicio.nombre.ilike(f"%{query}%")).all()
    else: 
        ejercicios = db.query(Ejercicio).all()
    if not ejercicios:
        raise HTTPException(status_code=404, detail="El ejercicio no existe.")
    return ejercicios

@router.put("/ejercicios/modificar/{id}", response_model=EjercicioRead)
def modificar_ejercicio(id: int, ejercicio_data: EjercicioUpdate, db: Session = Depends(get_db)):
    ejercicio = db.query(Ejercicio).filter(Ejercicio.id == id).first()
    if not ejercicio:
        raise HTTPException(status_code=404, detail="El ejercicio no existe.")
    for field, value in ejercicio_data.dict(exclude_unset=True).items():
        setattr(ejercicio, field, value)
    db.commit()
    db.refresh(ejercicio)
    return ejercicio

@router.delete("/ejercicios/eliminar/{id}", response_model=EjercicioRead)
def eliminar_ejercicio(id: int, db: Session = Depends(get_db)):
    ejercicio = db.query(Ejercicio).filter(Ejercicio.id == id).first()
    if not ejercicio:
        raise HTTPException(status_code=404, detail="El ejercicio no existe.")
    db.delete(ejercicio)
    db.commit()
    return ejercicio
