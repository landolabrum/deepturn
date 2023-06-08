# EzGram/database/accounts/views/accounts.py

from contextlib import contextmanager
from sqlalchemy.exc import IntegrityError

class Accounts(object):
    def __init__(self, uri, model):
        self.session = uri.session
        self.model = model
        # AccountModel, AccountSettingsModel = get_account_models(db.base)

    @contextmanager
    def session_scope(self):
        session = self.session
        try:
            yield session
        except:
            session.rollback()
            raise
        finally:
            session.close()

    def create(self, account_data, as_dict=False):
        with self.session_scope() as session:
            print("[ ACCOUNT DATA ]", account_data['pk'])
            if account_data['pk']:
                account_data['id'] = account_data.pop("pk")
            account = session.query(self.model).filter_by(id=account_data['id']).first()
            if account is not None:
                if as_dict:
                    return account.as_dict
                return account
            else:
                account = self.model(**account_data)
                try:
                    session.add(account)
                    # Remove this commit. It's done in session_scope
                    session.commit()
                    if as_dict:
                        return account.as_dict
                    return account
                except IntegrityError:
                    session.rollback()
                    raise