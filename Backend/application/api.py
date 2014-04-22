from application import app

@app.route("/status")
def status():
	return "OK"