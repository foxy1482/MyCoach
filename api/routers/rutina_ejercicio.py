from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.schemas.rutina_ejercicio import RutinaEjercicioCreate, RutinaEjercicioRead, RutinaEjerciciosUpdate
from api.db.database import SessionLocal
from api.models.rutina_ejercicio import RutinaEjercicio
from api.models.ejercicio import Ejercicio
from api.schemas.ejercicio import EjercicioRead

router = APIRouter(prefix="/api/rutinas", tags=["rutinas"])

def get_db():
    db = SessionLocal()
    try: 
        yield db
    finally: 
        db.close()

@router.post("/asignar_ejercicio", response_model=RutinaEjercicioRead)
def asignar_ejercicio(rutina_ejercicio: RutinaEjercicioCreate, db: Session = Depends(get_db)):
    db_rutina_ejercicio = RutinaEjercicio(**rutina_ejercicio.dict())
    db.add(db_rutina_ejercicio)
    db.commit()
    db.refresh(db_rutina_ejercicio)
    return db_rutina_ejercicio

@router.get("/{rutina_id}/ejercicios", response_model=list[EjercicioRead])
def ver_ejercicios_de_rutina(rutina_id: int, db: Session = Depends(get_db)):
    ejercicios = (
        db.query(Ejercicio)
        .join(RutinaEjercicio, Ejercicio.id == RutinaEjercicio.ejercicio_id)
        .filter(RutinaEjercicio.rutina_id == rutina_id)
        .all()
    )
    return ejercicios

@router.get("/{rutina_id}/{ejercicio_id}/", response_model=RutinaEjercicioRead)
def detalles_de_asignacion(rutina_id: int, ejercicio_id: int, db: Session = Depends(get_db)):
    rutina_ejercicio = db.query(RutinaEjercicio).filter(RutinaEjercicio.rutina_id == rutina_id).filter(RutinaEjercicio.ejercicio_id == ejercicio_id).first()
    if not rutina_ejercicio:
        raise HTTPException(status_code=404, detail="Esa asignación no existe.")
    return rutina_ejercicio

@router.put("/{rutina_id}/{ejercicio_id}/modificar/", response_model=RutinaEjercicioRead)
def modificar_asignacion(rutina_id: int, ejercicio_id: int, rutina_ejercicio_data: RutinaEjerciciosUpdate, db: Session = Depends(get_db)):
    rutina_ejercicio = db.query(RutinaEjercicio).filter(RutinaEjercicio.rutina_id == rutina_id).filter(RutinaEjercicio.ejercicio_id == ejercicio_id).first()
    if not rutina_ejercicio:
        raise HTTPException(status_code=404, detail="Esa asignación no existe. Debe crearla primero.")
    for field, value in rutina_ejercicio_data.dict(exclude_unset=True).items():
        setattr(rutina_ejercicio, field, value)
    
    db.commit()
    db.refresh(rutina_ejercicio)
    return rutina_ejercicio

@router.delete("/{rutina_id}/{ejercicio_id}/eliminar/", response_model=RutinaEjercicioRead)
def eliminar_asignacion(rutina_id: int, ejercicio_id: int, db: Session = Depends(get_db)):
    rutina_ejercicio = db.query(RutinaEjercicio).filter(RutinaEjercicio.rutina_id == rutina_id).filter(RutinaEjercicio.ejercicio_id == ejercicio_id).first()
    if not rutina_ejercicio:
        raise HTTPException(status_code=404, detail="Esa asignación no existe.")
    
    db.delete(rutina_ejercicio)
    db.commit()
    return rutina_ejercicio