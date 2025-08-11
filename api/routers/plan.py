from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.schemas.plan import PlanCreate, PlanRead, PlanUpdate
from api.db.database import SessionLocal
from api.models.plan import Plan
from api.core.dependencies import role_required

router = APIRouter(prefix="/api/planes", tags=["planes"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/crear", response_model= PlanRead)
def crear_plan(plan: PlanCreate, db: Session = Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    db_plan = Plan(**plan.dict())
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan

@router.get("/", response_model=list[PlanRead])
def listar_planes(db: Session = Depends(get_db)):
    return db.query(Plan).all()

@router.get("/{id}", response_model=PlanRead)
def buscar_plan(id: int, db: Session = Depends(get_db)):
    plan = db.query(Plan).filter(Plan.id == id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="El plan no existe.")
    return plan

@router.put("/modificar/{id}", response_model=PlanRead)
def modificar_plan(id: int, plan_data: PlanUpdate, db: Session = Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    plan = db.query(Plan).filter(Plan.id == id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="El plan no existe.")
    for field, value in plan_data.dict(exclude_unset=True).items():
        setattr(plan, field, value)
    
    db.commit()
    db.refresh(plan)
    return plan

@router.delete("/eliminar/{id}", response_model=PlanRead)
def borrar_plan(id: int, db: Session = Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    plan = db.query(Plan).filter(Plan.id == id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="El plan no existe.")
    
    db.delete(plan)
    db.commit()
    return plan