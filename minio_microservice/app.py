from dotenv import load_dotenv
from backend.minio.file_storage import FileDumper
from flask import Flask
from flask import request, redirect
import os

load_dotenv() #take env variables from .env

app = Flask(__name__)

@app.route("/")
def load_images():
    test_dict = {'dog':'poodle'}
    return test_dict

@app.route("/SubmitPetForm")
def add_image():
    client = FileDumper('tito','cute.jpg','file/path/cute.jpg','pet-images')
    client.add_image()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT')))





