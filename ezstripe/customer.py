import json
from .tools import customer_cleaner, first_last, Dict2Class

class Customer(object):
    def __init__(self, ez):
        self.ez = ez
        
    def create(self, data):
        all=self.list(email=data['email'])
        # print(f"ALL: {all}")
        # print(f"DATA: {data}")
        if all == '[]' or all == []:
            email, phone, address, description, metadata=customer_cleaner(data)
            context = self.ez.stripe.Customer.create(
                name=data['name'],
                email=email,
                phone=phone,
                address=address,
                description=description,
                metadata=metadata,
            )
        else:
            context=all[0]
        # print(f"STRIPE INFO: {context}")
        return context

    def retrieve(self, customer_id=None, email=None):
        if email == None:
            context = self.ez.stripe.Customer.retrieve(customer_id)
            context['fname'], context['lname'] = first_last(context)
        else:
            context = self.list(email=email)
        return context

    def modify(self, customer_id=None, data={}):
        context={}
        acc = self.ez.stripe.Customer.retrieve(customer_id)
        for key, value in data:
            if key in acc and value != acc[key]:
                acc[key]=value
        print("[ ACC ]", acc)
        context = self.ez.stripe.Customer.modify(
            customer_id,
            name=acc.name,
            address=acc.address,
            balance=acc.balance,
            default_source=acc.default_source,
            description=acc.description,
            discount=acc.discount,
            email=acc.email,
            metadata=acc.metadata,
            phone=acc.phone,
            shipping=acc.shipping,
        )
        return context

    def delete(self, id):
        context = self.ez.stripe.Customer.delete(id)
        return context

    def list(self, limit=None, email=None):
        if email != None:
            context = self.ez.stripe.Customer.list(
                limit=limit, email=email).data
        else:
            context = self.ez.stripe.Customer.list(limit=limit).data
        return context

