from fastapi import FastAPI, Request, Response
import cv2
import numpy as np

app = FastAPI()

def generate_frames(rtsp_url):
    camera = cv2.VideoCapture(rtsp_url, cv2.CAP_FFMPEG)
    ret, frame = camera.read()
    
    # Initialize the first frame for comparison
    first_frame = None

    while True:
        if not ret:
            break

        # Convert the frame color to gray
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Blur the gray frame a bit, which helps in frame difference.
        gray = cv2.GaussianBlur(gray, (21, 21), 0)
        
        # Store first image/frame of video for reference
        if first_frame is None:
            first_frame = gray
            continue

        # Calculate frame difference
        frame_delta = cv2.absdiff(first_frame, gray)

        # Define a threshold for delta image- 
        # less than 30 changes will be ignored (you can change this value according to your needs)
        thresh_delta = cv2.threshold(frame_delta, 30, 255, cv2.THRESH_BINARY)[1]

        # Apply image dilation to accentuate the changes
        thresh_delta = cv2.dilate(thresh_delta, None, iterations=0)
        
        # Define contour of moving object
        contours, _ = cv2.findContours(thresh_delta.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        for contour in contours:
            # Ignore the small changes (you can change this value according to your needs)
            if cv2.contourArea(contour) < 500:
                continue

            # Create a bounding box around the moving object
            (x, y, w, h) = cv2.boundingRect(contour)
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield(b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

        ret, frame = camera.read()

# from fastapi import FastAPI, Request, Response
# import cv2
# import numpy as np


# def generate_frames(rtsp_url):
#     camera=cv2.VideoCapture(rtsp_url, cv2.CAP_FFMPEG)
#     while True:
#         success,frame=camera.read()
#         if not success:
#             break
#         else:
#             ret,buffer=cv2.imencode('.jpg',frame)
#             frame=buffer.tobytes()

#         yield(b'--frame\r\n'
#                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')