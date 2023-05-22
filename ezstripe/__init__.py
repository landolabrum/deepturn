import os
import stripe
from dotenv import load_dotenv
from .product import Product
from .price import Price
from .customer import Customer
from .method import Method
from .session import Session
from .invoice import Invoice
from .subscription import Subscription
from .payment_intent import Payment_intent
from .charge import Charge

load_dotenv()

class ez_stripe(object):
    def __init__(self):
    # def __init__(self, STRIPE_SECRET_KEY):
        stripe.api_key = os.getenv("STRIPE_SECRET_KEY") 
        self.stripe = stripe
        self.outer_var = 1

    @property
    def price(self):
        return Price(self)

    @property
    def product(self):
        return Product(self)

    @property
    def customer(self):
        return Customer(self) 

    @property
    def method(self):
        return Method(self)

    @property
    def session(self):
        return Session(self)

    @property
    def invoice(self):
        return Invoice(self)

    @property
    def subscription(self):
        return Subscription(self)

    @property
    def payment_intent(self):
        return Payment_intent(self)

    @property
    def charge(self):
        return Charge(self)
