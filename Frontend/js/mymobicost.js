//appunti: cose di tia
obj = {}
$.each($('#bla').serializeArray(), function (i, el){
  obj[el.name] = el.value;
})


"use strict";

var user_data;
var user_new_data = {};

$(document).ready(function(){

	//===============================================================
	//==========================  UI ================================
	//===============================================================

	// rende i select meravigliosi colorati e hipster
	$("select").selectpicker({style: 'btn-hg btn-primary', menuStyle: 'dropdown-inverse'});
  	$("button.dropdown-toggle").css({
  	    'background':'#404040'
  	});
	
  	// switch costo abitazione (conosciuto o no)
  	$('#checkbox-abitazione').change(function () {
  	  $('#costo-sconosciuto').fadeToggle();
  	  $('#costo-conosciuto').fadeToggle();
  	});
	
  	//aggiungi nuova auto
  	$('#bottone-aggiungi-auto').click(function () {
  	  $('#aggiungi-auto').fadeToggle();
  	});
  	//aggiungi nuovo mezzo
  	$('#bottone-aggiungi-mezzo').click(function () {
  	  $('#aggiungi-mezzo').fadeToggle();
  	});

  	$("#menu-trasporti").click(function() {
  		show_side_menu("#trasporti");
  	});

  	$("#menu-abitazione").click(function() {
  		show_side_menu("#abitazione");
  	});

  	$("#menu-famiglia").click(function() {
  		show_side_menu("#famiglia");
  	});

  	$("#menu-spostamenti").click(function() {
  		show_side_menu("#spostamenti");
  	});

	/*
		Controllo se è la prima visita dell'utente o se ci sono
		già i dati salvati in localstorage 
	*/
	if (!check_user_local_storage()) {
		//Se e la prima visita carico il menu di benvenuto,
		//di default nascosto
		if ($("#welcome").css("display") === "none") {
			$("#welcome").show();
		}
	}else{
		//Carico i dati dell'utente nella variabile globalr
		user_data = load_user_data();
	}
});

function start_new_location () {
	//Nascondo il messaggio di benvenuto
	$("#welcome").hide();
}

function show_side_menu(id_categorie){
	//Nascondo tutti i from
	$(".form").css({"left" : "-600px"});
	//Mostro solo il menu indicato
	$(id_categorie+"-form").css({"left":"0px"});
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