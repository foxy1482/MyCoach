from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from api.core.config import settings
from api.core.database import get_db
from api.auth.models.usuario import Usuario
from api.auth.models.rol import Rol
from api.core.security import decodificar_token_acceso
from api.auth.schemas.token import TokenData
from api.models.cliente import Cliente

def get_token_data(data: TokenData):
    return data

def get_current_user(data: TokenData = Depends(get_token_data), db: Session = Depends(get_db)):
    payload = decodificar_token_acceso(data.token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado"
        )
    user_id = payload.get("sub")
    user = db.query(Usuario).filter(Usuario.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    return user

def get_current_client(data: TokenData = Depends(get_token_data), db: Session = Depends(get_db)):
    payload = decodificar_token_acceso(data.token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado"
        )
    user_id = payload.get("sub")
    cliente = db.query(Cliente).filter(Cliente.usuario_id == user_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente

def role_required(*allowed_roles: str):
    def role_checker(current_user: Usuario = Depends(get_current_user)):
        if current_user.rol.nombre not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos para acceder a este recurso",
            )
        return current_user

    return role_checker
