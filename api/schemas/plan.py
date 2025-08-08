from pydantic import BaseModel, Field
from typing import Optional

class PlanCreate(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=20)
    precio: int
    periodo_id: int
    
    class Config:
        schema_extra = {
            "example" : {
                "nombre" : "Inicial",
                "precio" : 100,
                "periodo_id" : 2
            }
        }

class PlanRead(BaseModel):
    id: int
    nombre: str
    precio: int
    periodo_id: int
    
    class Config:
        orm_mode = True

class PlanUpdate(BaseModel):
    nombre: Optional[str] = None
    precio: Optional[int] = None
    periodo_id: Optional[int] = None
    
    class Config:
        schema_extra = {
            "example" : {
                "nombre" : "Inicial",
                "precio" : 100,
                "periodo_id" : 2
            }
        }