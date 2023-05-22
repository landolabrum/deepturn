

class Charge(object):
    """
    https://stripe.com/docs/api/charges/
    """

    def __init__(self, ez):
        self.ez = ez

    def retrieve(self, charge_id):
        context = self.ez.stripe.Charge.retrieve(
            charge_id,
        )
        return context

    def create(self, customer=None, amount=None, source=None, description=None):
       context = self.ez.stripe.Charge.create(
            customer=customer,
            amount=amount,
            currency="usd",
            source=source,
            description=description,
        )

    def list(self, limit=None, customer_id=None):
        context = self.ez.stripe.Charge.list(
            limit=limit,
            customer=customer_id
        )['data']
        return context
