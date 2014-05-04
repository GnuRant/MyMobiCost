"use strict";
var API_SERVER_URL = "http://localhost:5000";

function get_comuni () {
	var data_array = [];
	$.ajax({
		url: API_SERVER_URL+"/abitazione/comuni",
		async: false,
		success: function(data) {
				for (var i = data.comuni.length - 1; i >= 0; i--) {
					data_array[i] = data.comuni[i].comune;
				}
			}
		});

	return data_array;
}