from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class ClientePlanCreate(BaseModel):
    cliente_id: int
    plan_id: int
    fecha_inicio: date
    fecha_fin: date
    activo: bool
    
    class Config:
        schema_extra = {
            "example" : {
                "cliente_id" : 1,
                "plan_id" : 1,
                "fecha_inicio" : "2025-08-05",
                "fecha_fin" : "2025-11-05",
                "activo" : True
            }
        }

class ClientePlanRead(BaseModel):
    id: int
    cliente_id: int
    plan_id: int
    fecha_inicio: date
    fecha_fin: date
    activo: bool
    
    class Config:
        orm_mode = True

class ClientePlanUpdate(BaseModel):
    plan_id: Optional[int] = None
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None
    activo: Optional[bool] = None
    
    class Config:
        schema_extra = {
            "example" : {
                "plan_id" : 1,
                "fecha_inicio" : "2025-11-06",
                "fecha_fin" : "2026-02-06",
                "activo" : True
            }
        }