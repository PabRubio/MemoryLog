import firebase_admin
from django.apps import AppConfig
from firebase_admin import credentials

class ServerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'server'

    def ready(self):
        if not firebase_admin._apps:
            cred = credentials.Certificate("firebase-admin-sdk.json")
            firebase_admin.initialize_app(cred)