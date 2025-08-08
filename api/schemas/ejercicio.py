from pydantic import BaseModel, Field
from typing import Optional

class EjercicioCreate(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=20)
    grupo_muscular: str = Field(..., min_length=1, max_length=16)
    
    class Config:
        schema_extra = {
            "example" : {
                "nombre" : "Press Banca",
                "grupo_muscular" : "Pectorales"
            }
        }

class EjercicioRead(BaseModel):
    id: int
    nombre: str
    grupo_muscular: str
    
    class Config:
        orm_mode = True

class EjercicioUpdate(BaseModel):
    nombre: Optional[str] = None
    grupo_muscular: Optional[str] = None
    
    class Config:
        schema_extra = {
            "example" : {
                "nombre" : "Press Banca",
                "grupo_muscular" : "Pectorales"
            }
        }