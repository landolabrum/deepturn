# EzGram/database/accounts/views/account_settings.py
from contextlib import contextmanager

class AccountSettingsView(object):
    def __init__(self, uri, models):
        self.session = uri.session
        self.models = models
    
    @contextmanager
    def session_scope(self):
        """Provide a transactional scope around a series of operations."""
        session = self.session
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()

    def create(self, account_settings_data, as_dict=False):
        with self.session_scope() as session:
            if 'uuids' in account_settings_data:
                uuids_data = account_settings_data.pop('uuids')
                uuids_instance = self.models['uuids'](**uuids_data)
                session.add(uuids_instance)
                session.flush()
                account_settings_data['uuids'] = uuids_instance

            if 'authorization_data' in account_settings_data:
                auth_data = account_settings_data.pop('authorization_data')
                auth_instance = self.models['authorization_data'](**auth_data)
                session.add(auth_instance)
                session.flush()
                account_settings_data['authorization_data'] = auth_instance

            if 'device_settings' in account_settings_data:
                device_data = account_settings_data.pop('device_settings')
                device_instance = self.models['device_settings'](**device_data)
                session.add(device_instance)
                session.flush()
                account_settings_data['device_settings'] = device_instance

            account_settings = self.models['account_settings'](**account_settings_data)
            session.add(account_settings)
            session.flush()
            session.refresh(account_settings)
            if as_dict:
                return account_settings.as_dict
            return account_settings


    def get_by_id(self, account_settings_id):
        with self.session_scope() as session:
            account_settings = session.query(self.models['account_settings']).get(account_settings_id)
            if account_settings:
                return account_settings.as_dict

    def update(self, account_settings_id, updated_account_settings_data):
        with self.session_scope() as session:
            account_settings = session.query(self.models['account_settings']).get(account_settings_id)
            if account_settings:
                for key, value in updated_account_settings_data.items():
                    setattr(account_settings, key, value)
                    
    def delete(self, account_settings_id):
        with self.session_scope() as session:
            account_settings = session.query(self.models['account_settings']).get(account_settings_id)
            if account_settings:
                session.delete(account_settings)
