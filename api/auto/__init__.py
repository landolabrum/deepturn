# fastapi-nginx-gunicorn/api/auto/__init__.py


import connectedcar


# class Vehicles:
#     def __init__(self,ez):
#         # print("[ self ]", self)
#         # print("[ ez ]", vars(ez))
#         vehicles = ez.user.vehicles()  # Fetch list of user vehicles
#         self.vehicles = vehicles
#         self.access = ez.access
#         # print(currentVehicle.start())  # Send start command
#         # print(currentVehicle.odometer())  # Send start command
#         # print(currentVehicle.ignition_status())  # Send start command
#         # print(currentVehicle.info())  # Send start command!
    
#         # print(currentVehicle.lock_status())  # Send start command
#         # print(currentVehicle.lock_status())  # Send start command


#     def details(self):
#         context=[]
#         print("[ DETAULS ]", vars(self))
#         access_token = self.access['access_token']
#         for userVehicle in self.vehicles:  # For each user vehicle
#             vehicle = connectedcar.Vehicle(
#                 userVehicle['VIN'], access_token) # Create vehicle object
#             try:
#                 vehicle = vehicle.details()
#             except connectedcar.exceptions.SyncException as e:
#                 print("[ ERROR 1 ]",e)
#             context.append(vehicle)
#         return context
    
class ez_auto:
    def __init__(self):
        self.client = None
        self.user = None
        self.access = None

    def initialize(self, access = None):
        self.client = connectedcar.AuthClient(
            '9fb503e0-715b-47e8-adfd-ad4b7770f73b',
            None,
            None)  # Create client connection

        # print("[VARS   ]", vars(self))
        if not access:
            self.access = self.client.get_user_access_token(
                'lando@deepturn.com', 'Progress123')  # Fetch client access token
        else:
            self.access = access
        self.user = connectedcar.User(self.access['access_token'])  # New User Object
    # @property
    # def vehicles(self):
    #     return Vehicles(self)




    @property
    def vehicles(self):
        context = vars(self)
        vehicles = self.user.vehicles()
        resp = []
        for v in vehicles:
            veh = connectedcar.Vehicle(
                v['VIN'], self.access['access_token']
            )
            print("[ VEH ]", veh)
            try:
                resp.append(veh.status())
            except:
                resp.append(v)
        context['vehicles'] = resp
        return context


