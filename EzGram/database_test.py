from EzGram.database import DB
import json

# Specify the path to your JSON file
json_file_path = "./login_info_to_db.json"

# Open the JSON file for reading
with open(json_file_path, 'r') as json_file:
    # Parse the JSON data
    data = json.load(json_file)

# for i in data:
#     print(i)
# print()
db = DB()

account = db.accounts.create(data['account'], as_dict=True)
print("[ ACCOUNTT ]", account)
settings = db.account_settings.create(data['settings'], as_dict=True)

print("[ ACCOUNT SETTINGS ]", settings)


# account_data = {
#     "pk": "60246154215",
#     "username": "jacecall",
#     "full_name": "jace call",
#     "is_private": False,
#     "profile_pic_url": "https://instagram.fcor2-2.fna.fbcdn.net/v/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg?_nc_ht=instagram.fcor2-2.fna.fbcdn.net&_nc_cat=1&_nc_ohc=loOU4_KH9KgAX9W7FYM&edm=AEVnrqQBAAAA&ccb=7-5&ig_cache_key=YW5vbnltb3VzX3Byb2ZpbGVfcGlj.2-ccb7-5&oh=00_AfCO3_XHCP-90zEKu-MNXAckTRON184L_Y1gf6gZHaVoog&oe=6483DC8F&_nc_sid=f13204",
#     "is_verified": False,
#     "biography": "",
#     "external_url": None,
#     "is_business": False,
#     "birthday": "1992-06-05",
#     "phone_number": "",
#     "gender": 3,
#     "email": "jacecall@deepturn.com",
#     "password": "1Wasatch!"
# }
# settings_data = {
#     "uuids": {
#         "phone_id": "008077e5-a53d-4a5b-894d-79cfaf2c979c",
#         "uuid": "4bc35708-c127-4f9f-bdc9-2f9958d9f4d7",
#         "client_session_id": "913a8812-7650-4c93-914b-93961d11e4a5",
#         "advertising_id": "f6494e37-aa37-4b71-8593-0320368c1bc4",
#         "android_device_id": "android-077ebcc8b73a0a70",
#         "request_id": "80be1dea-989d-4f10-a676-f884285f5824",
#         "tray_session_id": "16680c7f-0748-4050-8e16-13c9f6c92762"
#     },
#     "mid": "ZH4-hAABAAHlNgNRMe6Qbya6eMUO",
#     "ig_u_rur": None,
#     "ig_www_claim": None,
#     "authorization_data": {
#         "ds_user_id": "60246154215",
#         "sessionid": "60246154215%3Ac7dhgcF4ssWEz7%3A26%3AAYc27OGvo67gljlilsNXOgSOzN6VdAaJ5wYJjHXPRw"
#     },
#     "cookies": {},
#     "last_login": 1685995149.5498939,
#     "device_settings": {
#         "app_version": "269.0.0.18.75",
#         "android_version": 26,
#         "android_release": "8.0.0",
#         "dpi": "480dpi",
#         "resolution": "1080x1920",
#         "manufacturer": "OnePlus",
#         "device": "devitron",
#         "model": "6T Dev",
#         "cpu": "qcom",
#         "version_code": "314665256"
#     },
#     "user_agent": "Instagram 269.0.0.18.75 Android (26/8.0.0; 480dpi; 1080x1920; OnePlus; 6T Dev; devitron; qcom; en_US; 314665256)",
#     "country": "US",
#     "country_code": 1,
#     "locale": "en_US",
#     "timezone_offset": -14400,
# }