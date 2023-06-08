from fastapi import FastAPI, HTTPException, Depends, Request, Body, Query
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from pydantic import BaseModel
from typing import Dict
from api.auth import authenticate_user, secure
from api.shop import products, product
from api.method import create_method
from api.user import modify_user
from api.huey import ez_hue
from api.stream import generate_frames
from api.auto import ez_auto
from datetime import datetime
import subprocess
import re
import logging
# from starlette.responses import JSONResponse
import socket
import netifaces
#  POSTGRESQL IMPORTS
from db.userAgent.serializers import CreateUserAgent
from db.userAgent.views import create_user_agent_object
from app import app, get_db
from pydantic import BaseModel
from db.session import SessionLocal
from EzGram.login import ezgram_login



curr = datetime.now()


# POSTGRESQL

db = SessionLocal()


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
    user_agent: Dict

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




def create_user_agent_route(user_agent_data: CreateUserAgent, db: Session = Depends(get_db)):
    obj = create_user_agent_object(db, user_agent_data)
    return obj

def get_router_ip():
    try:
        # Execute the 'ip' command to get the default gateway
        ip_output = subprocess.check_output(['ip', 'route', 'show', 'default']).decode()
        gateway_match = re.search(r'default via ([\d.]+)', ip_output)
        if gateway_match:
            gateway_ip = gateway_match.group(1)
            return gateway_ip
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass  # Ignore any error and return None

    return None



def get_local_ip():
    try:
        # Get a list of all network interfaces
        interfaces = netifaces.interfaces()

        # Iterate over the interfaces and find the one with an IPv4 address
        for iface in interfaces:
            ifaddresses = netifaces.ifaddresses(iface)
            if socket.AF_INET in ifaddresses:
                addresses = ifaddresses[socket.AF_INET]
                for address in addresses:
                    if 'addr' in address:
                        local_ip = address['addr']
                        return local_ip
    except netifaces.error:
        pass

    return None 
 
 
# Create a logger instance
logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)

# Create a file handler and set the logging format
file_handler = logging.FileHandler('logs/auth-error.log')
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)

# Add the file handler to the logger
logger.addHandler(file_handler)

@app.post('/authenticate')
def authenticate(user: User, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    try:
        auth = authenticate_user(user, Authorize)
        local = get_local_ip()
        router = get_router_ip()
        user.user_agent['local_ip'] = local if local else str(user.name)
        user.user_agent['router_ip'] = router if router else str(user.email)
        create_user_agent_object(db, user.user_agent)
        return auth
    except Exception as e:
        logger.error("Error occurred during authentication", exc_info=True)
        raise


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


@app.post('/api/social')
def social_instagram_login_route(app: str = Query(...), exe: str = Query(...), credentials: dict = Body()):
    print("[ CREDENTIALS ]", credentials, app, exe)
    return True


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

@app.get("/auto/vehicles")
def autoRoute():
    context = ez_auto().vehicles.details()
    print("[ AUTO ]", context)
    return context