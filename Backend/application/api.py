from flask import jsonify, g, request
from application import app
from database import *

@app.before_request
def before_request():
	if db_status() == True:
		#salvo in g (variabile interna di flask) l'istanza del db per
		#questa connessione
		g.db = db_connection()
	else:
		#in caso di errore salvo un oggetto nullo
		g.db = None

@app.after_request
def after_request(response):
	#controllo che la connessione sia stata creata con successo
   	if g.db is not None:
   		#una volta terminata la richiesta chiudo la connessione con il DB
   		g.db.close()

	return response


@app.route("/status", methods=["GET"])
def status():
	"""
	URL per il test dello stato del sistema.
	Ritorna una JSON contentente le infromazioni sullo
	stato del server e della connessione con il DB
	{
		"server" : "true",
		"database" : "true|false"	
	}
	"""
	data = {
		"server" : True,
		"database" : db_status()
	}

	return jsonify(status=data)

@app.route("/abitazione/comuni", methods=["GET"])
def comuni():
	"""
		URL per ricavare dal DB la lista dei comuni disponibili,
		ritorna un JSON array formattato nel seguente modo
		{"comuni" :[
				{
					"comune" : "BELLUNO"		
				}
			]
		}
	"""
	return jsonify(comuni=get_comuni(g.db))

@app.route("/abitazione/zone/comune=<comune>", methods=["GET"])
def zone(comune):
	"""
		URL per ricevere la lista delle zone di un certo comune,
		ritirna un JSON array formattato nel seguente modo
		{
			"zone" : [
				{
					"zone" : "LANTA",
					"code" : "B1" 
				}
			]
		}
	"""
	return jsonify(zone=get_zone(g.db, comune))

@app.route("/abitazione/tipologie/comune=<comune>&zona=<zona>", methods=["GET"])
def tipologie(comune, zona):
	return jsonify(tipologie=get_tipologie(g.db,comune, zona))