"use strict";
//Iserire ip del server di riferimento
var API_SERVER_URL = "http://localhost:5000";

//===============================================================
//========================= AJAX ================================
//===============================================================

$.ajaxSetup({
	cache: false
});

function get_comuni (on_complete) {
	var data_array = [];
	$.ajax({
		url: API_SERVER_URL+"/abitazione/comuni",
		async: true,
		type: "GET",
		success: function(data) {
				for (var i = data.comuni.length - 1; i >= 0; i--) {
					data_array[i] = data.comuni[i].comune;
				}
				on_complete(data_array);
			}
		});
}

function get_costi_med_comuni (comune, on_complete) {
	var data_object = {};
	$.ajax({
		url: API_SERVER_URL+"/abitazione/costi/comune="+comune,
		async: true,
		type: "GET",
		success: function(data) {
			data_object = data.costi[0];
			on_complete(data_object);
		}
	});
}

function get_zone(comune, on_complete) {
	var data_array = [];
	$.ajax({
		url: API_SERVER_URL+"/abitazione/zone/comune="+comune,
		async: true,
		type: "GET",
		success : function (data){
				data_array = data.zone;
				on_complete(data_array);
			}
	});
}

function get_categoria_edilizia(comune, zona, on_complete) {
	var data_array = [];
	$.ajax({
		url: API_SERVER_URL + "/abitazione/tipologie/comune="+comune+"&zona="+zona,
		async: true,
		type: "GET",
		success : function (data){
			data_array = data.tipologie;
			on_complete(data_array);
		}
	});
}

function get_costi_totali(comune, zona, categoria, on_complete) {
	var data_array = [];
	$.ajax({
		url: API_SERVER_URL+"/abitazione/costi/comune="+comune+"&zona="+zona+"&tipologia="+categoria,
		async: true,
		type: "GET",
		success : function (data){
			data_array = data.costi[0];
			on_complete (data_array);
		}
	});
}

function get_auto_categorie(on_complete) {
	var data_array = [];
	$.ajax({
		url: API_SERVER_URL+"/auto/categorie",
		async: true,
		type: "GET",
		success : function (data){
			for (var i = data.categorie.length - 1; i >= 0; i--) {
				data_array[i] = data.categorie[i].classe;
			};
			on_complete (data_array);
		}
	});
}

function get_auto_alimentazione(categoria, on_complete) {
	var data_array = [];
	$.ajax({
		url: API_SERVER_URL+"/auto/alimentazione/categoria="+categoria,
		async: true,
		type: 'GET',
		success : function (data) {
			for (var i = data.categorie.length - 1; i >= 0; i--) {
				data_array[i] = data.categorie[i].alimentazioni;
			};
			on_complete(data_array);
		}
	});
}


function get_auto_costi(categoria, alimentazione, on_complete){
	var data_object = [];
	$.ajax({
		url: API_SERVER_URL+"/auto/costi/categoria="+categoria+"&alimentazione="+alimentazione,
		async: true,
		type: "GET",
		success: function (data) {
			data_object = data.costi[0];
			on_complete (data_object);
		}
	});
}

function get_results_from_user_data(user_data, on_complete){
	var data_object = {};
	$.ajax({
		url: API_SERVER_URL+"/calcolocosti",
		type: "POST",
		contentType: 'application/json',
      	data: JSON.stringify(user_data),
      	dataType: "json",
      	async: true,
      	success: function (data) {
      		on_complete(data);
      	}
	});
}








