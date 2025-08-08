from pydantic import BaseModel, Field
from typing import Optional

class ComidaCreate(BaseModel):
    dieta_id: int
    nombre: str = Field(..., min_length=2, max_length=10)
    orden: int
    
    class Config:
        schema_extra = {
            "example" : {
                "dieta_id" : 1,
                "nombre" : "Desayuno",
                "orden" : 1
            }
        }

class ComidaRead(BaseModel):
    id: int
    dieta_id: int
    nombre: str
    orden: int
    
    class Config:
        orm_mode=True

class ComidaUpdate(BaseModel):
    dieta_id: Optional[int] = None
    nombre: Optional[str] = None
    orden: Optional[int] = None
    
    class Config:
        schema_extra = {
            "example" : {
                "dieta_id" : 1,
                "nombre" : "Desayuno",
                "orden" : 1
            }
        }