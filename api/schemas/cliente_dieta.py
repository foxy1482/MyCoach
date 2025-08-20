from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class ClienteDietaCreate(BaseModel):
    cliente_id: int
    dieta_id: int
    fecha_asignacion: date
    
    class Config:
        schema_extra = {
            "example" : {
                "cliente_id" : 1,
                "dieta_id" : 1,
                "fecha_asignacion" : "2025-05-05"
            }
        }

class ClienteDietaRead(BaseModel):
    id: int
    cliente_id: int
    dieta_id: int
    fecha_asignacion: date
    
    class Config:
        orm_mode = True

class ClienteDietaUpdate(BaseModel):
    dieta_id: Optional[int] = None
    fecha_asignacion: Optional[date] = None
    
    class Config:
        schema_extra = {
            "example" : {
                "dieta_id" : 1,
                "fecha_asignacion" : "2025-05-05"
            }
        }