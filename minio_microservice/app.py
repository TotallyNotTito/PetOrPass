from dotenv import load_dotenv
import flask, os
from flask import request
from mini_mod.file_storage import FileDumper

# Load env variables from .env
load_dotenv()
minio_config = {
    "endpoint": f"{os.environ.get('MINIO_HOST')}:{os.environ.get('MINIO_PORT')}",
    "secure": False,
    "access_key": os.environ.get("MINIO_ACCESS_KEY"),
    "secret_key": os.environ.get("MINIO_SECRET_KEY"),
    "bucket": os.environ.get("MINIO_BUCKET")
}
minio_client = FileDumper(minio_config)
app = flask.Flask(__name__)

# Route to store image submitted by user into MinIO
@app.route("/store-image", methods = ["POST"])
def store_image():
    image_name = request.form["imageName"]
    image_file = request.files["imageFile"]
    image_size = image_file.seek(0, os.SEEK_END)
    image_file.seek(0, os.SEEK_SET)

    result = minio_client.add_image(file_name = image_name,
                                    image = image_file,
                                    file_size = image_size)
    if result:
        status = 200
        message = "Success"
    else:
        status = 422
        message = "Unprocessable Entity"

    return (message, status)

# Route to retrieve image from MinIO to be displayed in browser
@app.route("/get-image/<image_name>", methods = ["GET"])
def get_image(image_name):
    result = minio_client.retrieve_image(file_name = image_name)
    headers = { "Content-Type": result[0]["Content-Type"] }

    return (result[1], headers)

if __name__ == "__main__":
    app.run(host = os.environ.get("FLASK_HOST"), port = int(os.environ.get("FLASK_PORT")))
