from flask import jsonify, g
from application import app
from database import *

@app.before_request
def before_request():
	if db_status == True:
		#salvo in g (variabile interna di flask) l'istanza del db per
		#questa connessione
		g.db = db_connection()
	else:
		g.db = None

@app.after_request
def after_request(response):
   	if g.db is not None:
   		#una volta terminata la la richiesta chiudo la connessione con il DB
   		g.db.close()

	return response


@app.route("/status")
def status():
	"""
	URL per il test dello stato del sistema.
	Ritorna una JSON contentente le infromazioni sullo
	stato del server e della connessione con il DB
	{
		"server" : "OK",
		"database" : "true|false"	
	}
	"""
	data = {
		"server" : "OK",
		"database" : db_status()
	}

	return jsonify(status=data)

	