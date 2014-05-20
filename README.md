MyMobiCost
==========
Calcola il costo della vita nella provincia di Belluno

![Alt text](http://s8.postimg.org/7etznz9np/screen.png "Image")

# Backend

###Installazione pip
```bash
  curl https://raw.github.com/pypa/pip/master/contrib/get-pip.py > get-pip.py
```
```bash
  python  get-pip.py
```
###Installazione flask e pg8000 Flask-CORS e Gunicorn

```bash
  pip install Flask
  pip install pg8000
  pip install flask-cors
  pip install gunicorn
```
###Avviare il server 
```
  python run.py
```
####Pagina test
```
http://0.0.0.0:5000/status
```

####Server in produzione
```bash
  gunicorn -c gunicornconfig.py application:app
```

##[API](https://github.com/GnuRant/MyMobiCost/wiki)
