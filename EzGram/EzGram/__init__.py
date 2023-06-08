# EzGram/__init__.py

import logging
from instagrapi import Client
from EzGram.api import Account


class EzGram:
    def __init__(self, username, password, email, email_password):
        self.username = username
        self.password = password
        self.email = email
        self.email_password = email_password
        self.client = Client()
        self.logger = logging.getLogger()

    @property
    def account(self):
        return Account(self)
