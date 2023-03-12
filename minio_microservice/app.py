from dotenv import load_dotenv
from mini_mod.file_storage import FileDumper, S3Error
from flask import Flask
from flask import request, redirect
import os

load_dotenv() #take env variables from .env
client = FileDumper(bucket='pet-images')

app = Flask(__name__)

@app.route("/SubmitPetForm")
def add_image():
    try:
        client.add_image()
    except S3Error as err:
        print(f'Error: {err}')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT')))





