from stripe.error import InvalidRequestError

class Method(object):
    def __init__(self, ez):
        self.ez = ez

    def create(self, customer_id=None, card=None, token=None):
        customer = self.ez.customer.retrieve(customer_id)
        customer["address"]["country"]="US"
        context={}
        billing_details = {
            "address": customer["address"],
            "email": customer["email"],
            "name": customer["name"],
            "phone": customer["phone"],
        }
        if 'object' in card:
            method = card['id']
        else:
            if token == None:
                token = self.ez.stripe.Token.create(
                    card=card
                )['id']
            method = self.ez.stripe.PaymentMethod.create(
                type="card",
                card={
                    "token": token,
                },
                billing_details=billing_details
            )['id']
        context = self.ez.stripe.PaymentMethod.attach(
            method,
            customer=customer_id
        )
        self.ez.customer.modify(
            customer_id=customer_id,
            data={"invoice_settings": {"default_payment_method": method}}
        )
        return context

    def retrieve(self, method_id=None):
        context = {}
        try:
            context = self.ez.stripe.PaymentMethod.retrieve(method_id)
        except InvalidRequestError as e:
            context = e
        return context

    def modify(self, card_id, data=None):
        context = self.ez.stripe.Customer.modify_source(
            data['id'],
            card_id,
            name=data["name"],
            address_city=data['address']['city'],
            address_country=data['address']['country'],
            address_line1=data['address']['line1'],
            address_line2=data['address']['line2'],
            address_zip=data['address']['postal_code'],
            address_state=data['address']['state'],
        )
        return context

    def delete(self, card_id=None):
        context = self.ez.stripe.PaymentMethod.detach(
            card_id
        )
        return context

    def list(self, customer_id=None):
        context = self.ez.stripe.PaymentMethod.list(
            customer=customer_id,
            type="card",
        ).to_dict()['data']
        return context