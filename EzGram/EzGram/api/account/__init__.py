# EzGram/api/account/__init__.py

import email
import imaplib
import re
import random
from instagrapi.mixins.challenge import ChallengeChoice
from instagrapi.exceptions import LoginRequired
from EzGram.api.account.get_account import GetAccount
class Account:
    def __init__(self, uri):
        self.client = uri.client
        self.username = uri.username
        self.password = uri.password
        self.email = uri.email
        self.email_password = uri.email_password
        self.logger = uri.logger

    @staticmethod
    def change_password_handler():
        # Simple way to generate a random string
        chars = list("abcdefghijklmnopqrstuvwxyz1234567890!&£@#")
        password = "".join(random.sample(chars, 10))
        return password


    def login_info(self):
        return GetAccount.login_info(self)

    

    def get_code_from_email(self):
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(self.email, self.email_password)
        mail.select("inbox")
        result, data = mail.search(None, "(UNSEEN)")
        assert result == "OK", "Error1 during get_code_from_email: %s" % result
        ids = data.pop().split()
        for num in reversed(ids):
            mail.store(num, "+FLAGS", "\\Seen")  # mark as read
            result, data = mail.fetch(num, "(RFC822)")
            assert result == "OK", "Error2 during get_code_from_email: %s" % result
            msg = email.message_from_string(data[0][1].decode())
            payloads = msg.get_payload()
            if not isinstance(payloads, list):
                payloads = [msg]
            code = None
            for payload in payloads:
                body = payload.get_payload(decode=True).decode()
                if "<div" not in body:
                    continue
                match = re.search(">([^>]*?({u})[^<]*?)<".format(u=self.username), body)
                if not match:
                    continue
                self.logger.info("Match from email:", match.group(1))
                match = re.search(r">(\d{6})<", body)
                if not match:
                    self.logger.info('Skip this email, "code" not found')
                    continue
                code = match.group(1)
                if code:
                    return code
        return False

    def get_code_from_sms(self):
        while True:
            code = input(f"Enter code (6 digits) for {self.username}: ").strip()
            if code and code.isdigit():
                return code
            return None

    def challenge_code_handler(self, choice):
        if choice == ChallengeChoice.SMS:
            return self.get_code_from_sms()
        elif choice == ChallengeChoice.EMAIL:
            return self.get_code_from_email()
        return False

    def login(self):
        session = False
        self.client.challenge_code_handler = self.challenge_code_handler
        self.client.change_password_handler = self.change_password_handler
        try:
            session = self.client.load_settings(f"{self.username}.json")
        except: 
            None
     
        login_via_session = False
        login_via_pw = False
        if session:
            try:
                # self.client.set_proxy("http://<api_key>:wifi;ca;;;toronto@proxy.soax.com:9137")
                self.client.set_settings(session)
                login_info=self.client.login(self.username, self.password)
                print("[ LOGIN INFO ]", login_info)
                # check if session is valid
                try:
                    self.client.get_timeline_feed()
                except LoginRequired:
                    self.logger.info("Session is invalid, need to login via username and password")

                    old_session = self.client.get_settings()
                    # use the same device uuids across logins
                    self.client.set_settings({})
                    self.client.set_uuids(old_session["uuids"])
                    self.client.login(self.username, self.password)
                login_via_session = True
            except Exception as e:
                self.logger.info("Couldn't login user using session information: %s" % e)
       
        if not login_via_session:
        
            try:
                self.logger.info("Attempting to login via username and password. username: %s" % self.username)
                if self.client.login(self.username, self.password):
                    login_via_pw = True
            except Exception as e:
                self.logger.info("Couldn't login user using username and password: %s" % e)

        if not login_via_pw and not login_via_session:
            raise Exception("Couldn't login user with either password or session")
        print("[ LOGIN ]", {
            'self':vars(self),
            'session':session,
            'login_via_session':login_via_session,
            'login_via_pw':login_via_pw
        })
        return self.client




    def logout(self):
        self.client.logout()
        self.client = None











# import json
# import email
# import imaplib
# import re
# import random
# from instagrapi.mixins.challenge import ChallengeChoice
# from instagrapi.exceptions import LoginRequired

# class Account:
#     def __init__(self, client):
#         self.username = client.username
#         self.password = client.password
#         self.email = client.email
#         self.email_password = client.email_password
#         self.client = client
#         self.logger = client.logger


#     @staticmethod
#     def change_password_handler():
#         # Simple way to generate a random string
#         chars = list("abcdefghijklmnopqrstuvwxyz1234567890!&£@#")
#         password = "".join(random.sample(chars, 10))
#         return password
    



#     def challenge_code_handler(self, choice):
#         if choice == ChallengeChoice.SMS:
#             return self.get_code_from_sms()
#         elif choice == ChallengeChoice.EMAIL:
#             return self.get_code_from_email()
#         return False

#     def get_code_from_sms(self):
#         while True:
#             code = input(f"Enter code (6 digits) for {self.username}: ").strip()
#             if code and code.isdigit():
#                 return code
#             return None

 
    

