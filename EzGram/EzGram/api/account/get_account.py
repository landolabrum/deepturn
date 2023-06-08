class GetAccount:
    def __init__(self, uri):
        self.client = uri.client
        self.username = uri.username
        self.password = uri.password

    def login_info(self):
        account = self.client.account_info().__dict__
        account['password']=self.password
      
        return {
            "settings": self.client.get_settings(),
            "news_inbox_v1": self.client.news_inbox_v1(),
            "direct_threads": self.client.direct_threads(), 
              # Updated
            "account": account
        }