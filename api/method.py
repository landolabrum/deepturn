from ezstripe import ez_stripe
from dotenv import load_dotenv
env=load_dotenv()
ez=ez_stripe()

def create_method(method):
  context = {}
  # print("[ type(method) ]",type(method))
  # print("[ METHOD ]",method)
  customer_id = str(method.pop('customer_id'))
  
  # print(customer_id)
  # print("[ METHOD END ]",method)
  card= ez.method.create(customer_id=customer_id, card=method)
  return {"card": card}