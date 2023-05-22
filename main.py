from fastapi import FastAPI, HTTPException, Depends, Request, Body, Response
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from pydantic import BaseModel
from typing import Dict
from api.auth import authenticate, secure
from api.shop import products, product
from api.method import create_method
from api.user import modify_user
from api.huey import ez_hue
from api.stream import generate_frames
from datetime import datetime
from db.models import *
from app import app, sessionmaker, engine

#  POSTGRESQL IMPORTS
from pydantic import BaseModel
from db.session import SessionLocal
#  POSTGRESQL IMPORTS


curr = datetime.now()


# POSTGRESQL

db = SessionLocal()

def get_all_user_agents():
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # Query the database using the UserAgent SQLAlchemy model
        user_agents = session.query(UserAgent).all()

        # Convert SQLAlchemy instances to Pydantic models for the response
        user_agents_pydantic = [UserAgent(brands=[Brand(brand=brand.brand, version=brand.version) for brand in user_agent.brands], mobile=user_agent.mobile, platform=user_agent.platform, ip_addr=user_agent.ip_addr) for user_agent in user_agents]
        
        return user_agents_pydantic
    finally:
        session.close()

@app.get("/user-agents", response_model=List[UserAgentOut])
async def get_user_agents():
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    db_user_agents = get_all_user_agents()  # should return a list of SQLAlchemy models

    # Convert SQLAlchemy models to Pydantic models
    user_agents = [UserAgentOut(
        id=db_user_agent.id,
        mobile=db_user_agent.mobile,
        platform=db_user_agent.platform,
        brands=[BrandOut(
            id=db_brand.id,
            brand=db_brand.brand,
            version=db_brand.version,
        ) for db_brand in db_user_agent.brands]
    ) for db_user_agent in db_user_agents]

    return user_agents

@app.post("/user-agent", response_model=ResponseModel)
async def process_user_agent(user_agent: UserAgentIn):
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    db_brands = []
    for brand in user_agent.brands:
        # Create a new brand instance
        db_brand = Brand(**brand.dict())
        db.add(db_brand)
        db_brands.append(db_brand)
    db.commit()
    for db_brand in db_brands:
        db.refresh(db_brand)

    # Create a new user agent instance
    db_user_agent = UserAgent(
        mobile=user_agent.mobile,
        platform=user_agent.platform,
        ip_addr=user_agent.ip_addr,
        brands=db_brands,
    )
    db.add(db_user_agent)
    db.commit()
    db.refresh(db_user_agent)

    # Construct the response
    response = ResponseModel(
        message="User agent data processed successfully",
        data=UserAgentOut(
            id=db_user_agent.id,
            mobile=db_user_agent.mobile,
            platform=db_user_agent.platform,
            ip_addr=db_user_agent.ip_addr,
            brands=[BrandOut(
                id=db_brand.id,
                brand=db_brand.brand,
                version=db_brand.version,
            ) for db_brand in db_user_agent.brands]
        )
    )

    return response



class ModUser(BaseModel):
    name: str | None = None
    email: str
    phone: str | None = None
    customer_id: str | None = None
    address: Dict

class User(BaseModel):
    email: str
    name: str | None = None
    password: str | None = None
    customer_id: str | None = None

class ProductId(BaseModel):
    id: str

class Method(BaseModel):
    customer_id: str
    number:str
    expiry: str
    cvc: str
class Light(BaseModel):
    id:str
    state:str

class Settings(BaseModel):
    authjwt_secret_key: str = "secret"

@AuthJWT.load_config
def get_config():
    return Settings()

@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )



@app.get("/", tags=["Root"])
async def read_root():
    return {"title": f"Deepturn {curr.strftime('%Y-%m-%d %H:%M:%S')}"}

@app.post('/authenticate')
def _authenticate(user: User, Authorize: AuthJWT = Depends()):
    auth = authenticate(user, Authorize)
    # print(dict(auth))
    return auth
 
@app.get('/user')
def _user(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    current_user = Authorize.get_jwt_subject()
    # print("[ CURR USER] ", current_user)
    return {"user": current_user}


@app.get('/products')
def _products():
    return products()

@app.post('/product')
def _product(id:  ProductId):
    # print(id.json())
    return product(id)


@app.post('/create-method')
def _create_method(method: dict = Body()):
    return create_method(method)

def get_modify_user(user: ModUser):
    return user

def get_current_user(user: User):
    return user

@app.get('/secure')
def _secure(Authorize: AuthJWT = Depends()):
    is_secure=secure(Authorize)
    # print("[ IS SEC ]", is_secure)
    return is_secure

@app.post('/user/modify')
def _userMod(user: str = Depends(get_modify_user), Authorize: AuthJWT = Depends()):
    return modify_user(user)


@app.get("/hue/all-on")
def _allon():
    ez_hue().all_on()
    return _lights()

@app.get("/hue/all-off")
def _alloff():
    ez_hue().all_off()
    return _lights()

@app.get("/hue/lights")
def _lights():
    return ez_hue().lights()

@app.post("/hue/light")
def _light(light: dict = Body()):
    print("[ LIGHT ]", light)
    lit= ez_hue().light(light)
    return lit
    # return True


@app.get("/stream/{camera_id}")
async def video_feed(camera_id: str):
    rtsp_url = ""
    if camera_id == "cam-1":
        rtsp_url = "rtsp://192.168.86.28:554/snl/live/1/1"
    elif camera_id == "cam-2":
        rtsp_url = "rtsp://admin:1Wasatch!@192.168.86.27:554/cam/realmonitor?channel=1&subtype=0"
    else:
        return JSONResponse({"error": "Invalid camera ID"})

    return StreamingResponse(generate_frames(rtsp_url), media_type="multipart/x-mixed-replace;boundary=frame")



@app.post("/authentication/sign-in/")
def sign_in(credentials: dict = Body()):
    # print("CREDENTIALS ] ", credentials)
    return True 


