from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from api.schemas.dieta_comida_alimento import DietaComidaAlimentoCreate, DietaComidaAlimentoRead, DietaComidaAlimentoUpdate
from api.db.database import SessionLocal
from api.models.dieta_comida_alimento import DietaComidaAlimento
from api.models.alimento import Alimento
from collections import defaultdict
from api.core.dependencies import role_required

router = APIRouter(prefix="/api/dietas", tags=["dietas"])

def get_db():
    db = SessionLocal()
    try: 
        yield db
    finally: 
        db.close()

@router.post("/comida/alimento/asignar", response_model=DietaComidaAlimentoRead)
def asignar_comida_alimento(comida_alimento: DietaComidaAlimentoCreate, db: Session=Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    db_comida_alimento = DietaComidaAlimento(**comida_alimento.dict())
    db.add(db_comida_alimento)
    db.commit()
    db.refresh(db_comida_alimento)
    return db_comida_alimento


@router.get("/{dieta_id}/comida/")
def ver_comidas(dieta_id: int, db: Session = Depends(get_db)):
    comidas = text("""
        SELECT 
            dc.id AS comida_id,
            dc.nombre AS comida,
            SUM((a.calorias_100g / 100.0) * dca.cantidad_g) AS calorias_totales,
            SUM((a.proteinas / 100.0) * dca.cantidad_g) AS proteinas_g,
            SUM((a.carbohidratos / 100.0) * dca.cantidad_g) AS carbohidratos_g,
            SUM((a.grasas / 100.0) * dca.cantidad_g) AS grasas_g
        FROM dieta_comida dc
        JOIN dieta_comida_alimento dca ON dca.dieta_comida_id = dc.id
        JOIN alimento a ON a.id = dca.alimento_id
        WHERE dc.dieta_id = :dieta_id
        GROUP BY dc.id, dc.nombre
        """
    )
    
    result = db.execute(comidas, {"dieta_id" : dieta_id}).mappings().all()
    return result

@router.get("/{dieta_id}/comida/detalles/")
def ver_comidas_detalle(dieta_id: int, db: Session = Depends(get_db)):
    tabla = text("""
    SELECT 
            dc.id AS comida_id,
            dc.nombre AS nombre_comida,
            a.id,
            a.nombre AS nombre_alimento,
            dca.cantidad_g
        FROM dieta_comida dc
        JOIN dieta_comida_alimento dca ON dca.dieta_comida_id = dc.id
        JOIN alimento a ON a.id = dca.alimento_id
        WHERE dc.dieta_id = :dieta_id
        ORDER BY dc.id
    """)
    rows = db.execute(tabla, {"dieta_id": dieta_id}).mappings().all()
    comidas_dict = defaultdict(lambda: {"comida_id": None, "nombre_comida": None, "alimentos": []})
    
    for row in rows:
        comida_id = row["comida_id"]
        if comidas_dict[comida_id]["comida_id"] is None:
            comidas_dict[comida_id]["comida_id"] = comida_id
            comidas_dict[comida_id]["nombre_comida"] = row["nombre_comida"]
        comidas_dict[comida_id]["alimentos"].append({
            "id" : row["id"],
            "nombre": row["nombre_alimento"],
            "cantidad_g": row["cantidad_g"]
        })

    return list(comidas_dict.values())

@router.put("/comida/{asignacion_id}/alimento/modificar", response_model=DietaComidaAlimentoRead)
def modificar_asignacion(asignacion_id: int, dieta_comidaalimento_data: DietaComidaAlimentoUpdate, db: Session = Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    dieta_comida = db.query(DietaComidaAlimento).filter(DietaComidaAlimento.id == asignacion_id).first()
    if not dieta_comida:
        raise HTTPException(status_code=404, detail="La comida seleccionada no tiene ningún alimento asignado.")
    for field, value in dieta_comidaalimento_data.dict(exclude_unset=True).items():
        setattr(dieta_comida, field, value)
    db.commit()
    db.refresh(dieta_comida)
    return dieta_comida

@router.delete("/comida/{asignacion_id}/alimento/eliminar", response_model=DietaComidaAlimentoRead)
def eliminar_asignacion(asignacion_id: int, db: Session = Depends(get_db), user=Depends(role_required("entrenador","admin"))):
    dieta_comida = db.query(DietaComidaAlimento).filter(DietaComidaAlimento.id == asignacion_id).first()
    if not dieta_comida:
        raise HTTPException(status_code=404, detail="La comida seleccionada no tiene ningún alimento asignado.")
    db.delete(dieta_comida)
    db.commit()
    return dieta_comida