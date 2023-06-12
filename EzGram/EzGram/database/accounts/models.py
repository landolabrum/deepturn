
# EzGram/database/ig_accounts/models.py

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, Integer, String, Boolean, JSON, Float, ForeignKey
from sqlalchemy.orm import relationship


def get_account_models(Base):
    class AccountModel(Base):
        __tablename__ = 'ig_accounts'
        id = Column(String, primary_key=True, unique=True)
        username = Column(String)
        full_name = Column(String)
        is_private = Column(Boolean)
        profile_pic_url = Column(String)
        is_verified = Column(Boolean)
        biography = Column(String)
        external_url = Column(String)
        is_business = Column(Boolean)
        birthday = Column(String)
        phone_number = Column(String)
        gender = Column(Integer)
        email = Column(String)
        password = Column(String)
        ig_account_settings = relationship(
            'AccountSettingsModel', uselist=False, back_populates='account')

        @property
        def as_dict(self):
            return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    class UuidsModel(Base):
        __tablename__ = 'uuids'

        id = Column(Integer, primary_key=True)
        phone_id = Column(String)
        uuid = Column(String)
        client_session_id = Column(String)
        advertising_id = Column(String)
        android_device_id = Column(String)
        request_id = Column(String)
        tray_session_id = Column(String)
        # add other fields...
        account_settings_id = Column(
            Integer, ForeignKey('ig_account_settings.id'))
        ig_account_settings = relationship(
            'AccountSettingsModel', back_populates='uuids')

    class AuthorizationDataModel(Base):
        __tablename__ = 'authorization_data'

        id = Column(Integer, primary_key=True)
        ds_user_id = Column(String)
        sessionid = Column(String)
        # add other fields...
        account_settings_id = Column(
            Integer, ForeignKey('ig_account_settings.id'))
        ig_account_settings = relationship(
            'AccountSettingsModel', back_populates='authorization_data')

    class DeviceSettingsModel(Base):
        __tablename__ = 'device_settings'

        id = Column(Integer, primary_key=True)
        app_version = Column(String)
        android_version = Column(Integer)
        android_release = Column(String)
        dpi = Column(String)
        resolution = Column(String)
        manufacturer = Column(String)
        device = Column(String)
        model = Column(String)
        cpu = Column(String)
        version_code = Column(String)
        # add other fields...
        account_settings_id = Column(
            Integer, ForeignKey('ig_account_settings.id'))
        ig_account_settings = relationship(
            'AccountSettingsModel', back_populates='device_settings')

    class AccountSettingsModel(Base):
        __tablename__ = 'ig_account_settings'

        id = Column(Integer, primary_key=True)
        mid = Column(String)
        ig_u_rur = Column(String)
        ig_www_claim = Column(String)
        cookies = Column(JSON)
        last_login = Column(Integer)
        user_agent = Column(String)
        country = Column(String(3))
        country_code = Column(Integer)
        locale = Column(String(6))
        timezone_offset = Column(Integer)
        # add other fields...

        uuids = relationship('UuidsModel', uselist=False,
                             back_populates='ig_account_settings')
        authorization_data = relationship(
            'AuthorizationDataModel', uselist=False, back_populates='ig_account_settings')
        device_settings = relationship(
            'DeviceSettingsModel', uselist=False, back_populates='ig_account_settings')

        account = relationship('AccountModel', uselist=False,
                               back_populates='ig_account_settings')
        # Assuming 'Account' is the class name for Account model
        account_id = Column(String, ForeignKey(AccountModel.id))

        @property
        def as_dict(self):
            return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    return {
        'accounts': AccountModel,
        'account_settings': AccountSettingsModel,
        'uuids': UuidsModel,
        'authorization_data': AuthorizationDataModel,
        'device_settings': DeviceSettingsModel,
    }
