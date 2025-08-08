from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.schemas.plan_periodo import PlanPeriodoCreate, PlanPeriodoRead, PlanPeriodoUpdate
from api.db.database import SessionLocal
from api.models.plan_periodo import PlanPeriodo

router = APIRouter(prefix="/api/planes", tags=["planes"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/periodos/crear", response_model= PlanPeriodoRead)
def crear_periodo(periodo: PlanPeriodoCreate, db: Session = Depends(get_db)):
    db_periodo = PlanPeriodo(**periodo.dict(()))
    db.add(db_periodo)
    db.commit()
    db.refresh(db_periodo)
    return db_periodo

@router.get("/periodos/", response_model= list[PlanPeriodoRead])
def ver_periodos(db: Session = Depends(get_db)):
    return db.query(PlanPeriodo).all()

@router.get("/periodos/{id}", response_model=PlanPeriodoRead)
def buscar_periodo(id: int, db: Session = Depends(get_db)):
    periodo = db.query(PlanPeriodo).filter(PlanPeriodo.id == id).first()
    if not periodo:
        raise HTTPException(status_code=404, detail="El período no existe.")
    return periodo

@router.put("/periodos/modificar/{id}", response_model=PlanPeriodoRead)
def modificar_periodo(id: int, periodo_data: PlanPeriodoUpdate, db: Session = Depends(get_db)):
    periodo = db.query(PlanPeriodo).filter(PlanPeriodo.id == id).first()
    if not periodo:
        raise HTTPException(status_code=404, detail="El período no existe.")
    for field, value in periodo_data.dict(exclude_unset=True).items():
        setattr(periodo, field, value)
    db.commit()
    db.refresh(periodo)
    return periodo

@router.delete("/periodos/eliminar/{id}", response_model=PlanPeriodoRead)
def eliminar_periodo(id: int, db: Session = Depends(get_db)):
    periodo = db.query(PlanPeriodo).filter(PlanPeriodo.id == id).first()
    if not periodo:
        raise HTTPException(status_code=404, detail="El período no existe.")
    db.delete(periodo)
    db.commit()
    return periodo