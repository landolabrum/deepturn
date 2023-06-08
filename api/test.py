import os
file_path="/home/fastapi-user/fastapi-nginx-gunicorn/api/yolov3.weights"

# Check if file exists
if os.path.isfile(file_path):
    print("File exists.")
else:
    print("File does not exist.")