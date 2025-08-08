from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class PesajeCreate(BaseModel):
    cliente_id: int
    fecha: date
    peso: float
    grasa_corporal: float
    
    class Config:
        schema_extra = {
            "example" : {
                "cliente_id" : 1,
                "fecha" : "2025-08-06",
                "peso": 72.6,
                "grasa_corporal": 14.4
            }
        }

class PesajeRead(BaseModel):
    cliente_id: int
    fecha: date
    peso: float
    grasa_corporal: float
    
    class Config:
        orm_mode = True


class PesajeUpdate(BaseModel):
    fecha: Optional[date] = None
    peso: Optional[float] = None
    grasa_corporal: Optional[float] = None
    
    class Config:
        schema_extra = {
            "example" : {
                "cliente_id" : 1,
                "fecha" : "2025-08-06",
                "peso": 72.6,
                "grasa_corporal": 14.4
            }
        }