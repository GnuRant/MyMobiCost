import datetime

NUMERO_SETTIMANE = 52

def calcolo_abitazione_costi(data):
	#il dato puo' essere quello inserito dall'utente come
	#costo dell'affitto, o quello calcolato come costo m^2*numero_m^2
	return data["abitazione"]["costo"]

def calcolo_spostamenti_auto_costi(data):
	costo = 0
	automobili = data["automobili"]
	#itero tu tutte su tutti gli spostamenti, se e' uno spostamento effettuato
	#con l'auto allora calcolo il suo costo, altrimenti non lo considero
	spostamenti = data["spostamenti"]
	for spostamento in spostamenti:
		id_auto = spostamento["id_auto"]
		if id_auto != 0:
			auto = trova_auto_id(automobili, id_auto)
			costo_km = auto["costo_km"]
			#calcolo su base annua
			costo += NUMERO_SETTIMANE*(2*(spostamento["distanza"]*spostamento["percorrenze"])*costo_km)

	return costo

def calcolo_costi_acessori_costo(data):
	#il costo del autostrada e del parceggio assicurazione e costi fissi
	costo = 0
	automobili = data["automobili"]
	for auto in automobili:
		costo += auto["abbonamento_parcheggio"]
		costo += auto["pedaggio_autostradale"]
		costo += auto["assicurazione"]
		costo += auto["costo_fisso"]

	return costo


def trova_auto_id(automobili, id):
	""" 
		Data la lista delle auto, ritorna il dizionario per l'auto
		con un determianto indice 
	"""
	for auto in automobili:
		if auto["id_auto"] == id:
			return auto
		else:
			return None

def calcolo_spostamento_mezzi_costi(data):
	costo  = 0
	abbonamenti = data["abbonamenti"]
	#prendo tutti gli abbomanti e calcolo in costo portando il dato in forma mensile
	for abbonamento in abbonamenti:
		if abbonamento["tipo"] == "mensile":
			costo += abbonamento["costo"]*12
		elif abbonamento["tipo"] == "settimanale":
			costo += abbonamento["costo"]*NUMERO_SETTIMANE
		elif abbonamento["tipo"] == "semestrale":
			costo += abbonamento["costo"]*2
		elif abbonamento["tipo"] == "annuale":
			costo += abbonamento["costo"]

	return costo

def calcolo_tempo_spostamenti(data):
	spostamenti = data["spostamenti"]
	tempo  = 0
	#prendo tutti gli spostamenti, visto che il tempo e'
	#di solo andata lo mpltiplico per 2
	for spostamento in spostamenti:
		#calcolo in minuti
		tempo += NUMERO_SETTIMANE*(2*spostamento["tempo"]*spostamento["percorrenze"])
	#converto nel formato hh:mm
	return str(datetime.timedelta(minutes=tempo))










