"""
	File di configurazione base, contiene i settaggi
	del server flask comuni a tutte le configurazioni
"""
class Config(object):
	DEBUG = False
	TESTING = False

"""
	ATTENZIONE: NON UTILIZZARE IN PRODUZIONE
	File di configurazione utilizzato in sviluppo
"""
class DevelopmentConfig(Config):
	DEBUG = True

"""
	ATTENZIONE: NON UTILIZZARE IN PRODUZIONE
	CLasse per la gestione dei dati di configurazione 
	del database in fase di sviluppo
"""
class DevelopmentDBConfig(object):
	HOST = "localhost"
	USERNAME = "test"
	PASSWORD = "1234"
	DATABASE = "MyMobiCost"


	
