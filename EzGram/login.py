

from EzGram import EzGram
from .EzGram.database import DB
db = DB()

# import json
# import os
# from EzGram.tools import DateTimeEncoder

# settings_file = "jacecall.json"
# Instantiate the EzGram object
# ezgram = EzGram("larzrandana", "1Wasatch!", "jacecall@deepturn.com", "Wigwam01!")

# Log in to Instagram


# # Check if the file exists
# if not os.path.exists(settings_file):
#     # with open(settings_file, 'w') as json_file:
#     #     # Write the data to the file
#     #     json.dump(resp, json_file)

#     with open(settings_file, "w") as file:
#         json.dump(login_info, file, cls=DateTimeEncoder)
#         print(f"Created {settings_file}")


# print("[ LOGIN RESPONSE ]", login_info)

def ezgram_login(username=None, password=None, email=None, email_password=None):
    if username != None and password != None:

        ezgram = EzGram("jacecall", "1Wasatch!", "jacecall@deepturn.com", "Wigwam01!")
        account = ezgram.account
        client = account.login()
        if client:
            login_info = account.login_info()
            account = db.accounts.create(login_info['account'], as_dict=True)
            account['account_settings'] = db.account_settings.create(login_info['settings'], as_dict=True)
            ezgram.account.logout()
            return account