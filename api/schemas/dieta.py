from pydantic import BaseModel, Field
from typing import Optional

class DietaCreate(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=25)
    plan_id: int
    descripcion: str = Field(..., min_length=1, max_length=256)
    
    class Config:
        schema_extra = {
            "example" : {
                "nombre" : "cetogenica",
                "plan_id" : 1,
                "descripcion" : "Una dieta SIN carbohidratos, en la que el cuerpo entra en un estado de cetogénesis y pérdida de grasa"
            }
        }

class DietaRead(BaseModel):
    id: int
    nombre: str
    plan_id: int
    descripcion: str
    
    class Config:
        orm_mode = True


class DietaUpdate(BaseModel):
    nombre: Optional[str] = None
    plan_id: Optional[int] = None
    descripcion: Optional[str] = None
    
    class Config:
        schema_extra = {
            "example" : {
                "nombre" : "cetogenica",
                "plan_id" : 1,
                "descripcion" : "Una dieta SIN carbohidratos, en la que el cuerpo entra en un estado de cetogénesis y pérdida de grasa"
            }
        }