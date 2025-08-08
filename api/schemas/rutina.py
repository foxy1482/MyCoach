from pydantic import BaseModel, Field
from typing import Optional

class RutinaCreate(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=50)
    plan_id: int
    es_personalizada: bool
    
    class Config:
        schema_extra = {
            "example": {
                    "nombre" : "Hipertrofia PPL",
                    "plan_id" : 1,
                    "es_personalizada" : False
                }
        }

class RutinaRead(BaseModel):
    id: int
    nombre: str
    plan_id: int
    es_personalizada: bool
    
    class Config:
        orm_mode = True

class RutinaUpdate(BaseModel):
    nombre: Optional[str] = None
    plan_id: Optional[int] = None
    es_personalizada: Optional[bool] = None
    
    class Config:
        schema_extra = {
            "example": {
                    "nombre" : "Hipertrofia PPL",
                    "plan_id" : 1,
                    "es_personalizada" : False
                }
        }