from flask import Flask, g
from database import *
from config import *

app = Flask(__name__)
"""
Caricamento dei file di configurazione del server,
Utilizzo la configurazione di Development:
	- DEBUG = True
"""
app.config.from_object(DevelopmentConfig)

#Import le route per le API
import application.api