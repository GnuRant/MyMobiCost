"use strict";

var user_data = [];
var user_current_data = {};
var edit_mode = false;
var tile_edit_mode = false;
var tile_old_id = ""

$( document ).ready(function (){
	/*
		Controllo se è la prima visita dell'utente o se ci sono
		già i dati salvati in localstorage 
	*/
	if (!check_user_local_storage()) {
		//Se e la prima visita carico il menu di benvenuto,
		//di default nascosto
		$("#welcome").show();
	}else{
        console.log("Carico i dati dell'utente");
		//Carico i dati dell'utente nella variabile globalr
        //$("#welcome").hide();
		user_data = load_user_data();
        $("#welcome").hide();
        //Carico i box già generati
        $.each(user_data, function(i, el) {
        	add_box_risultati(el);
        });
	}
});

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
	if (localStorage[userKey.key] != null && JSON.parse(localStorage["MMCUserData"]).length > 0){
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
