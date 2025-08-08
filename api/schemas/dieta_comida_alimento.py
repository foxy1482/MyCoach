from pydantic import BaseModel
from typing import Optional

class DietaComidaAlimentoCreate(BaseModel):
    dieta_comida_id: int
    alimento_id: int
    cantidad_g: int
    
    class Config:
        schema_extra = {
            "example" : {
                "dieta_comida_id" : 1,
                "alimento_id" : 1,
                "cantidad_g" : 150
            }
        }

class DietaComidaAlimentoRead(BaseModel):
    id: int
    dieta_comida_id: int
    alimento_id: int
    cantidad_g: int
    
    class Config:
        orm_mode = True

class DietaComidaAlimentoUpdate(BaseModel):
    dieta_comida_id: Optional[int] = None
    alimento_id: Optional[int] = None
    cantidad_g: Optional[int] = None
    
    class Config:
        schema_extra = {
            "example" : {
                "dieta_comida_id" : 1,
                "alimento_id" : 1,
                "cantidad_g" : 150
            }
        }