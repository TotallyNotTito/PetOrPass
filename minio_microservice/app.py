from dotenv import load_dotenv
import flask, os
from flask import request
# from mini_mod.file_storage import FileDumper, S3Error

# TODO: is this going to be an issue with dockerfile env vars?
# Load env variables from .env
load_dotenv()
# client = FileDumper(bucket='pet-images')

app = flask.Flask(__name__)

@app.route("/store-image", methods=["POST"])
def store_image():
    image_name = request.form["imageName"]
    image_file = request.files["imageFile"]
    image_file.save(image_name)



#     TODO: send response object on success or failure, but needs to capture either state
    return {"temporary": "response"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT")))
