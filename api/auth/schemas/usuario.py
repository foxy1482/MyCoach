from pydantic import BaseModel, EmailStr
from typing import Optional

class UsuarioCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UsuarioLogin(BaseModel):
    username: str
    password: str

class UsuarioForgotPWD(BaseModel):
    email: EmailStr

class UsuarioResetPWD(BaseModel):
    token: str
    new_password: str