from pg8000 import DBAPI
from config import DevelopmentDBConfig as DB
import re

SCHEMA = "SET search_path TO public"

def db_connection():
	"""
		Metodo che crea una vuova connessione con il DB,
		se l'operazione va a buon fine ritorna un oggetto
		connessione altrimenti un oggetto nullo
	"""
	connection = ""
	try:
		connection = DBAPI.connect(
			host 		= DB.HOST,
			user 		= DB.USERNAME,
			password 	= DB.PASSWORD,
			database 	= DB.DATABASE)
	except Exception, e:
		#se la connessione non va a buon fine ritorno un oggetto vuoto
		connection = None

	return connection

def db_status():
	"""
		Metodo che ritorna lo stato del database
	"""
	connection = db_connection()

	if connection is None:
		return False
	else:
		#se la connessione va a buon fine, la chiudo
		connection.close()
		return True

def get_abitazione_comuni(connection):
	"""
		Metodo che ricava dal DB la lista dei comuni disponibili
	"""
	#JSON array contenente la lista dei comuni
	data = []
	query = ("""SELECT DISTINCT comune_descrizione 
			   	FROM qi_92_1_20122_valori""")
	cursor = connection.cursor()
	cursor.execute(SCHEMA)
	cursor.execute(query)

	for row in cursor:
		data.append({"comune" : row[0]})

	return data

def get_abitazione_zone(connection, comune):
	"""
		Metodo che ritorna del DB la lista di tutte le zone per un 
		determinato comune
	"""
	data = []
	query = ("""SELECT qi_92_1_20122_zone.zona_descr, qi_92_1_20122_zone.zona
				FROM qi_92_1_20122_zone
				WHERE qi_92_1_20122_zone.comune_descrizione = %s""")
	cursor = connection.cursor()
	cursor.execute(SCHEMA)
	cursor.execute(query,[comune])

	for row in cursor:
		#splitto ogni stringa in modo da ottenere ogni songola zona
		zone = re.compile("[^\w.\s]").split(row[0])
		#zone = re.split("-|,", row[0])
		for zona in zone:
			#elimino gli spazi bianchi
			zona = zona.lstrip(" ").rstrip(" ")
			data.append({"zona" : zona, "code" : row[1]})

	return data

def get_abitazione_tipologie(connection, comune, zona):
	data = []
	query = ("""SELECT DISTINCT qi_92_1_20122_valori.descr_tipologia, qi_92_1_20122_valori.cod_tip
				FROM qi_92_1_20122_valori
				WHERE qi_92_1_20122_valori.comune_descrizione = %s AND 
				qi_92_1_20122_valori.zona = %s AND
				qi_92_1_20122_valori.cod_tip in ('1', '19', '20', '21', '22') """)
	cursor = connection.cursor()
	cursor.execute(SCHEMA)
	cursor.execute(query, [comune, zona])

	for row in cursor:
		data.append({"tipologia": row[0], "code": row[1]})

	return data

def get_abitazione_costi(connection, comune, zona, tipologia):
	data = []
	query = ""
	if zona is not None and tipologia is not None:
		query = ("""SELECT qi_92_1_20122_valori.loc_min, 
						   qi_92_1_20122_valori.loc_max
					FROM qi_92_1_20122_valori
					WHERE qi_92_1_20122_valori.comune_descrizione = %s AND 
					qi_92_1_20122_valori.zona = %s AND 
					qi_92_1_20122_valori.cod_tip = %s""") 
	else:
		query = ("""SELECT AVG(qi_92_1_20122_valori.loc_min), 
						   AVG(qi_92_1_20122_valori.loc_max)
					FROM qi_92_1_20122_valori
					WHERE qi_92_1_20122_valori.comune_descrizione = %s AND 
						  qi_92_1_20122_valori.cod_tip in ('1', '19', '20', '21', '22')""")

	cursor = connection.cursor()
	cursor.execute(SCHEMA)
	if zona is not None and tipologia is not None:
		cursor.execute(query, [comune, zona, tipologia])
	else:
		cursor.execute(query, [comune])
		
	for row in cursor:
		data.append({"cost_min": row[0], 
					 "cost_max": row[1], 
					 "cost_med": (row[0]+row[1])/2})

	return data

def get_auto_categorie(connection):
	data = []
	query = ("""SELECT DISTINCT costi_auto.cl_auto
				FROM costi_auto """)

	cursor = connection.cursor()
	cursor.execute(SCHEMA)
	cursor.execute(query)

	for row in cursor:
		data.append({"classe" : row[0]})

	return data

def get_auto_alimentazioni(connection, categoria):
	data = []
	query = ("""SELECT DISTINCT costi_auto.alimentazione
				FROM costi_auto
				WHERE costi_auto.cl_auto = %s
				ORDER BY costi_auto.alimentazione ASC""")

	cursor = connection.cursor()
	cursor.execute(SCHEMA)
	cursor.execute(query, [categoria])

	for row in cursor:
		data.append({"alimentazioni" : row[0]})

	return data

def get_auto_costi(connection, categoria, alimentazione):
	data = []
	query = ("""SELECT AVG(costi_auto.km_cost::numeric::float8), 
       				   AVG(costi_auto.fissi_ass::numeric::float8), 
       				   AVG(costi_auto.fissi_altro::numeric::float8) 
				FROM costi_auto
				WHERE costi_auto.cl_auto = %s AND 
				costi_auto.alimentazione = %s """)

	cursor = connection.cursor()
	cursor.execute(SCHEMA)
	cursor.execute(query, [categoria, alimentazione])

	for row in cursor:
		data.append({"costo_km" : row[0],
					 "assicurazione" : row[1],
					 "costo_fisso_altro" : row[2]})

	return data
