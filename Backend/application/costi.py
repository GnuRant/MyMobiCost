import datetime

NUMERO_SETTIMANE = 52

def calcolo_abitazione_costi(data):
	#il dato puo' essere quello inserito dall'utente come
	#costo dell'affitto, o quello calcolato come costo m^2*numero_m^2
	return float(data["abitazione"]["cost_med"])

def calcolo_spostamenti_auto_costi(data):
	costo = 0
	try:
		automobili = data["automobili"]
		#itero tu tutte su tutti gli spostamenti, se e' uno spostamento effettuato
		#con l'auto allora calcolo il suo costo, altrimenti non lo considero
		spostamenti = data["spostamenti"]
		for spostamento in spostamenti:
			id_auto = spostamento["id_auto"]
			if id_auto != 0:
				#Controllo che non sia un'abbonamento
				if trova_auto_id(automobili, id_auto) is None:
					#se e' un abbonamento non lo conto
					continue
				elif trova_auto_id(automobili, id_auto) is not None:
					auto = trova_auto_id(automobili, id_auto)
					costo_km = float(auto["costo_km"])
					#calcolo su base mensile
					costo += 4*(2*(float(spostamento["distanza"])*float(spostamento["percorrenze"])*costo_km))
	except Exception, e:
		costo = 0

	return costo

def calcolo_costi_acessori_costo(data):
	#il costo del autostrada e del parceggio assicurazione e costi fissi
	costo = 0
	automobili = data["automobili"]
	for auto in automobili:
		costo += float(auto["abbonamento_parcheggio"])
		costo += float(auto["pedaggio_autostradale"])
		costo += float(auto["assicurazione"])
		costo += float(auto["costo_fisso"])

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
			costo += float(abbonamento["costo"])
		elif abbonamento["tipo"] == "settimanale":
			costo += float(abbonamento["costo"])*4
		elif abbonamento["tipo"] == "semestrale":
			costo += float(abbonamento["costo"])/6
		elif abbonamento["tipo"] == "annuale":
			costo += float(abbonamento["costo"])/12

	return costo

def calcolo_tempo_spostamenti(data):
	spostamenti = data["spostamenti"]
	tempo  = 0
	#prendo tutti gli spostamenti, visto che il tempo e'
	#di solo andata lo mpltiplico per 2
	for spostamento in spostamenti:
		#calcolo in minuti
		tempo += (2*float(spostamento["tempo"])*float(spostamento["percorrenze"]))
	#converto nel formato hh:mm
	return str(datetime.timedelta(minutes=tempo))
	