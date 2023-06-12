import cv2
import numpy as np
from datetime import datetime

# Set the directory to save the images
image_save_dir = "/home/fastapi-user/fastapi-nginx-gunicorn/media"

# Set the motion sensitivity threshold
motion_threshold = 10000  # Adjust this value to set the motion sensitivity

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
# import cv2
# import numpy as np
# from datetime import datetime
# import cv2
# import numpy as np
# from datetime import datetime
# # Set the directory to save the images
# image_save_dir = "/home/fastapi-user/fastapi-nginx-gunicorn/media"


# def generate_frames(rtsp_url):
#     camera = cv2.VideoCapture(rtsp_url, cv2.CAP_FFMPEG)
#     ret, frame = camera.read()
    
#     first_frame = None

#     while True:
#         if not ret:
#             break

#         gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#         gray = cv2.GaussianBlur(gray, (21, 21), 0)
        
#         if first_frame is None:
#             first_frame = gray
#             continue

#         frame_delta = cv2.absdiff(first_frame, gray)
#         thresh_delta = cv2.threshold(frame_delta, 30, 255, cv2.THRESH_BINARY)[1]
#         thresh_delta = cv2.dilate(thresh_delta, None, iterations=0)

#         contours, _ = cv2.findContours(thresh_delta.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

#         for contour in contours:
#             if cv2.contourArea(contour) < 500:
#                 continue

#             # Save image to folder when an object is detected
#             # timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')  # Generate timestamp
#             # image_filename = f"{image_save_dir}/img_{timestamp}.jpg"
#             # cv2.imwrite(image_filename, frame)

#             (x, y, w, h) = cv2.boundingRect(contour)
#             cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

#         ret, buffer = cv2.imencode('.jpg', frame)
#         frame = buffer.tobytes()

#         yield(b'--frame\r\n'
#             b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

#         ret, frame = camera.read()



# # # Load YOLOv3
# # net = cv2.dnn.readNet("yolov3.weights", "yolov3.cfg")

# # # Load COCO dataset classes
# # with open("coco.names", "r") as f:
# #     classes = [line.strip() for line in f.readlines()]

# # # Get the output layer names
# # layer_names = net.getLayerNames()
# # output_layers = [layer_names[i[0] - 1] for i in net.getUnconnectedOutLayers()]

# # # Directory to save the images

# # # Time interval for saving images (in seconds)
# # image_save_interval = 5  # Change this to your preferred interval
# # last_save_time = datetime.now()

# # def generate_frames(rtsp_url):
# #     global last_save_time

# #     camera = cv2.VideoCapture(rtsp_url, cv2.CAP_FFMPEG)
# #     ret, frame = camera.read()

# #     while ret:
# #         height, width, channels = frame.shape

# #         # Detecting objects
# #         blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
# #         net.setInput(blob)
# #         outs = net.forward(output_layers)

# #         for out in outs:
# #             for detection in out:
# #                 scores = detection[5:]
# #                 class_id = np.argmax(scores)
# #                 confidence = scores[class_id]
# #                 if confidence > 0.5:
# #                     # Object detected
# #                     center_x = int(detection[0] * width)
# #                     center_y = int(detection[1] * height)
# #                     w = int(detection[2] * width)
# #                     h = int(detection[3] * height)

# #                     # Rectangle coordinates
# #                     x = int(center_x - w / 2)
# #                     y = int(center_y - h / 2)

# #                     # Label the detected object on the frame
# #                     cv2.putText(frame, classes[class_id], (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (36,255,12), 2)

# #                     # Check for dogs or humans
# #                     if classes[class_id] in ['dog', 'person']:
# #                         now = datetime.now()
# #                         if (now - last_save_time).total_seconds() >= image_save_interval:
# #                             last_save_time = now
# #                             timestamp = now.strftime('%Y%m%d_%H%M%S')  # Generate timestamp
# #                             image_filename = f"{image_save_dir}/img_{classes[class_id]}_{timestamp}.jpg"
# #                             cv2.imwrite(image_filename, frame)

# #                         cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

# #         ret, buffer = cv2.imencode('.jpg', frame)
# #         frame = buffer.tobytes()

# #         yield(b'--frame\r\n'
# #             b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# #         ret, frame = camera.read()
