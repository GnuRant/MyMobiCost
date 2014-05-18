#Gunicorn configuration file
import multiprocessing

#Imposto ip del server
bind = "0.0.0.0:5000"
#Assegno il numero di processi
workers = multiprocessing.cpu_count() * 2 + 1