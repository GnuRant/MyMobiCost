$(document).ready(function(){
	/*
		Constrollo se è la prima visita dell'utente o se ci sono
		già i dati salvati in localstorage 
	*/
	if (!check_user_local_storage()) {
		//Se e la prima visita carico il menu di benvenuto,
		//di default nascosto
		if ($("#welcome").css("display") == "none") {
			$("#welcome").show();
		};
	}else{
		//Carico i dati dell'utente
	}
});

/**
	Funzione che controlla che in localStorage, alla chiave
	MMCUserData sono presenti dati
	@return true ci sono dati, false altrimenti
*/
function check_user_local_storage () {
	if (localStorage["MMCUserData"] != null) {
		return true;
	}else{
		return false;
	}
}

function load_user_data () {
	var data;
	if (check_user_local_storage()) {
		try{
			data = JSON.parse(localStorage["MMCUserData"]);
		}catch(ex){
			console.log("Errore nel parsing dei dati utente");
		}
	};

	return data;
}

function save_user_data (data) {
	localStorage["MMCUserData"] = JSON.stringify(data);
}