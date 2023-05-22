class Price(object):
    def __init__(self, ez):
        self.ez = ez

    def retrieve(self, id):
        context = self.ez.stripe.Price.retrieve(id)
        return context

    def delete(self, id):
        context = self.ez.stripe.Price.modify(id, active=False)
        return context

    def list(self, limit=None, active=None, product=None):
        prices=self.ez.stripe.Price.list(limit=limit, active=active, product=product)
        for i in prices:
            i['display']=i['unit_amount_decimal'][:2]+"."+i['unit_amount_decimal'][-2:]
            # print(i['display'])
        context = prices
        return context
    
    def create(self, d):
        context=self.ez.stripe.Price.create(
            unit_amount=d['unit_amount'],
            currency="usd",
            recurring=d['recurring'],
            product=d['product'],
        )
        return context

    def modify(self, id, d):
        context=self.ez.stripe.Price.modify(
            id,
            active=d['active'],
            recurring=d['recurring'],
        )
        # print(f"MOD_PRICE_CONTEXT: {context}")
        return context

    def search(self):
        price_list=self.ez.stripe.Price.list()
        # for i in price_list:
            # print(f"search: {i['nickname']}")
        print(f"search43")
        return price_list