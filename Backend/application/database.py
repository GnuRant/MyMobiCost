from pg8000 import DBAPI
import re
from config import DevelopmentDBConfig as DB

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

def get_comuni(connection):
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

def get_zone(connection, comune):
	"""
		Metodo che ritorna del DB la lista di tutte le zone per un 
		determinato comune
	"""
	data = []
	query = ("""SELECT DISTINCT qi_92_1_20122_zone.zona_descr
				FROM qi_92_1_20122_zone
				WHERE qi_92_1_20122_zone.comune_descrizione = %s""") % ('\''+comune+'\'')
	cursor = connection.cursor()
	cursor.execute(SCHEMA)
	cursor.execute(query)

	for row in cursor:
		#splitto ogni stringa in modo da ottenere ogni songola zona
		zone = re.split("-|,", row[0])
		for zona in zone:
			data.append({"zona" : zona})

	return data



