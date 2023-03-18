from dotenv import load_dotenv
from flask, os
# from mini_mod.file_storage import FileDumper, S3Error

# TODO: is this going to be an issue with dockerfile env vars?
# Load env variables from .env
load_dotenv()
# client = FileDumper(bucket='pet-images')

app = Flask(__name__)

@app.route("/store-image", methods=["POST"])
def store_image():


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT')))





