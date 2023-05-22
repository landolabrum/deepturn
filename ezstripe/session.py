from stripe.error import InvalidRequestError


class Session(object):
    def __init__(self, ez):
        self.ez = ez

    def create(self, customer_id=None, mode="setup", line_items=None, success_url="https://example.com/success", cancel_url="https://example.com/cancel"):
        """
        mode: ("payment", "setup", "subscription"),
           line_items=[
            {
            "price": price_id,
            "quantity": quantity,
            },
        ]
        """
        print(f"CANCEL: {cancel_url}")
        context = self.ez.stripe.checkout.Session.create(
            success_url=success_url,
            cancel_url=cancel_url,
            payment_method_types=["card"],
            customer=customer_id,
            line_items=line_items,
            mode=mode,
        )
        return context

    def expire(self, session_id=None):
        context = self.ez.stripe.checkout.Session.expire(session_id)
        return context

    def retrieve(self, session_id=None):
        context = self.ez.stripe.checkout.Session.retrieve(session_id)
        return context

    def list_line_items(self, session_id=None):
        context = self.ez.stripe.checkout.Session.list_line_items(session_id, limit=5)
        return context
