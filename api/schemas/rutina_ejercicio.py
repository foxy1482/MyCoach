from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

class RutinaEjercicioCreate(BaseModel):
    rutina_id: int
    ejercicio_id: int
    dia: str = Field(..., min_length=1, max_length=16)
    series: int
    repeticiones: int
    rir: int
    
    class Config:
        schema_extra = {
            "example" : {
                "rutina_id": 1,
                "ejercicio_id": 1,
                "dia" : "Lunes",
                "series" : 4,
                "repeticiones" : 8,
                "rir" : 1
            }
        }

class RutinaEjercicioRead(BaseModel):
    id: int
    rutina_id: int
    ejercicio_id: int
    dia: str
    series: int
    repeticiones: int
    rir: int
    
    class Config:
        orm_mode = True

class EjerciciosRutinaRead(BaseModel):
    id: int
    dia: str
    series: int
    repeticiones: int
    rir: int
    ejercicio_id: int
    nombre: str
    grupo_muscular: Optional[str] = "General"

    # En Pydantic V2, orm_mode se llama from_attributes
    class Config:
        orm_mode = True

class RutinaEjerciciosUpdate(BaseModel):
    dia: Optional[str] = None
    series: Optional[int] = None
    repeticiones: Optional[int] = None
    rir: Optional[int] = None
    
    class Config:
        schema_extra = {
            "example" : {
                "dia" : "Lunes",
                "series" : 4,
                "repeticiones" : 8,
                "rir" : 1
            }
        }