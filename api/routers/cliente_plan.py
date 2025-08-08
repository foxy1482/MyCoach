from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.schemas.cliente_plan import ClientePlanCreate, ClientePlanRead, ClientePlanUpdate
from api.db.database import SessionLocal
from api.models.cliente_plan import ClientePlan

router = APIRouter(prefix="/api/clientes", tags=["clientes"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally: 
        db.close()

@router.post("/asignar_plan", response_model=ClientePlanRead)
def asignar_plan(clientePlan: ClientePlanCreate, db: Session = Depends(get_db)):
    db_clientePlan = ClientePlan(**clientePlan.dict())
    db.add(db_clientePlan)
    db.commit()
    db.refresh(db_clientePlan)
    return db_clientePlan


@router.get("/cliente_plan/{cliente_id}", response_model=ClientePlanRead)
def obtener_cliente_plan(cliente_id: int, db: Session = Depends(get_db)):
    cliente_plan = db.query(ClientePlan).filter(ClientePlan.cliente_id == cliente_id).first()
    if not cliente_plan:
        raise HTTPException(status_code=404, detail="El cliente no tiene un plan asignado.")
    return cliente_plan


@router.put("/cliente_plan/{cliente_id}", response_model=ClientePlanRead)
def actualizar_cliente_plan(cliente_id: int, cliente_plan_data: ClientePlanUpdate, db: Session = Depends(get_db)):
    cliente_plan = db.query(ClientePlan).filter(ClientePlan.cliente_id == cliente_id).first()
    if not cliente_plan:
        raise HTTPException(status_code=404, detail="El cliente no tiene un plan asignado.")
    for field, value in cliente_plan_data.dict(exclude_unset=True).items():
        setattr(cliente_plan, field, value)

    db.commit()
    db.refresh(cliente_plan)
    return cliente_plan

@router.delete("/cliente_plan/{cliente_id}", response_model=ClientePlanRead)
def eliminar_cliente_plan(cliente_id: int, db: Session = Depends(get_db)):
    cliente_plan = db.query(ClientePlan).filter(ClientePlan.cliente_id == cliente_id).first()
    if not cliente_plan:
        raise HTTPException(status_code=404, detail="El cliente no posee un plan asignado.")
    
    db.delete(cliente_plan)
    db.commit()
    return cliente_plan