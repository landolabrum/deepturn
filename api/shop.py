import json
from fastapi import FastAPI, HTTPException, Depends, Request
from ezstripe import ez_stripe
from dotenv import load_dotenv
env=load_dotenv()
ez=ez_stripe()


def products():
  context = ez.product.list()
  return context
  
def product(id):
  context = ez.product.retrieve(id=id.id)
  return context