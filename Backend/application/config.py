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
	HOST = "0.0.0.0"
	PORT = "5001"
		
