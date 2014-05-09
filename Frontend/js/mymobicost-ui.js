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

    if (old_value === "") {
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

function generete_id() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function reset_drop_down (id_element){
  $(id_element)
    .find('option')
    .remove()
    .end()
    .append('<option value="" disabled selected>seleziona un\'opzione</option>')
    .val('whatever');
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
  load_famiglia_data();

  $("#famiglia-avanti").click(function() {
    var data = {};
    $.each($('#famiglia-caller').serializeArray(), function (i, el){ 
      data[el.name] = el.value;
    });
    user_new_data.famiglia = data;
    //Carica il prossimo form
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

  load_abitazione_data();

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
    });
    //Re-imposto il valore di default per i form sottostanti
    reset_drop_down("select[name=zona_abitativa]");
    reset_drop_down("select[name=categoria_edilizia]");
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
    var data = {};
    $.each($('#abitazione-caller').serializeArray(), function (i, el){ 
      data[el.name] = el.value;
    });
    data.state = $("#checkbox-abitazione").is(':checked');
    //Elimino i dati vecchi
    user_new_data.abitazione = data;
    //Carica il prossimo form
    load_form_trasporti();
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
  if(!$.isEmptyObject(user_new_data.abitazione)){
    abitazione = user_new_data.abitazione;
    //Carico i dati utente, se vi è contenuta l'indicazione del comune
    //Carico il form completo altrimenti carico quello parziale
    if (abitazione.state == false) {
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
      $(".switch").bootstrapSwitch('setState' , true);
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
var edit_mode = false;
var old_auto_id = "";

$("#menu-trasporti-button").click(function() {
  load_form_trasporti();
});

function load_form_trasporti(){
  toggle_active_menu("#menu-trasporti-button");
  load_partial("partials/trasporti.html", "#form-container", function(){
    form_trasporti();
  });
}

function form_trasporti(){

  //attivo i tooltip
  $('label').tooltip();

  // selettori belli bellissimi
  $("select").selectpicker({style: 'btn-hg btn-primary', menuStyle: 'dropdown-inverse'});
  $('.switch')['bootstrapSwitch']();

  //Tasto che rende visibile il form auto
  $('#bottone-aggiungi-auto').click(function () {
    $('#aggiungi-auto').show();
    //Genero il nome dell'auto incrementale
    $("input[name=auto_nome]").val("Auto "+ (array_auto.length+1));
  });

  //Tasto che rende visibile il form mezzi pubblici
  $('#bottone-aggiungi-abbonamento').click(function () {
    $('#aggiungi-abbonamento').show();
  });

  //Controllo se ci sono dati da caricare 
  load_automobili_data();

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
    reset_drop_down("select[name=alimentazione]");
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
      $("input[name=costo_km]").val(data.costo_km);
      $("input[name=costo_fisso]").val(data.costo_fisso_altro);
    });
  });
  //Collego il bottone per salvare un auto
  $("#save-auto").click(function() {
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
  });

  $("#cancel-auto").click(function() {
    $("#aggiungi-auto").hide();
    //Se sono in edit mode esco
    edit_mode = false;
    old_auto_id = "";
  });

  $("#save-abbonamento").click(function() {
    var data = {};
    $.each($("#abbonamenti-caller").serializeArray(), function (i, el){ 
      data[el.name] = el.value;
    });
    //Aggiungo un id univoco per identificare un abbonamenti
    data.id_abbonamento = generete_id();
    console.log(data);
    //TODO:Aggiungere logica in fase di edit 
    array_abbonamenti.push(data);
    add_abbonamento(data);
    //Chiuso la il form delle auto
    $("#aggiungi-abbonamento").hide();
    
    //Resetto il form per il prossimo inserimento
    reset_form("#abbonamenti-caller");
  });


  //Collego il bottone per salvare tutti i dati inseriti dall
  //utente
  $("#trasporti-avanti").click(function() {
    user_new_data.automobili = array_auto;
    user_new_data = array_abbonamenti;
    load_form_spostamenti();
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
  if (!$.isEmptyObject(user_new_data.automobili)) {
    array_auto = user_new_data.automobili;
    $.each(array_auto, function(i, el) {
      add_automobile(el);
   });
  }; 
}

function load_form_automobile_data(auto){
  //Resetto 
  reset_form("#auto-caller");
  //Carico gli input
  $("input[name=abbonamento_parcheggio]").val(auto.abbonamento_parcheggio);
  $("input[name=auto_nome]").val(auto.auto_nome);
  $("input[name=percorrenza_annua]").val(auto.percorrenza_annua);
  $("input[name=pedaggio_autostradale]").val(auto.pedaggio_autostradale);
  $("input[name=assicurazione]").val(auto.assicurazione);
  $("input[name=costo_km]").val(auto.costo_km);
  $("input[name=costo_fisso]").val(auto.costo_fisso);
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

//Funzione per resettare il form auto
function reset_form(id_element){
  $(id_element)[0].reset();
  //Imposto i dropdown al valore di default
  reset_drop_down("select");
}


function add_abbonamento(abbonamento) {
  var abbonamento_template = "<div class='tabella-mezzo'> \
                                <div class='icon-mezzo'></div> \
                                  <h3 class='nome-mezzo'>"+abbonamento.abbonamento_nome+"</h3> \
                                  <p>"+abbonamento.costo+"€ "+abbonamento.tipo+"</p> \
                                  <div class='modifica-mezzo'> \
                                    <span class='fui-new'></span> \
                                    <span class='fui-cross'></span> \
                                  </div> \
                              </div>";
  $("#mezzi-container").append(abbonamento_template);
  //Collego i bottoni edit e elimina

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

  // selettori belli bellissimi
  $("select").selectpicker({style: 'btn-hg btn-primary', menuStyle: 'dropdown-inverse'});
  $('.switch')['bootstrapSwitch']();

}

