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

@app.route("/store-image", methods = ["POST"])
def store_image():
    image_name = request.form["imageName"]
    image_file = request.files["imageFile"]
    image_size = image_file.seek(0, os.SEEK_END)
    image_file.seek(0, os.SEEK_SET)

    result = minio_client.add_image(file_name = image_name,
                                    image = image_file,
                                    file_size = image_size)


#     TODO: send response object on success or failure, but needs to capture either state
    return {"temporary": "response"}

if __name__ == "__main__":
    app.run(host = os.environ.get("FLASK_HOST"), port = int(os.environ.get("FLASK_PORT")))
