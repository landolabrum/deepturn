from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
import cv2
import numpy as np
from datetime import datetime
import torch
from torchvision.models.detection import fasterrcnn_resnet50_fpn, FasterRCNN_ResNet50_FPN_Weights
from torchvision.transforms import functional as F

app = FastAPI()

# Set the directory to save the images
image_save_dir = "/home/fastapi-user/fastapi-nginx-gunicorn/media"

# Load a model weights on COCO
model = fasterrcnn_resnet50_fpn(weights=FasterRCNN_ResNet50_FPN_Weights.DEFAULT)
model.eval()

# Time interval for saving images (in seconds)
image_save_interval = 60 * 60   # Change this to your preferred interval
last_save_time = datetime.now()

@app.get("/stream/{camera_id}")
async def video_feed(camera_id: str):
    rtsp_url=""
    if camera_id == "cam-1":
        rtsp_url = "rtsp://192.168.86.28:554/snl/live/1/1"
    elif camera_id == "cam-2":
        rtsp_url = "rtsp://admin:1Wasatch!@192.168.86.27:554/cam/realmonitor?channel=1&subtype=0"
    else:
        return JSONResponse({"error": "Invalid camera ID"})

    return StreamingResponse(generate_frames(rtsp_url), media_type="multipart/x-mixed-replace;boundary=frame")

def generate_frames(rtsp_url):
    global last_save_time

    camera = cv2.VideoCapture(rtsp_url, cv2.CAP_FFMPEG)
    if not camera.isOpened():
        print("Unable to open video source")
        return

    while True:
        ret, frame = camera.read()

        if not ret:
            print("Can't receive frame (stream end?). Exiting ...")
            break

        # Transform frame for model
        tensor_frame = F.to_tensor(frame).unsqueeze(0)

        # Make prediction
        with torch.no_grad():
            try:
                prediction = model(tensor_frame)
            except Exception as e:
                print(f"Error making prediction: {e}")
                continue

        for p in prediction:
            # Check for high confidence predictions
            if p['scores'][0] > 0.5:
                # Get bounding box coordinates
                x1, y1, x2, y2 = map(int, p['boxes'][0])

                # Check for dogs or humans (labels 17 and 18 in COCO dataset)
                if p['labels'][0] in [17, 18]:
                    now = datetime.now()
                    if (now - last_save_time).total_seconds() >= image_save_interval:
                        last_save_time = now
                        timestamp = now.strftime('%Y%m%d_%H%M%S')  # Generate timestamp
                        label = 'dog' if p['labels'][0] == 17 else 'person'
                        image_filename = f"{image_save_dir}/img_{label}_{timestamp}.jpg"
                        cv2.imwrite(image_filename, frame)

                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')  # concat frame one by one and show result

    camera.release()
    cv2.destroyAllWindows()