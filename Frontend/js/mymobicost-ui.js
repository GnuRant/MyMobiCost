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

$("#menu-spostamenti").click(function() {
  show_side_menu("#spostamenti");
});

//===============================================================
//========================= UTILITY =============================
//===============================================================

function load_partial(page, container_id, on_complete) {
  $.get(page, function (data){
    $(container_id).html(data).ready(on_complete());
  });
}

function increment_inpunt_value (){
  $(".tagsinput-add").on("click", function(event) {
    var button = $(this);
    var input = button.parent().find('input');
    var old_value = input.val();

    if (old_value == "") {
      old_value = 0;
    };
    //Incremento il valore e salvo
    input.val(++old_value);
  });
}

function decrement_input_value (){
  $(".tagsinput-remove").on("click", function(event) {
    var button = $(this);
    var input = button.parent().find('input');
    var old_value = input.val();

    if (old_value == "") {
      old_value = 0;
    };
    if (--old_value >= 0) {
      //Incremento il valore e salvo
      input.val(old_value);
    };
  });
}

//===============================================================
//======================= NEW SESSION ===========================
//===============================================================
$('#new-session').click(function () {
  new_session();
});

$("#welcome-avanti").click(function() {
  new_session();
});

function new_session (){
  $("#welcome").hide();
  $(".categoria").show();
  load_form_famiglia();
}

//===============================================================
//====================== form FAMIGLIA ==========================
//===============================================================

$("#menu-famiglia-button").click(function() {
  load_form_famiglia();
});

function load_form_famiglia() {
  load_partial("partials/famiglia.html", "#form-container", function(){
    form_famiglia();
  });
}

function form_famiglia(){
  //Collego i bottoni +,-
  increment_inpunt_value();
  decrement_input_value();

  $("#famiglia-avanti").click(function() {
    var data = {};
    $.each($('#famiglia-caller').serializeArray(), function (i, el){ 
      data[el.name] = el.value;
    });
    user_new_data.famiglia = data;
  });
}

//===============================================================
//====================== form ABITAZIONE ========================
//===============================================================
$("#menu-abitazione-button").click(function() {
  load_form_abitazione();
});

function load_form_abitazione (){

  load_partial("partials/abitazione.html", "#form-container", function (){
    form_abitazione();
  });
}

function form_abitazione (){

  $("select").selectpicker({style: 'btn-hg btn-primary', menuStyle: 'dropdown-inverse'});
  $("button.dropdown-toggle").css({
      'background':'#404040'
  });

  $('#checkbox-abitazione').change(function () {
    $('#costo-sconosciuto').fadeToggle();
    $('#costo-conosciuto').fadeToggle();
  });

}








