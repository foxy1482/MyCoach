from pydantic import BaseModel
from typing import Optional

class AlimentoCreate(BaseModel):
    nombre: str
    calorias_100g: int
    proteinas: float
    grasas: float
    carbohidratos: float
    
    class Config:
        schema_extra = {
            "example": {
                "nombre" : "Manzana",
                "calorias_100g": 56,
                "proteinas" : 0,
                "grasas" : 0,
                "carbohidratos" : 14
            }
        }

class AlimentoRead(BaseModel):
    id: int
    nombre: str
    calorias_100g: int
    proteinas: float
    grasas: float
    carbohidratos: float
    
    class Config:
        orm_mode = True

class AlimentoUpdate(BaseModel):
    nombre: Optional[str] = None
    calorias_100g: Optional[int] = None
    proteinas: Optional[float] = None
    grasas: Optional[float] = None
    carbohidratos: Optional[float] = None
    
    class Config:
        schema_extra = {
            "example" : {
                "nombre" : "Manzana",
                "calorias_100g": 56,
                "proteinas" : 0,
                "grasas" : 0,
                "carbohidratos" : 14
            }
        }