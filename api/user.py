from ezstripe import ez_stripe
ez=ez_stripe()

def user(Authorize):
    Authorize.jwt_required()
    current_user = Authorize.get_jwt_subject()
    return {"user": current_user}


def create_user(user):
    context={}
    signup_props={
        "email": user.email,
        "name": user.name,
        "metadata": {
        "password":user.password
    }
    }
    context['form'] = 'signup'
    context['data'] = ez.customer.create(signup_props)
    return context

def modify_user(user):
    context={}
    context = ez.customer.modify(customer_id=user.customer_id, data=user)
    return context
