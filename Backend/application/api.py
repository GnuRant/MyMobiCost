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
	"""
		URL per rivecere la lista delle tipologie edeilizie di uno specifico
		comune di una specifica zona, ritorna yn JSON array formattato nel
		sequente modo
		{
			"tipologie"	: [
    				{
      					"code": "20", 
      					"tipologia": "Abitazioni civili"
    				}
    		]
    	}

	"""
	return jsonify(tipologie=get_tipologie(g.db,comune, zona))

@app.route("/abitazione/costi/comune=<comune>", methods=["GET"])
@app.route("/abitazione/costi/comune=<comune>&zona=<zona>&tipologia=<tipologia>", methods=["GET"])
def costi(comune, zona = None, tipologia = None):
	"""
		URL per ricevere i costi minimi, massimo, medi di una categoria edilizia
		in una certa zona in un certo comune, restituisce un JSON formattato nel 
		seguente modo
		{
 			"costi": [
    			{
     			 "cost_max": 7.0, 
      			 "cost_med": 5.75, 
      			 "cost_min": 4.5
    			}
  			]
		}
	"""
	return jsonify(costi=get_costi(g.db, comune, zona, tipologia))


