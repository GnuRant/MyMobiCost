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
  load_form_abitazione("#menu-abitazione-button");
});

function load_form_abitazione (){
  toggle_active_menu("#menu-abitazione-button");
  load_partial("partials/abitazione.html", "#form-container", function (){
    form_abitazione();
  });
}

function form_abitazione (){
  // selettori belli bellissimi
  $("select").selectpicker({style: 'btn-hg btn-primary', menuStyle: 'dropdown-inverse'});
  $('.switch')['bootstrapSwitch']();
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

}




