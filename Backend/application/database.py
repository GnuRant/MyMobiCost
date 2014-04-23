from pg8000 import DBAPI
from config import DevelopmentDBConfig as DB

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
	if db_connection() is None:
		return "Connection error"
	else:
		return "OK"