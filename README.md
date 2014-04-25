MyMobiCost
==========
Calcola il costo della vita nella provincia di Belluno

# Backend

###Installazione pip
```
  curl https://raw.github.com/pypa/pip/master/contrib/get-pip.py > get-pip.py
```
```
  python  get-pip.py
```
###Installazione flask e pg8000
```
  pip install Flask
  pip install pg8000
```
###Avviare il server 
```
  python run.py
```
####Pagina test
```
http://0.0.0.0:5000/status
```

# API

###Ottenere la lista dei comuni disponibili
```
http://nomeserver.it:5000/abitazione/comuni
```
####Esempio risultato:
```
{
  "comuni": [
    {
      "comune": "BELLUNO"
    }
  ]
}
```

###Ottenere la lista delle zone abitative dato un comune
```
http://nomeserver.it:5000/abitazione/zone/comune=<comune>
```
####Esempio risultato:
```
{
  "zone": [
    {
      "zone": "LANTA",
      "code": "B1"
    }
  ]
}
```

###Ottenere le tipologie abitative dato comune e zona 
```
http://nomeserver.it:5000/abitazione/tipologie/comune=<comune>&zona=<zona>
```
####Esempio risultato:
```
{
  "tipologie": [
    {
      "tipologia": "Abitazioni civili"
    }
  ]
}
```
