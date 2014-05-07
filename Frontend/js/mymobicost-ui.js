//===============================================================
//==========================  UI ================================
//===============================================================


//===============================================================
//========================= UTILITY =============================
//===============================================================

function toggle_active_menu(element){
  $(".active").toggleClass('active');
  $(element).toggleClass('active');
}

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
  $("#logo").addClass('logo-deactive');
  $("#new-session").addClass('new-session-active');
  load_form_famiglia();
  edit_mode = true;
}

//===============================================================
//====================== form FAMIGLIA ==========================
//===============================================================

$("#menu-famiglia-button").click(function() {
  load_form_famiglia();
});

function load_form_famiglia() {
  toggle_active_menu("#menu-famiglia-button");
  load_partial("partials/famiglia.html", "#form-container", function(){
    form_famiglia();
  });
}

function form_famiglia(){
  //Collego i bottoni +,-
  increment_inpunt_value();
  decrement_input_value();

  //attivo i tooltip
  $('label').tooltip();

  //Carico i dati dell'utente se sono in edit mode
  if (edit_mode) {
    load_famiglia_data();
  };

  $("#famiglia-avanti").click(function() {
    var data = {};
    $.each($('#famiglia-caller').serializeArray(), function (i, el){ 
      data[el.name] = el.value;
    });
    user_new_data.famiglia = data;
    //Carica il prossimo from
    load_form_abitazione();
  });
}

function load_famiglia_data() {
  var famiglia = user_new_data.famiglia;
  //Controllo che i dati siano effettivamente presenti
  if (!$.isEmptyObject(famiglia)) {
    //Se non ho dati vuol dire che sono in fase di aggiunta
    $("input[name=adulti]").val(famiglia.adulti);
    $("input[name=bambini]").val(famiglia.bambini);
  };
}

//===============================================================
//====================== form ABITAZIONE ========================
//===============================================================
var comune = "";
var zona = "";
var categoria = "";
var costo_min = 0;
var costo_max = 0;
var costo = 0;

$("#menu-abitazione-button").click(function() {
  load_form_abitazione("#menu-abitazione-button");
});

function load_form_abitazione (){
  toggle_active_menu("#menu-abitazione-button");
  load_partial("partials/abitazione.html", "#form-container", function (){
    form_abitazione();
  });
}

function form_abitazione (){

  //attivo i tooltip
  $('label').tooltip();

  // selettori belli bellissimi
  $("select").selectpicker({style: 'btn-hg btn-primary', menuStyle: 'dropdown-inverse'});
  $('.switch')['bootstrapSwitch']();

  // toggle visibility of "costo mensile"
  $(function () {
    $('#checkbox-abitazione').change(function () {
       $('#costo-sconosciuto').toggle(!this.checked);
       $('#costo-conosciuto').toggle(this.checked);
    }).change(); //ensure visible state matches initially
  });

  if (edit_mode) {
    load_abitazione_data();
  };

  //Imposto evento per il cabio di valore nel capo input 
  $("input[name=grandezza]").change(function() {
    //Controllo che il valore passato sia un numero
    if (!isNaN($("input[name=grandezza]").val())) {
      set_input_costi();
    };
  });

  //Carico i dati del dropdown dei comuni
  get_comuni(function (data){
    //Chiamata alla api asincrona
    $.each(data, function(i, el) {
      $("select[name=comune]").append("<option>"+el+"</option>");
    });
  }); 

  //Aggiungo ascoltatore per quando l'utente seleziona un valore
  // per il capo comune
  $("select[name=comune]").change(function (){
    comune = $("select[name=comune]").val();
    // prendo il valore dei costi medi di tutte le zone
    get_zone(comune, function (data){
      $.each(data, function(i, el) {
        $("select[name=zona_abitativa]").append("<option value="+el.code+">"+el.zona+"</option>");
      });
    });
    //Carico i costi di quel comune
    get_costi_med_comuni($("select[name=comune]").val(), function (data){
      //Aggiorno i valori nelle varabili globali poi aggiorno i campi
      update_values_costi(data);
      set_input_costi();
    });
    //Re-imposto il valore di default per i from sottostanti
    $("select[name=zona_abitativa]").prop('selectedIndex',0);
    $("select[name=categoria_edilizia]").prop('selectedIndex',0);
  });

  //Dopo aver caricato le zone carico le categorie edilizie ed aggiorno 
  $("select[name=zona_abitativa]").change(function (){
    zona = $("select[name=zona_abitativa]").val();
    get_categoria_edilizia(comune, zona, function (data) {
        $.each(data, function(i, el) {
          $("select[name=categoria_edilizia]").append("<option value="+el.code+">"+el.tipologia+"</option>")
        });
    });
    //Reset dei capi sottostanti
    $("select[name=categoria_edilizia]").prop('selectedIndex',0);
  });

  //Ecento al cambiamento della categoria edilizia
  $("select[name=categoria_edilizia]").change(function() {
    categoria = $("select[name=categoria_edilizia]").val();
    //Aggiorno i costi con i nuovi dati
    get_costi_totali(comune, zona, categoria, function (data){
      update_values_costi(data);
      set_input_costi();
    });
  });

  //Bottone avanti, salvo i dati inseriti dall'utente
  $("#abitazione-avanti").click(function() {
    var data = {};
    $.each($('#abitazione-caller').serializeArray(), function (i, el){ 
      data[el.name] = el.value;
    });
    user_new_data.abitazione = data;
    //Carica il prossimo from
    load_form_trasporti();
  });
}

function update_values_costi (data){
  costo_min = data.cost_min;
  costo_max = data.cost_max;
  costo = data.cost_med;
}

function set_input_costi (){
  var grandezza = $("input[name=grandezza]").val();
  //Imposto i valori moltiplicando per la grandezza
  $("input[name=costo_min]").val((grandezza*costo_min).toFixed(2));
  $("input[name=costo_max]").val((grandezza*costo_max).toFixed(2));
  $("input[name=costo]").val((grandezza*costo).toFixed(2));
}

function load_abitazione_data(){
  var abitazione;
  if(!$.isEmptyObject(user_new_data.abitazione)){
    abitazione = user_new_data.abitazione;
    //Carico i dati utente, se vi è contenuta l'indicazione del comune
    //Carico il form completo altrimenti carico quello parziale
    if (!$.isEmptyObject(abitazione.comune)) {
      //Carico tutti i dati e genero il form completo
    }else{
      //Carico solo il costo inserito dall'utente
    };
  };
}

//===============================================================
//======================= form TRASPORTI ========================
//===============================================================
$("#menu-trasporti-button").click(function() {
  load_form_trasporti();
});

function load_form_trasporti(){
  toggle_active_menu("#menu-trasporti-button");
  load_partial("partials/trasporti.html", "#form-container", function(){
    from_trasporti();
  });
}

function from_trasporti(){

  //attivo i tooltip
  $('label').tooltip();

  // selettori belli bellissimi
  $("select").selectpicker({style: 'btn-hg btn-primary', menuStyle: 'dropdown-inverse'});
  $('.switch')['bootstrapSwitch']();

  // $('btn').click(function(){
  //   console.log("panino");
  // });

  //Tasto che rende visibile il form auto
  $('#bottone-aggiungi-auto').click(function () {
    $('#aggiungi-auto').show();
  });
  //tasto annulla form auto
  $('#cancel-auto').click(function () {
    $('#aggiungi-auto').hide();
    console.log("hello");
  });


  //Tasto che rende visibile il form mezzi pubblici
  $('#bottone-aggiungi-mezzo').click(function () {
    $('#aggiungi-mezzo').show();
  });

}

//===============================================================
//===================== form SPOSTAMENTI ========================
//===============================================================
$("#menu-spostamenti-button").click(function (){
  load_form_spostamenti();
});

function load_form_spostamenti (){
  toggle_active_menu("#menu-spostamenti-button");
  load_partial("partials/spostamenti.html", "#form-container", function(){
    form_spostamenti();
  });
}

function form_spostamenti (){

  //attivo i tooltip
  $('label').tooltip();

}

