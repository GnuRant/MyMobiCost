from flask import jsonify
from application import app
from database import *

"""
	URL per il test dello stato del sistema.
	Ritorna una JSON contentente le infromazioni sullo
	stato del server e della connessione con il DB
	{
		"server" : "OK",
		"database" : "OK|Connection error"	
	}
"""
@app.route("/status")
def status():
	data = {
		"server" : "OK",
		"database" : db_status()
	}

	return jsonify(status=data)

	