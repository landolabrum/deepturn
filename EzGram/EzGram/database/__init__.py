# EzGram/database/__init__.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .accounts.views import Accounts, AccountSettingsView
from .accounts.models import  get_account_models
Base = declarative_base()

# Ensure that the Account model is known to SQLAlchemy's ORM.
# This will register it with the Base declarative base class.
models = get_account_models(Base)
accounts_model = models['accounts']
account_settings_model = models['account_settings']
uuids_model = models['uuids']
authorization_data_model = models['authorization_data']
device_settings_model = models['device_settings']

class DB(object):
    def __init__(self):
        host = 'localhost'
        port = '5432'
        dbname = 'deepturnS1'
        user = 'deepturn'
        password = 'burrito'

        db_url = f"postgresql://{user}:{password}@{host}:{port}/{dbname}"
        engine = create_engine(db_url)


        # Now when create_all is called, SQLAlchemy knows about the Account model.
        Base.metadata.create_all(engine)
        
        Session = sessionmaker(bind=engine)

        self.session = Session()
        self.engine = engine
        self.base = Base


    @property
    def accounts(self):
        return Accounts(self, models['accounts'])
    @property
    def account_settings(self):
        return AccountSettingsView(self, models)
