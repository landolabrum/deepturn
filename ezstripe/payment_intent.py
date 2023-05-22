from multiprocessing import context

from ezstripe.method import Method


class Payment_intent(object):
    def __init__(self, ez):
        self.ez = ez

    def retrieve(self, id):
        context = self.ez.stripe.PaymentIntent.retrieve(id)
        return context
    
    def create(self, customer=None, amount=None):
        context=self.ez.stripe.PaymentIntent.create(
            customer=customer,
            amount=amount,
            currency="usd",
            )
        return context
    
    def list(self, customer_id):
        context = self.ez.stripe.PaymentIntent.list(customer=customer_id)
        return context

    def modify(self, id, payment_method=None):
        context=self.ez.stripe.PaymentIntent.modify(id, payment_method)
        return context

    def capture(self, id, payment_method=None):
        if payment_method:
            self.ez.stripe.PaymentIntent.confirm(id, payment_method=payment_method)
        self.ez.stripe.PaymentIntent.confirm(id)
        context = self.ez.stripe.PaymentIntent.capture(id)
        return context

    def create_and_capture(self, customer=None, amount=None):
        context={}
        payment_method=self.ez.stripe.PaymentMethod.list(
            customer=customer,
            type="card",
        )['data'][0]['id']
        create=self.ez.stripe.PaymentIntent.create(
            customer=customer,
            amount=amount,
            payment_method=payment_method,
            currency="usd",
            confirm=True,
            automatic_payment_methods={"enabled":True},
            return_url="http://localhost:3000/cart"
            )
        context['create']=create
        # if 'id' in create:
        #     capture=self.ez.stripe.PaymentIntent.capture(create['id'])
        #     context['capture']=capture
        return context