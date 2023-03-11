from dotenv import load_dotenv
from flask import Flask
import os

load_dotenv() #take env variables from .env

app = Flask(__name__)

@app.route("/")
def load_images():
    test_dict = {'dog':'poodle'}
    return test_dict

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT')))





