from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class ClienteDietaCreate(BaseModel):
    cliente_id: int
    rutina_id: int
    fecha_asignacion: date
    
    class Config:
        schema_extra = {
            "example" : {
                "cliente_id" : 1,
                "rutina_id" : 1,
                "fecha_asignacion" : "2025-08-05"
            }
        }

class ClienteDietaRead(BaseModel):
    id: int
    cliente_id: int
    rutina_id: int
    fecha_asignacion: date
    
    class Config:
        orm_mode = True

class ClienteDietaUpdate(BaseModel):
    rutina_id: Optional[int] = None
    fecha_asignacion: Optional[date] = None
    
    class Config:
        schema_extra = {
            "example" : {
                "rutina_id" : 1,
                "fecha_asignacion" : "2025-08-05"
            }
        }