from pydantic import BaseModel, Field
from typing import Optional

class PlanPeriodoCreate(BaseModel):
    periodo: str = Field(..., min_length=2, max_length=20)
    
    class Config:
        schema_extra = {
            "example" : {
                "periodo" : "Cuatrimestral"
            }
        }

class PlanPeriodoRead(BaseModel):
    id: int
    periodo: str
    
    class Config:
        orm_mode: True

class PlanPeriodoUpdate(BaseModel):
    periodo: Optional[str] = None
    class Config:
        schema_extra = {
            "example" : {
                "periodo" : "Cuatrimestral"
            }
        }