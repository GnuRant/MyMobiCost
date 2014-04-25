MyMobiCost
==========
Calcola il costo della vita nella provincia di Belluno

# Backend

###Installazione pip
```bash
  curl https://raw.github.com/pypa/pip/master/contrib/get-pip.py > get-pip.py
```
```bash
  python  get-pip.py
```
###Installazione flask e pg8000
```bash
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
```json
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
```json
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
```json
{
  "tipologie": [
    {
      "tipologia": "Abitazioni civili"
    }
  ]
}
```

###Ottenere il costo di una tipologia edilizia di un zona di un comune 
```
http://nomeserver:5000/abitazione/costi/comune=<comune>&zona=<zona>&tipologia=<tipologia>
```
####Esempio risultato:
```json
{
  "costi": [
    {
      "cost_max": 7.0,
      "cost_med": 5.75,
      "cost_min": 4.5
    }
  ]
}
```
