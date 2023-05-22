class Payment_link(object):
    def __init__(self, ez):
        self.ez = ez

    def create(self, line_items):
        context = self.ez.stripe.PaymentLink.create(line_items)
        return context

    def retrieve(self, id):
        context = self.ez.stripe.PaymentLink.retrieve(id)
        return context
