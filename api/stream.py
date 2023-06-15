import cv2
import numpy as np
from datetime import datetime

# Set the directory to save the images
image_save_dir = "/home/fastapi-user/fastapi-nginx-gunicorn/media"

# Set the motion sensitivity threshold
motion_threshold = 8000  # Adjust this value to set the motion sensitivity

def generate_frames(rtsp_url):
    camera = cv2.VideoCapture(rtsp_url, cv2.CAP_FFMPEG)
    ret, frame = camera.read()

    first_frame = None

    while True:
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (21, 21), 0)

        if first_frame is None:
            first_frame = gray
            continue

        frame_delta = cv2.absdiff(first_frame, gray)
        thresh_delta = cv2.threshold(frame_delta, 30, 255, cv2.THRESH_BINARY)[1]
        thresh_delta = cv2.dilate(thresh_delta, None, iterations=0)

        contours, _ = cv2.findContours(thresh_delta.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        for contour in contours:
            if cv2.contourArea(contour) < motion_threshold:
                continue

            # Save image to folder when an object is detected
            # timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')  # Generate timestamp
            # image_filename = f"{image_save_dir}/img_{timestamp}.jpg"
            # cv2.imwrite(image_filename, frame)

            (x, y, w, h) = cv2.boundingRect(contour)
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield(b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

        ret, frame = camera.read()
