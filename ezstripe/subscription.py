from .tools import subscription_item_cleaner


class Subscription(object):
    """
    https://stripe.com/docs/api/subscriptions
    """

    def __init__(self, ez):
        self.ez = ez

    def create(self, customer_id=None, price_id=None, payment_method_id=None, trial_period_days=None):
        items = subscription_item_cleaner(price_id)
        context = self.ez.stripe.Subscription.create(
            customer=customer_id,
            items=items,
            trial_period_days=trial_period_days
        )

        return context

    def retrieve(self, subscription_id):
        context = self.ez.stripe.Subscription.retrieve(
            subscription_id,
        )
        return context

    def modify(self, subscription_id, price_id=None, data=None):
        items = subscription_item_cleaner(price_id)
        subscription = self.retrieve(subscription_id)
        for i in subscription:
            if i not in data:
                globals()[i] = subscription[i]
            else:
                globals()[i] = data[i]
        context = self.ez.stripe.Subscription.modify(
            subscription_id,
            cancel_at_period_end=cancel_at_period_end,
            default_payment_method=default_payment_method,
            metadata=metadata,
            items=items,
        )
        return context

    def delete(self, subscription_id, prorate=None):
        context = self.ez.stripe.Subscription.delete(
            subscription_id,
            prorate=prorate
        )
        return context

    def list(self, customer_id=None, price_id=None, status=None, limit=None):
        """
        status=[active, past_due, unpaid, canceled, incomplete, incomplete_expired, trialing, all, ended]
        """
        context = self.ez.stripe.Subscription.list(
            limit=limit,
            customer=customer_id,
            price=price_id,
            status=status
        )
        return context
