# api_key = 'd662dfecf33f418f8525117cdcf29d61'  # Make sure to replace 'your-api-key' with your actual API key from OpenCage or similar service
import requests
import json
from concurrent.futures import ThreadPoolExecutor

def is_on_land(lat, lon):
    api_key = 'd662dfecf33f418f8525117cdcf29d61' 

    url = f"https://api.opencagedata.com/geocode/v1/json?q={lat}+{lon}&key={api_key}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if data['total_results'] > 0:
            components = data['results'][0]['components']
            return 'road' not in components and 'water' not in components
        else:
            return False
    return False

def check_point(lat, lon):
    print(f"Checking point ({lat}, {lon})")  # Debugging output
    on_land = is_on_land(lat, lon)
    print(f"Point ({lat}, {lon}) is on land: {on_land}")  # Debugging output
    return {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [lon, lat]
        },
        "properties": {
            "isOnLand": on_land
        }
    }


# Setup latitudes and longitudes
lat_lines = 60
lon_lines = 60
lat_step = 170 / (lat_lines - 1)  # Adjusted latitude range from -85 to +85
lon_step = 360 / (lon_lines - 1)

# Prepare the coordinates
coords = [(lat, lon) for lat in (-85 + i * lat_step for i in range(lat_lines))
          for lon in (-180 + j * lon_step for j in range(lon_lines))]

# Use ThreadPoolExecutor to handle requests in parallel
features = []
with ThreadPoolExecutor(max_workers=20) as executor:
    future_to_coords = {executor.submit(check_point, lat, lon): (lat, lon) for lat, lon in coords}
    for future in future_to_coords:
        features.append(future.result())

geojson = {
    "type": "FeatureCollection",
    "features": features
}

with open('grid_points.geojson', 'w') as f:
    json.dump(geojson, f)
