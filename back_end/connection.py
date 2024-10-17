import firebase_admin
import pyrebase
from firebase_admin import credentials, db

firebaseConfig = {
    "apiKey": "AIzaSyDBxawxfrBMnQd39GOrCHkSqWUzFGPiPq8",
    "authDomain": "opensphere-62cfa.firebaseapp.com",
    "databaseURL": "https://opensphere-62cfa-default-rtdb.firebaseio.com",
    "projectId": "opensphere-62cfa",
    "storageBucket": "opensphere-62cfa.appspot.com",
    "messagingSenderId": "222953338493",
    "appId": "1:222953338493:web:6d8921dbfa02d12cd3e314",
    "measurementId": "G-WRXTRV0ZKE"
}


def connect():
    try:
        fb = pyrebase.initialize_app(firebaseConfig)
        db = fb.database()
        return db
    except Exception as e:
        return False
