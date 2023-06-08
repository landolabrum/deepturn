from fastapi import  HTTPException
from ezstripe import ez_stripe
from dotenv import load_dotenv
from .user import create_user
import time


import jwt
secret_key = "mysecretkey"
env=load_dotenv()
ez=ez_stripe()



def authenticate_user(user, Authorize):
  context={}
  if not user.name:
    response = ez.customer.retrieve(email=user.email)
    if response == []:
      raise HTTPException(status_code=401,detail="No Account or invalid")
    customer = response[0]
    if customer.metadata.password != user.password:
      raise HTTPException(status_code=403,detail="invalid password")
    access_token = Authorize.create_access_token(subject=user.email)
    # REMOVE PW
    customer.metadata.password=None
    # exp now + 1 hour
    customer.exp = int(time.time() + 3600)
    context['user']=customer
    context['form'] = 'login'
    context['access_token'] = access_token
    context = jwt.encode(context, secret_key, algorithm="HS256")
  else:
    context=create_user(user)
  return context


def secure(Authorize):
  Authorize.jwt_required()
  current_user = Authorize.get_jwt_subject()
  print("[ CURR USER] ", current_user)
  return True