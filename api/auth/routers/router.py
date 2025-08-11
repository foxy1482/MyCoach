from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from api.auth.schemas import usuario, token
from api.auth.models import usuario as usuarioModel
from api.db.database import SessionLocal
from api.core import security
from api.core.dependencies import get_current_user, role_required
from api.core.database import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.get("/solo-admin")
def endpoint_admin(user=Depends(role_required("admin"))):
    return {"msg": f"Hola {user.nombre}, eres admin"}

@router.get("/solo-clientes")
def endpoint_cliente(user=Depends(role_required("usuario", "admin"))):
    return {"detail" : {"msg": f"Hola {user.nombre}, tienes acceso como cliente"}}

@router.post("/perfil")
def obtener_perfil(current_user = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "rol": current_user.rol
    }

@router.post("/registro", response_model=token.TokenData)
def register(usuario: usuario.UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = db.query(usuarioModel.Usuario).filter(usuarioModel.Usuario.email == usuario.email).first()
    if db_usuario:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    
    hashed_password = security.hashear_password(usuario.password)
    nuevo_usuario = usuarioModel.Usuario(username=usuario.username, email=usuario.email, hashed_password=hashed_password)
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    
    token = security.crear_token_acceso({"sub": str(nuevo_usuario.id)})
    return {"token": token}

@router.post("/login", response_model=token.TokenData)
def login(usuario: usuario.UsuarioLogin, db: Session = Depends(get_db)):
    
    db_usuario = db.query(usuarioModel.Usuario).filter(usuarioModel.Usuario.username == usuario.username).first()
    if not db_usuario or not security.verificar_password(usuario.password, db_usuario.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    
    token = security.crear_token_acceso({"sub": str(db_usuario.id)})
    return {"token": token}