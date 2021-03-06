from flask import jsonify, g, request
from flask.ext.cors import cross_origin
from application import app
from database import *
from costi import *
import json

@app.before_request
def before_request():
	if db_status() == True:
		#salvo in g (variabile interna di flask) l'istanza del db per
		#questa connessione
		g.db = db_connection()
	else:
		#in caso errore salvo un oggetto nullo
		g.db = None
		#ritono la pagina con lo stato del sistema al posto di quella chiamata
		return status()

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
@cross_origin()
def abitazione_comuni():
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
	return jsonify(comuni=get_abitazione_comuni(g.db))

@app.route("/abitazione/zone/comune=<comune>", methods=["GET"])
@cross_origin()
def abitazione_zone(comune):
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
	return jsonify(zone=get_abitazione_zone(g.db, comune))

@app.route("/abitazione/tipologie/comune=<comune>&zona=<zona>", methods=["GET"])
@cross_origin()
def abitazione_tipologie(comune, zona):
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
	return jsonify(tipologie=get_abitazione_tipologie(g.db,comune, zona))

@app.route("/abitazione/costi/comune=<comune>", methods=["GET"])
@app.route("/abitazione/costi/comune=<comune>&zona=<zona>&tipologia=<tipologia>", methods=["GET"])
@cross_origin()
def abitazione_costi(comune, zona = None, tipologia = None):
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
	return jsonify(costi=get_abitazione_costi(g.db, comune, zona, tipologia))

@app.route("/auto/categorie", methods=["GET"])
@cross_origin()
def auto_categorie():
	"""
		URL che restituisce tutte le categorie di autovetture presenti 
		all'interno del DB, restituisce un JSON fromattato nel seguente modo:
		{
  			"categorie": [
    			{
      				"classe": "berlina"
    			}, 
    			{
      				"classe": "utilitaria"
    			}
  			]
		}

	"""
	return jsonify(categorie=get_auto_categorie(g.db))

@app.route("/auto/alimentazione/categoria=<categoria>", methods=["GET"])
@cross_origin()
def auto_alimentazioni(categoria):
	"""
		URL che restituisce data una categoria di auto tutte le alimentazioni 
		diponibili (per quella categoria), la risposta e formatta nel seguente 
		modo:
		{
		  "categorie": [
		    {
		      "alimentazioni": "diesel"
		    },
		    {
		      "alimentazioni": "benzina"
		    }
		  ]
		}

	"""
	return jsonify(categorie=get_auto_alimentazioni(g.db, categoria))

@app.route("/auto/costi/categoria=<categoria>&alimentazione=<alimentazione>")
@cross_origin()
def auto_costi(categoria, alimentazione):
	"""
		URL che restituisce data una categoria ed un alimentazione, tutti i dati
		di costo legati a quel tipo di alimentazione, risposta formattata come segue:
		{
		  "costi": [
		    {
		      "assicurazione": 2554.0,
		      "costo_fisso_altro": 0.125,
		      "costo_km": 0.10500000000000001
		    }
		  ]
		}		
	"""
	return jsonify(costi=get_auto_costi(g.db, categoria, alimentazione))

@app.route("/calcolocosti", methods=["POST"])
@cross_origin(headers=['Content-Type']) # Send Access-Control-Allow-Headers
def calcolo_costi():
	data = request.json
	return_data = {}
	#calcolo e aggiungo i dati al json di ritorno
	return_data["costo_residenza"] = calcolo_abitazione_costi(data)
	#aggiungo il costo legato all'auto
	return_data["costo_auto"] = calcolo_spostamenti_auto_costi(data)
	#aggiungo i costi fissi auto
	return_data["costi_fissi_auto"] = calcolo_costi_acessori_costo(data)
	#aggiungo i costi legati al trasporto pubblico
	return_data["costo_trasporto_pubblico"] = calcolo_spostamento_mezzi_costi(data)	
	#aggiungo il tempo legato a tutti gli spostamenti
	return_data["tempo_speso"] = calcolo_tempo_spostamenti(data)
	data["risultati"] = return_data
	
	return jsonify(**return_data)

