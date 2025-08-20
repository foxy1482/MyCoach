from pydantic import BaseModel, Field
from typing import Optional


class ClienteCreate(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100 )
    apellido: str = Field(..., min_length=2, max_length=100 )
    edad: int = Field(..., ge=13, le=120)
    sexo: str = Field(..., max_length=2)
    usuario_id: int
    
    class Config:
        schema_extra = {
            "example" : {
                "nombre" : "Juan",
                "apellido" : "Pérez",
                "edad" : 27,
                "sexo" : "M"
            }
        }

class ClienteRead(BaseModel):
    id: int
    nombre: str
    apellido: str
    edad: int
    sexo: str
    usuario_id: int = None
    
    class Config:
        orm_mode = True

class ClienteUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=2, max_length=100)
    apellido: Optional[str] = Field(None, min_length=2, max_length=100)
    edad: Optional[int] = Field(None, ge=13, le=120)
    sexo: Optional[str] = Field(None, max_length=1)

    class Config:
        schema_extra = {
            "example": {
                "nombre": "Carlos",
                "apellido": "Gómez",
                "edad": 35,
                "sexo": "M"
            }
        }