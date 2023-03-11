from dotenv import load_dotenv
from flask import Flask
import os

load_dotenv() #take env variables from .env

port = os.environ.get('TEST_ENV') if os.environ.get('TEST_ENV') else None


