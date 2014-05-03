"use strict";
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
		}
	}else{
		//Carico i dati dell'utente
	}
});

function start_new_location () {
	//Nascondo il messaggio di benvenuto
	$("#welcome").hide();
}

//===============================================================
//======================  LOCALSTORAGE ==========================
//===============================================================

var userKey = {
	"key" : "MMCUserData"
};

/**
	Funzione che controlla che in localStorage, alla chiave
	MMCUserData sono presenti dati
	@return true ci sono dati, false altrimenti
*/
function check_user_local_storage () {
	if (localStorage[userKey.key] !== null) {
		return true;
	}else{
		return false;
	}
}

/**
	Funzione che carica da localstorage i dati salvati dall'utente
	@return Object che contiene i dati.
*/
function load_user_data () {
	var data;
	if (check_user_local_storage()) {
		try{
			data = JSON.parse(localStorage[userKey.key]);
		}catch(ex){
			console.log("Errore nel parsing dei dati utente");
		}
	}

	return data;
}

/**
	Funzione che salva i dati dell'utente in localStorage 
	@data: dati da salvare 
*/
function save_user_data (data) {
	localStorage[userKey.key] = JSON.stringify(data);
}