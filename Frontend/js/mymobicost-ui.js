//===============================================================
//==========================  UI ================================
//===============================================================


//===============================================================
//========================= UTILITY =============================
//===============================================================
"use strict";

function toggle_active_menu(element){
  $(".active").toggleClass("active");
  $(element).toggleClass("active");
}

function load_partial(page, container_id, on_complete) {
  $.get(page, function (data){
    $(container_id).html(data).ready(on_complete());
  });
}

function increment_inpunt_value (){
  $(".tagsinput-add").on("click", function(event) {
    var button = $(this);
    var input = button.parent().find("input");
    var old_value = input.val();

    if (old_value === "") {
      old_value = 0;
    }
    //Incremento il valore e salvo
    input.val(++old_value);
    //non funzionante
    $(".form-campi").data("bootstrapValidator").validate();
  });
}

function decrement_input_value (){
  $(".tagsinput-remove").on("click", function(event) {
    var button = $(this);
    var input = button.parent().find("input");
    var old_value = input.val();

    if (old_value === "") {
      old_value = 0;
    }
    if (--old_value >= 0) {
      //Incremento il valore e salvo
      input.val(old_value);
    }
    //non funzionante
    $(".form-campi").data("bootstrapValidator").validate();
  });
}

function generete_id() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

//Funzione per resettare il form auto
function reset_form(id_element){
  //Prendo tutti gli input e resetto il risultato
  $(id_element)[0].reset();
  //Imposto i dropdown al valore di default
  reset_drop_down("select");
}

function reset_drop_down (id_element){
  $(id_element).val(0).change();
}

function reset_drop_down_hard (id_element){
  $(id_element)
    .find("option")
    .remove()
    .end()
    .append("<option value=\"0\" disabled selected>seleziona un\'opzione</option>")
    .val("whatever");
}

function open_form_sidebar(){
  $("#moreco-caption").html("indietro");
  $("#moreco-caption").addClass("indietro")
  $(".categoria").show();
  $("#logo").addClass("logo-deactive");
  $("#new-session").addClass("new-session-active");
  $("#form-container").addClass( "form-container-open" );
  $("#content-pusher").addClass( "pusher-open" );
  $(".overlay").show();
  $(".overlay").css("opacity", "0.7");

  //Carico anche il primo form
  load_form_famiglia();
}

function close_form_sidebar(){
  $("#moreco-caption").html("moreco");
  $("#moreco-caption").removeClass("indietro")
  $(".categoria").hide();
  $("#logo").removeClass("logo-deactive");
  $("#new-session").removeClass("new-session-active"); 
  $("#form-container").removeClass( "form-container-open" );
  $("#content-pusher").removeClass( "pusher-open" );
  $(".overlay").css("opacity", "0");
  $(".overlay").hide();
}

function ellipse_string(str){
  var length = 42;
  if (str.length > length) {
    return str.substring(0,length) + "...";
  }else{
    return str;
  }
}

//===============================================================
//======================= NEW SESSION ===========================
//===============================================================
$("#new-session").click(function () {
  new_session();
});

$("#welcome-avanti").click(function() {
  new_session();
});

$("#logo").click(function() {
  //Se il campo form è aperto lo chiudo
  close_form_sidebar();
  user_current_data = {};
});

function new_session (){
  $("#welcome").hide();
  open_form_sidebar();
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
  //validator
  $('.form-campi').bootstrapValidator({
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    }
  });

  //Collego i bottoni +,-
  increment_inpunt_value();
  decrement_input_value();

  //attivo i tooltip
  $("label").tooltip();

  //Carico i dati dell'utente se sono in edit mode
  load_famiglia_data();

  $("#famiglia-avanti").click(function() {
    //Lacio la validazione dei campi
    $(".form-campi").data("bootstrapValidator").validate();
    //Se la validazione è andata a buon fine abilito il passaggio al prossimo
    //Form
    if($(".form-campi").data("bootstrapValidator").isValid()){
      var data = {};
      $.each($("#famiglia-caller").serializeArray(), function (i, el){ 
        data[el.name] = el.value;
      });
      user_current_data.famiglia = data;
      //Carica il prossimo form
      load_form_abitazione();
    }else{
      //Messaggio d'errore per l'utente
    }
  });
}

function load_famiglia_data() {
  var famiglia = user_current_data.famiglia;
  //Controllo che i dati siano effettivamente presenti
  if (!$.isEmptyObject(famiglia)) {
    //Se non ho dati vuol dire che sono in fase di aggiunta
    $("input[name=adulti]").val(famiglia.adulti);
    $("input[name=bambini]").val(famiglia.bambini);
  }
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
  //validator
  $('.form-campi').bootstrapValidator({
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    }
  });

  //attivo i tooltip
  $("label").tooltip();

  // selettori belli bellissimi
  $("select").selectpicker({style: "btn-hg btn-primary", menuStyle: "dropdown-inverse"});
  $(".switch")["bootstrapSwitch"]();

  // toggle visibility of "costo mensile"
  $(function () {
    $("#checkbox-abitazione").change(function () {
       $("#costo-sconosciuto").toggle(!this.checked);
       $("#costo-conosciuto").toggle(this.checked);
    }).change(); //ensure visible state matches initially
  });

  load_abitazione_data();

  //Imposto evento per il cabio di valore nel capo input 
  $("input[name=grandezza]").change(function() {
    //Controllo che il valore passato sia un numero
    if (!isNaN($("input[name=grandezza]").val())) {
      set_input_costi();
    }
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
    });
    //Re-imposto il valore di default per i form sottostanti
    reset_drop_down_hard("select[name=zona_abitativa]");
    reset_drop_down_hard("select[name=categoria_edilizia]");
  });

  //Dopo aver caricato le zone carico le categorie edilizie ed aggiorno 
  $("select[name=zona_abitativa]").change(function (){
    zona = $("select[name=zona_abitativa]").val();
    get_categoria_edilizia(comune, zona, function (data) {
        $.each(data, function(i, el) {
          $("select[name=categoria_edilizia]").append("<option value="+el.code+">"+el.tipologia+"</option>");
        });
    });
    //Reset dei capi sottostanti
    reset_drop_down("select[name=categoria_edilizia]");
  });

  //Ecento al cambiamento della categoria edilizia
  $("select[name=categoria_edilizia]").change(function() {
    categoria = $("select[name=categoria_edilizia]").val();
    //Aggiorno i costi con i nuovi dati
    get_costi_totali(comune, zona, categoria, function (data){
      update_values_costi(data);
    });
  });

  //Bottone avanti, salvo i dati inseriti dall'utente
  $("#abitazione-avanti").click(function() {
    //Lacio la validazione dei campi
    $(".form-campi").data("bootstrapValidator").validate();
    //Se la validazione è andata a buon fine abilito il passaggio al prossimo
    //Form
    if($(".form-campi").data("bootstrapValidator").isValid()){
      var data = {};
      $.each($("#abitazione-caller").serializeArray(), function (i, el){ 
        data[el.name] = el.value;
      });
      //Salvo la tipolgia di form utilizzata, semplice o compelta
      data.state = $("#checkbox-abitazione").is(":checked");

      //Salvo il nome della zona e del tipo d'abitazione esplicitamente
      if (data.state === false) {
        var comune = data.comune;
        var zona = ($("select[name=zona_abitativa]").val() !== null ? ", "+$("select[name=zona_abitativa]").find(":selected").text() : "");
        var categoria = ($("select[name=categoria_edilizia]").val() !== null ? " - "+$("select[name=categoria_edilizia]").find(":selected").text() : "");
        data.indirizzo = ellipse_string(comune + zona + categoria);
      }else{
        data.indirizzo = "Abitazione Propria";
      }    
      
      //Elimino i dati vecchi
      user_current_data.abitazione = data;
      //Carica il prossimo form
      load_form_trasporti();
    }
  });
}

function update_values_costi (data){
  //dati dal JSON che ricevo dal server
  costo_min = data.cost_min;
  costo_max = data.cost_max;
  costo = data.cost_med;
  set_input_costi();
}

function set_input_costi (){
  var grandezza = $("input[name=grandezza]").val();
  //Imposto i valori moltiplicando per la grandezza
  $("input[name=costo_min]").val((grandezza*costo_min).toFixed(2));
  $("input[name=costo_max]").val((grandezza*costo_max).toFixed(2));
  $("input[name=cost_med]").val((grandezza*costo).toFixed(2));
}

function load_abitazione_data(){
  var abitazione;
  if(!$.isEmptyObject(user_current_data.abitazione)){
    abitazione = user_current_data.abitazione;
    //Carico i dati utente, se vi è contenuta l'indicazione del comune
    //Carico il form completo altrimenti carico quello parziale
    if (abitazione.state === false) {
      //Carico tutti i dati e genero il form completo
      comune = abitazione.comune;
      zona = abitazione.zona_abitativa;
      categoria = abitazione.categoria_edilizia;
      //Imposto la grandezza
      $("input[name=grandezza]").val(abitazione.grandezza);
      //Ricarico i dati presi dal server
      //Comune
      get_comuni(function (data){
      $.each(data, function(i, el) {
          $("select[name=comune]").append("<option>"+el+"</option>");
          $("select[name=comune]").val(comune);
        });
      });
      //Zona
      get_zone(comune, function (data){
        $.each(data, function(i, el) {
          $("select[name=zona_abitativa]").append("<option value="+el.code+">"+el.zona+"</option>");
        });
        $("select[name=zona_abitativa]").val(zona);
      });
      //Categoria edilizia
      get_categoria_edilizia(comune, zona, function (data) {
        $.each(data, function(i, el) {
          $("select[name=categoria_edilizia]").append("<option value="+el.code+">"+el.tipologia+"</option>");
        });
        $("select[name=categoria_edilizia]").val(categoria);
      });
      //Imposto i valori nei capi di testo, dati dal JSON che invio al server
      $("input[name=cost_med]").val(abitazione.cost_med);
      $("input[name=costo_min]").val(abitazione.costo_min);
      $("input[name=costo_max]").val(abitazione.costo_max);
    }else{
      $(".switch").bootstrapSwitch("setState" , true);
      $("input[name=cost_med]").val(abitazione.cost_med);
    }
  };
}

//===============================================================
//======================= form TRASPORTI ========================
//===============================================================
var classe = "";
var alimentazione = "";
var array_auto = [];
var array_abbonamenti = [];
//Variabile che tiene conto se sto aggiungendo 
//Un mezzo da zero o lo sto editando
var old_auto_id = "";
var old_abbonamento_id = "";

$("#menu-trasporti-button").click(function() {
  load_form_trasporti();
});

function load_form_trasporti(){
  toggle_active_menu("#menu-trasporti-button");
  load_partial("partials/trasporti.html", "#form-container", function(){
    //Reset Array 
    form_trasporti();
  });
}

function form_trasporti(){
  //validator
  $("#auto-caller").bootstrapValidator({
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    }
  });
  $('#abbonamenti-caller').bootstrapValidator({
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    }
  });

  //attivo i tooltip
  $('label').tooltip();

  // selettori belli bellissimi
  $("select").selectpicker({style: 'btn-hg btn-primary', menuStyle: 'dropdown-inverse'});
  $('.switch')['bootstrapSwitch']();

  //Controllo se ci sono dati da caricare 
  load_automobili_data();
  load_abbonamenti_data();

  //Coolego gli array in modo da non dover dare avanti per salvare mezzi ed abbonamenti
  user_current_data.automobili = array_auto;
  user_current_data.abbonamenti = array_abbonamenti;

  //Tasto che rende visibile il form auto
  $('#bottone-aggiungi-auto').click(function () {
    $('#aggiungi-auto').show();
    //Genero il nome dell'auto incrementale
    $("input[name=auto_nome]").val("Auto "+ (array_auto.length+1));
    reset_form("#auto-container");
  });

  //Tasto che rende visibile il form mezzi pubblici
  $('#bottone-aggiungi-abbonamento').click(function () {
    $('#aggiungi-abbonamento').show();
    $("input[name=abbonamento_nome]").val("Abbonamento "+ (array_abbonamenti.length+1));
  });

  //Carico i dati delle categorie delle auto
  get_auto_categorie(function (data){
    $.each(data, function(i, el) {
      $("select[name=classe]").append("<option>"+el+"</option>");
    });
  });

  $("select[name=classe]").change(function() {
    //Dopo aver selezionato un tipologia di auto carico le alimentazione
    classe = $("select[name=classe]").val();
    //Resetto i dati nel caso ci siano gia delle cose caricate
    //reset_drop_down("select[name=alimentazione]");
    reset_drop_down_hard("select[name=alimentazione]");
    get_auto_alimentazione(classe, function (data) {
      $.each(data, function(i, el) {
         $("select[name=alimentazione]").append("<option>"+el+"</option>");
      });
    });
  });

  $("select[name=alimentazione]").change(function() {
    alimentazione = $("select[name=alimentazione]").val();
    get_auto_costi(classe, alimentazione, function (data) {
      //Valori di ritorno dal server JAJAJA
      $("input[name=assicurazione]").val(data.assicurazione);
      $("input[name=costo_km]").val(data.costo_km.toFixed(2));
      $("input[name=costo_fisso]").val(data.costo_fisso_altro.toFixed(2));
    });
  });
  //Collego il bottone per salvare un auto
  $("#save-auto").click(function() {
    //Lacio la validazione dei campi
    $("#auto-caller").data("bootstrapValidator").validate();
    //Se la validazione è andata a buon fine abilito il passaggio al prossimo
    //Form
    if($("#auto-caller").data("bootstrapValidator").isValid()){
      var data = {};
      $.each($("#auto-caller").serializeArray(), function (i, el){ 
        data[el.name] = el.value;
      });
      //Genero l'id univoco per l'auto
      data.id_auto = generete_id();
  
      if (edit_mode) {
        //Elimino l'elemento dal DOM
        $("#"+old_auto_id).remove();
        //Aggiunta in edit, elimino l'elemento vecchio dall'array
        $.each(array_auto, function(i, el) {
          if (el.id_auto == old_auto_id){
            array_auto.splice(array_auto.indexOf(el), 1);
            //Elimino l'elemento della list sul DOM
          }
        });
  
        edit_mode = false;
      }
  
      array_auto.push(data);
      add_automobile(data);
      //Chiuso la il form delle auto
      $("#aggiungi-auto").hide();
      //Resetto il form per il prossimo inserimento
      reset_form("#auto-caller");
    }
  });

  $("#cancel-auto").click(function() {
    $("#aggiungi-auto").hide();
    reset_form("#auto-caller");
    //Se sono in edit mode esco
    edit_mode = false;
    old_auto_id = "";
  });

  $("#save-abbonamento").click(function() {
    //Lacio la validazione dei campi
    $("#abbonamenti-caller").data("bootstrapValidator").validate();
    //Se la validazione è andata a buon fine abilito il passaggio al prossimo
    //Form
    if($("#abbonamenti-caller").data("bootstrapValidator").isValid()){
      var data = {};
      $.each($("#abbonamenti-caller").serializeArray(), function (i, el){ 
        data[el.name] = el.value;
      });
      //Aggiungo un id univoco per identificare un abbonamenti
      data.id_abbonamento = generete_id();
  
      if (edit_mode) {
        //Elimino l'elemento dal DOM
        $("#"+old_abbonamento_id).remove();
        //Aggiunta in edit, elimino l'elemento vecchio dall'array
        console.log(old_abbonamento_id);
        $.each(array_abbonamenti, function(i, el) {
          if (el.id_abbonamento == old_abbonamento_id){
            array_abbonamenti.splice(array_abbonamenti.indexOf(el), 1);
          }
        });
  
        edit_mode = false;
      }

      array_abbonamenti.push(data);
      add_abbonamento(data);
      //Chiuso la il form abbonamento
      $("#aggiungi-abbonamento").hide();
      reset_form("#abbonamenti-caller");
    }
  });

  $("#cancel-abbonamento").click(function() {
    $("#aggiungi-abbonamento").hide();
    //Se sono in edit mode esco
    edit_mode = false;
    old_abbonamento_id = "";
    reset_form("#abbonamenti-caller");
  });

  $("#trasporti-avanti").click(function() {
    //Carico il prossimo form
    if (array_auto.length > 0 || array_abbonamenti.length > 0) {
      load_form_spostamenti();
    };
  });
}

function add_automobile(auto){
  //Aggiungo l'elemento all'array
  var id = auto.id_auto;
  var auto_template = "<div id='"+id+"' class='tabella-auto'> \
                        <div class='icon-auto'></div> \
                        <h3 class='nome-auto'>"+auto.auto_nome+"</h3> \
                        <p>"+auto.percorrenza_annua+" km annuali</p> \
                        <div class='modifica-auto'> \
                            <span class='fui-new'></span> \
                            <span class='fui-cross'></span> \
                        </div> \
                      </div>"; 
  //Aggiungo l'elemento al DOM
  $("#auto-container").append(auto_template);

  //Gestisco i bottoni per eliminare ed edittare 
  $(".fui-cross").click(function(event) {
    var button = $(this);
    var id_container = button.parents('.tabella-auto:first').attr('id');
    //Elimino l'elemento
    $("#"+id_container).remove();
    //Elimino l'lemento dall'array
    $.each(array_auto, function(i, el) {
       if (el.id_auto == id_container){
        array_auto.splice(array_auto.indexOf(el), 1);
       }
    });
  });
  //Collego il bottone edit
  $(".fui-new").click(function(event) {
    var button = $(this);
    var id_container = button.parents('.tabella-auto:first').attr('id');
    //Cerco nell'array i dati da caricare poi inflatto il form
    $.each(array_auto, function(i, el) {
       if (el.id_auto == id_container){
          load_form_automobile_data(array_auto[array_auto.indexOf(el)]);
          //Imposto l'id per la fase di edit
          edit_mode = true;
          old_auto_id = el.id_auto;
       }
    });
  });
}

function load_automobili_data(){
  if (!$.isEmptyObject(user_current_data.automobili)) {
    array_auto = user_current_data.automobili;
    $.each(array_auto, function(i, el) {
      add_automobile(el);
   });
  }; 
}

function load_form_automobile_data(auto){
  //Carico gli input
  $("input[name=abbonamento_parcheggio]").val(auto.abbonamento_parcheggio).change();
  $("input[name=auto_nome]").val(auto.auto_nome).change();
  $("input[name=percorrenza_annua]").val(auto.percorrenza_annua).change();
  $("input[name=pedaggio_autostradale]").val(auto.pedaggio_autostradale).change();
  $("input[name=assicurazione]").val(auto.assicurazione).change();
  $("input[name=costo_km]").val(auto.costo_km).change()
  $("input[name=costo_fisso]").val(auto.costo_fisso).change();
  //Carico i drop_down
  classe = auto.classe;  
  get_auto_categorie(function (data){
    $.each(data, function(i, el) {
      $("select[name=classe]").append("<option>"+el+"</option>");
    });
    $("select[name=classe]").val(classe);
  });

  alimentazione = auto.alimentazione;
  get_auto_alimentazione(classe, function (data) {
    $.each(data, function(i, el) {
      $("select[name=alimentazione]").append("<option>"+el+"</option>");
    });
    $("select[name=alimentazione]").val(alimentazione);
  });

  //rendo visibile il form
  $("#aggiungi-auto").show();
}

function add_abbonamento(abbonamento) {
  var abbonamento_template = "<div id='"+abbonamento.id_abbonamento+"' class='tabella-mezzo'> \
                                <div class='icon-mezzo'></div> \
                                  <h3 class='nome-mezzo'>"+abbonamento.abbonamento_nome+"</h3> \
                                  <p>"+abbonamento.costo+"€ "+abbonamento.tipo+"</p> \
                                  <div class='modifica-mezzo'> \
                                    <span class='fui-new'></span> \
                                    <span class='fui-cross'></span> \
                                  </div> \
                              </div>";
  $("#abbonamenti-container").append(abbonamento_template);
  //Collego i bottoni edit e elimina

  //Gestisco i bottoni per eliminare ed edittare 
  $(".fui-cross").click(function(event) {
    var button = $(this);
    var id_container = button.parents('.tabella-mezzo:first').attr('id');
    //Elimino l'elemento
    $("#"+id_container).remove();
    //Elimino l'lemento dall'array
    $.each(array_abbonamenti, function(i, el) {
       if (el.id_abbonamento == id_container){
        array_abbonamenti.splice(array_abbonamenti.indexOf(el), 1);
       }
    });
  });

  $(".fui-new").click(function(event) {
    var button = $(this);
    var id_container = button.parents('.tabella-mezzo:first').attr('id');
    //Cerco nell'array i dati da caricare poi inflatto il form
    $.each(array_abbonamenti, function(i, el) {
       if (el.id_abbonamento == id_container){
          old_abbonamento_id = el.id_abbonamento;
          load_form_abbonamento_data(array_abbonamenti[array_abbonamenti.indexOf(el)]);
       }
    });
    //Imposto l'id per la fase di edit
    edit_mode = true;
  });
}

function load_abbonamenti_data(){
  if (!$.isEmptyObject(user_current_data.abbonamenti)) {
    array_abbonamenti = user_current_data.abbonamenti;
    $.each(array_abbonamenti, function(i, el) {
      add_abbonamento(el);
   });
  }; 
}

function load_form_abbonamento_data(abbonamento){
  //Carico i dati nel drop_down
  $("#aggiungi-abbonamento").show();
  $("input[name=abbonamento_nome]").val(abbonamento.abbonamento_nome)
  $("select[name=abbonamento_categoria]").val(abbonamento.abbonamento_categoria).change();
  $("select[name=tipo]").val(abbonamento.tipo).change();
  //Carico gli input
  $("input[name=costo]").val(abbonamento.costo)
}

//===============================================================
//===================== form SPOSTAMENTI ========================
//===============================================================
var array_spostamenti = [];
var old_spostamento_id  = "";

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
  //validator
  $('.form-campi').bootstrapValidator({
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    }
  });

  //attivo i tooltip
  $('label').tooltip();

  // selettori belli bellissimi
  $("select").selectpicker({style: 'btn-hg btn-primary', menuStyle: 'dropdown-inverse'});
  $('.switch')['bootstrapSwitch']();
  //Se ho già dati gli carico nella tabella
  laod_spostamenti_data();

  //Collego l'array che contiene gli spostamenti ai dati correnti dell'utente
  user_current_data.spostamenti = array_spostamenti;
  //Carico i mezzi nel dropdown
  load_mezzi();

  $("#bottone-aggiungi-spostamento").click(function() {
    $("#aggiungi-spostamento").show();
    $("input[name=descrizione]").val("Spostamento "+ (array_spostamenti.length+1));
  });

  //Collego il bottone per aggiungere uno spostamento
  $("#salva-spostamento").click(function() {
    $(".form-campi").data("bootstrapValidator").validate();
    //Se la validazione è andata a buon fine abilito il passaggio al prossimo
    //Form
    if($(".form-campi").data("bootstrapValidator").isValid()){
      var data = {};
      $.each($("#spostamenti-caller").serializeArray(), function (i, el){ 
        data[el.name] = el.value;
      });
      //Aggiungo un id univoco per identificare un abbonamenti
      data.id_spostamento = generete_id();
      //Constrollo se sono in edit mode
      if (edit_mode) {
        //Elimino l'elemento dal DOM
        $("#"+old_spostamento_id).remove();
        //Aggiunta in edit, elimino l'elemento vecchio dall'array
        $.each(array_spostamenti, function(i, el) {
          if (el.id_spostamento == old_spostamento_id){
            array_spostamenti.splice(array_spostamenti.indexOf(el), 1);
          }
        });
        edit_mode = false;
      }
      //Aggiungo lo spostamento all'array
      array_spostamenti.push(data);
      //Carico i dati nel dom
      add_spostamento(data);
      //Chiudo il form e lo resetto per il prossimo inserimento
      reset_form("#spostamenti-caller");
      $("#aggiungi-spostamento").hide();
    }
  });

  $("#cancel-spostamento").click(function() {
    //resetto il form e lo chiudo
    edit_mode = false;
    old_spostamento_id = "";
    reset_form("#spostamenti-caller");
    $("#aggiungi-spostamento").hide();
  });

  $("#spostamenti-avanti").click(function() {
    if (array_spostamenti.length > 0) {
      //Aggiungo un id per identificare una location
      user_current_data.id_location = generete_id();
      //Invio i dati al server per carlcolare i costi
      get_results_from_user_data(user_current_data, function (data) {
        //Salvo i nuovi dati con i risultati in local storage
        user_current_data.risultati = data;
        if (tile_edit_mode == true) {
          //Non serve che rimuova l'oggetto dall'array in quanto
          //é passato per rederenza quindi lo modifico e basta
          //Elimino l'elemento dal DOM per aggiornarlo
          $("#"+tile_old_id).remove();
          remove_comparison_chart(tile_old_id);
          //Salvo i dati in localstorage
          tile_edit_mode = false;
          tile_old_id = "";
        }else{
          //Aggiungo all'array dei dati utente la location appena creta
          user_data.push(user_current_data);
        }
        //Aggiunto il box con i risultati
        add_box_risultati(user_current_data)
        //Salvo i dati utente
        //Resetto user_current_data in modo che possa accogliere una nuova location
        save_user_data(user_data);
        //Reset delle variabili locali
        user_current_data = {};
        array_auto = [];
        array_spostamenti = [];
        array_abbonamenti = [];
        //Chiudo il form di immissione
      close_form_sidebar();
      });
      };
  });
}

function add_spostamento(spostamento) {
  var spostamento_tempalte = "<div id='"+spostamento.id_spostamento+"' class='tabella-attivita'> \
                                <h3 class='nome-attivita'>"+spostamento.descrizione+"</h3> \
                                <p>"+spostamento.motivo+", "+spostamento.percorrenze+" volte a settimana</p> \
                                <div class='modifica-attivita'> \
                                    <span class='fui-new'></span> \
                                    <span class='fui-cross'></span> \
                                </div> \
                              </div>"

  $("#spostamenti-container").append(spostamento_tempalte);

  //Gestisco i bottoni per eliminare ed edittare 
  $(".fui-cross").click(function(event) {
    var button = $(this);
    var id_container = button.parents('.tabella-attivita:first').attr('id');
    console.log(id_container);
    //Elimino l'elemento
    $("#"+id_container).remove();
    //Elimino l'lemento dall'array
    $.each(array_spostamenti, function(i, el) {
       if (el.id_spostamento == id_container){
        array_spostamenti.splice(array_spostamenti.indexOf(el), 1);
       }
    });
  });

  $(".fui-new").click(function(event) {
    var button = $(this);
    var id_container = button.parents('.tabella-attivita:first').attr('id');
    //Cerco nell'array i dati da caricare poi inflatto il form
    $.each(array_spostamenti, function(i, el) {
       if (el.id_spostamento == id_container){
          //salvo il vecchio id che poi andrò ad eliminare
          old_spostamento_id = el.id_spostamento;
          load_form_spostamenti_data(array_spostamenti[array_spostamenti.indexOf(el)]);
       }
    });
    //Imposto l'id per la fase di edit
    edit_mode = true;
  });
}

function laod_spostamenti_data(){
  if (!$.isEmptyObject(user_current_data.spostamenti)) {
    array_spostamenti = user_current_data.spostamenti;
    $.each(user_current_data.spostamenti, function(i, el) {
      add_spostamento(el);
    });
  }; 
}

function load_mezzi() {
  if (!$.isEmptyObject(user_current_data.automobili) ) {
    //Carico tutti i mezzi inseriti dall'utente nel dropdown menu
    $.each(user_current_data.automobili, function(i, el) {
      $("select[name=id_mezzo]").append("<option value='"+el.id_auto+"'>"+el.auto_nome+"</option>");
    });
  }

  if (!$.isEmptyObject(user_current_data.abbonamenti)) {
    $.each(user_current_data.abbonamenti, function(i, el) {
      $("select[name=id_mezzo]").append("<option value='"+el.id_abbonamento+"'>"+el.abbonamento_nome+"</option>");
    });
  }
}

function load_form_spostamenti_data(spostamento) {
  $("select[name=motivo]").val(spostamento.motivo).change();
  $("input[name=descrizione]").val(spostamento.descrizione);
  $("input[name=percorrenze]").val(spostamento.percorrenze);
  $("input[name=tempo]").val(spostamento.tempo);
  $("input[name=distanza]").val(spostamento.distanza);
  $("select[name=id_auto]").val(spostamento.id_auto).change();
  //Mostro il form caricato
  $("#aggiungi-spostamento").show();
}

//===============================================================
//=========================== BOX ===============================
//===============================================================
function add_box_risultati(data){
  var template_data = {
    id_location : data.id_location,
    costo_residenza : parseFloat(data.risultati.costo_residenza).toFixed(2),
    indirizzo : data.abitazione.indirizzo,
    costo_auto : (parseFloat(data.risultati.costo_auto)+parseFloat(data.risultati.costi_fissi_auto)).toFixed(2),
    costi_fissi_auto : parseFloat(data.risultati.costi_fissi_auto).toFixed(2),
    costi_spostamenti_auto : parseFloat(data.risultati.costo_auto).toFixed(2),
    costo_trasporto_pubblico : parseFloat(data.risultati.costo_trasporto_pubblico).toFixed(2),
    costo_totale_annuale : (parseFloat(data.risultati.costo_residenza)+parseFloat(data.risultati.costo_auto)+
                            parseFloat(data.risultati.costi_fissi_auto)+parseFloat(data.risultati.costo_trasporto_pubblico)).toFixed(2),
    tempo_speso : data.risultati.tempo_speso
  };

  $.get("partials/risultato.html", function (template){
    var rendered = Mustache.render(template, template_data);
    $("#container-risultato").append(rendered);
    //Renderizzo il grafico
    create_chart(template_data)
    //Collego i bottoni per eliminare e editare i box
    $(".fui-cross").click(function(event) {
      var button = $(this);
      var tile = button.parents('.tile-risultato:first').attr('id');
      //Elimino la tile dall'array e poi dall'array
      remove_tile_with_id(tile);
      $("#"+tile).remove();
      //Rimuovo il grafico in confronto
      remove_comparison_chart(tile);
      //Salvo in local storage i cambiamenti
      save_user_data(user_data);
    });
    $(".fui-new").click(function(event) {
      var button = $(this);
      var tile = button.parents('.tile-risultato:first').attr('id');
      //Apro il menu di edit, imposto che sono in modalità editing
      //Al prossimo salvataggio sovrascrivo la tile
      tile_edit_mode = true;
      //Carico i dati nel form
      user_current_data = find_user_data_with_id(tile);
      tile_old_id = user_current_data.id_location;
      open_form_sidebar();
    });
  });
  //Aggiungo il contenitore dei risultati se non prsente poi
  //carico il grafo
  if (!($('#container-confronto').children().length > 0)) {
    //Aggiungo il contenitore poi aggungo il grafico
    load_partial("partials/confronto.html","#container-confronto", function(){
      creare_comparison_chart(template_data);
    });
  }else{
    creare_comparison_chart(template_data);
    $('#container-confronto').show();
  }
  
}

function creare_comparison_chart(data) {
  var template_data = {
    id_grafico_confronto : (data.id_location+"-grafico-confronto")
  };
  //Carico il partial e lo aggiungo
  $.get("partials/grafico-confronto.html", function (template){
    var rendered = Mustache.render(template, template_data);
    $("#confronto-grafici-container").append(rendered);
    //Imposto le altezze corrette degl elementi
    var costo_totale_annuale = parseFloat(data.costo_auto)+parseFloat(data.costo_residenza)+parseFloat(data.costo_trasporto_pubblico)

    var percentuale_casa = (data.costo_residenza / costo_totale_annuale)*100;
    var percentuale_auto = (data.costo_auto/ costo_totale_annuale)*100;
    var percentuale_abbonamenti = (data.costo_trasporto_pubblico / costo_totale_annuale)*100;
    //Imposto il css per le altezze
    console.log(data.id_location);
    $("#"+data.id_location+"-grafico-confronto").children(".residenza-grafico").css("height", percentuale_casa+"%");
    $("#"+data.id_location+"-grafico-confronto").children(".auto-grafico").css("height", percentuale_auto+"%");
    $("#"+data.id_location+"-grafico-confronto").children(".trasporti-grafico").css("height", percentuale_abbonamenti+"%");
    //Aggiungo la didascalia
    $("#confronto-grafici-testo").append("<div id=\""+data.id_location+"-didascalia\" class=\"confronto-didascalia\">"+data.indirizzo+"</div>");
    //Animo i grafici
    $("#"+data.id_location+"-grafico-confronto").css("padding-top", "50%");
    $("#"+data.id_location+"-grafico-confronto").animate({"padding-top" : "0%"}, 1000, "easeInOutQuart");
  });
}

function remove_comparison_chart(id){
  //Rimuovo il grafico a barre
  $("#"+id+"-grafico-confronto").remove();
  //Rimuovo la didascalia
  $("#"+id+"-didascalia").remove();
  //Se il contenitore dei grafici non ha figli allora lo nascondo
  if(!($('#confronto-grafici-container').children().length > 0)){
    $('#container-confronto').hide();
  }
}

function create_chart(data) {
  var canvas_container = $("#"+data.id_location+" .chart");
  var ctx = $(canvas_container)[0].getContext('2d');

  var data = [
        {
          value: parseFloat(data.costo_residenza),
          color: "#2C3E4E"
        },
        {
          value : parseFloat(data.costo_auto),
          color : "#9B59B6"
        },
        {
          value : parseFloat(data.costo_trasporto_pubblico),
          color : "#36CC71"
        }
      ];

  var options = {
    animationSteps : 70,
    animationEasing : "easeInOutQuart",
    animateScale : false,
    segmentShowStroke: true,
    segmentStrokeColor: "#ECF0F1"
  }

  new Chart(ctx).Doughnut(data,options);
}

function find_user_data_with_id(id){
  var data  = {};
  $.each(user_data, function(i, el) {
    if (el.id_location == id) {
      data = el;
    };
  });

  return data;
}

function remove_tile_with_id(id){
  $.each(user_data, function(i, el) {
    if (el.id_location == id) {
      user_data.splice(user_data.indexOf(el), 1);
    };
  });
}
