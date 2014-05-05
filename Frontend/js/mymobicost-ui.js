//===============================================================
//==========================  UI ================================
//===============================================================

  // rende i select meravigliosi colorati e hipster
  $("select").selectpicker({style: 'btn-hg btn-primary', menuStyle: 'dropdown-inverse'});
    $("button.dropdown-toggle").css({
        'background':'#404040'
    });
  
  $('#new-session').click(function () {
    $.get( "partials/famiglia.html", function( data ) {
      $( "#form-container" ).html( data );
    });
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