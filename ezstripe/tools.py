

def customer_cleaner(data):
    email = None
    phone = None
    address = None
    description = None
    metadata = None
    if "email" in data:
        email = data["email"]
    if "phone" in data:
        phone = data["phone"]
    if "address" in data:
        address = data["address"]
    if "description" in data:
        description = data["description"]
    if "metadata" in data:
        metadata = data["metadata"]
    return email, phone, address, description, metadata


def product_cleaner(d):
    recurring = None
    metadata = None
    active = False
    if "active" in d:
        if d['active'] == 'on':
            d['active'] = True
        active = d['active']
    if "recurring" in d:
        if d["recurring"] == 'on':
            d["recurring"] = True
        if d['recurring']:
            recurring = {
                "interval": "month",
                "interval_count": 1,
                "usage_type": "licensed"
            }
        else:
            recurring = None

    if "metadata" in d:
        metadata = d['metadata']
    return recurring, metadata, active


def invoice_cleaner(data):
    auto_advance = None
    if "auto_advance" in data:
        auto_advance = data["auto_advance"]
    collection_method = None
    if "collection_method" in data:
        collection_method = data["collection_method"]
    description = None
    if "description" in data:
        description = data["description"]
    metadata = None
    if "metadata" in data:
        metadata = data["metadata"]
    subscription = None
    if "subscription" in data:
        subscription = data["subscription"]
    return auto_advance, collection_method, description, metadata, subscription


def subscription_item_cleaner(price_id):
    if isinstance(price_id, list):
        items = []
        for i in price_id:
            items.append({"price": i})
    else:
        items = [{"price": price_id}]
    return items


def first_last(data):
    ez_name = data['name'].split(" ")
    return ez_name[0], ez_name[1]


class DictObj:
    def __init__(self, in_dict:dict):
        assert isinstance(in_dict, dict)
        for key, val in in_dict.items():
            if isinstance(val, (list, tuple)):
                setattr(self, key, [DictObj(x) if isinstance(x, dict) else x for x in val])
            else:
                setattr(self, key, DictObj(val) if isinstance(val, dict) else val)


# Turns a dictionary into a class
class Dict2Class(object):
    def __init__(self, my_dict):
        for key in my_dict:
            setattr(self, key, my_dict[key])