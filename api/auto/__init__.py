import connectedcar


class Vehicles(object):
    def __init__(self,ez):
        # print("[ self ]", self)
        # print("[ ez ]", vars(ez))
        vehicles = ez.user.vehicles()  # Fetch list of user vehicles
        self.vehicles = vehicles
        self.access = ez.access
        # print(currentVehicle.start())  # Send start command
        # print(currentVehicle.odometer())  # Send start command
        # print(currentVehicle.ignition_status())  # Send start command
        # print(currentVehicle.info())  # Send start command!
    
        # print(currentVehicle.lock_status())  # Send start command
        # print(currentVehicle.lock_status())  # Send start command


    def details(self):
        context=[]
        for userVehicle in self.vehicles:  # For each user vehicle
            vehicle = connectedcar.Vehicle(
                userVehicle['VIN'], self.access['access_token'])  # Create vehicle object
            #   print(vehicle.details())  # Print vehicle details in json format
            context.append(vehicle)
        return context
    
class ez_auto(object):
    def __init__(self):
        client = connectedcar.AuthClient(
            '9fb503e0-715b-47e8-adfd-ad4b7770f73b',
            None,
            None)  # Create client connection
        self.client = client
        access = client.get_user_access_token(
        'lando@deepturn.com', 'Progress123')  # Fetch client access token
        self.user = connectedcar.User(access['access_token'])  # New User Object
        self.access = access
    @property
    def vehicles(self):
       return Vehicles(self)






