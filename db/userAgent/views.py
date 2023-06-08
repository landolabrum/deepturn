import json
from sqlalchemy.exc import IntegrityError
from .models import UserAgent, Brand

def create_user_agent_object(db, object_data):
    user_agent_data = object_data['user_agent_data']
    serialized_user_agent_data = json.dumps(user_agent_data)  # Serialize the user_agent_data

    ua = UserAgent(
        id=f"v1-{object_data['public_ip']}-{object_data['user_agent']}",
        user_agent=object_data['user_agent'],
        user_agent_data=serialized_user_agent_data,
        public_ip=object_data['public_ip'],
        local_ip=object_data['local_ip'],
        router_ip=object_data['router_ip']
    )

    if user_agent_data is not None:
        for brand_data in user_agent_data.get('brands', []):
            brand = db.query(Brand).filter(
                Brand.brand == brand_data.get('brand'),
                Brand.version == brand_data.get('version')
            ).first()

            if brand:
                ua.brands.append(brand)

    existing_ua = db.query(UserAgent).filter(UserAgent.id == ua.id).first()
    if existing_ua:
        return existing_ua

    db.add(ua)
    try:
        db.commit()
        db.refresh(ua)
        return ua
    except IntegrityError:
        db.rollback()
        raise ValueError("The combination of public IP and user agent must be unique.")
