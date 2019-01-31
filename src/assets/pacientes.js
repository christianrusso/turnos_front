var TodayDate = new Date();

var d = TodayDate.getDate();  //it returns the date 
var m = TodayDate.getMonth()+1; //returns the index of the month array

var themonth = 1;
renderCal(themonth);

$('.minusmonth').click(function(){
  themonth += -1;
  renderCal(themonth);
  if(themonth == -2){
    themonth = 10;
  }
});

$('.addmonth').click(function(){
  themonth += 1;
  renderCal(themonth);

  if(themonth == 9){
    themonth = -3;
  }

});
var currentYear = (new Date).getFullYear();


function renderCal(themonth){
$('.calendar li').remove();
$('.calendar ul').append('<li>Dom</li><li>Lun</li><li>Mar</li><li>Mie</li><li>Jue</li><li>Vie</li><li>Sab</li>');
var d = new Date(),
  currentMonth = d.getMonth()+themonth, // get this month
  days = numDays(currentMonth,d.getFullYear()), // get number of days in the month
  fDay = firstDay(currentMonth,d.getFullYear()-1), // find what day of the week the 1st lands on
  months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']; // month names

$('.calendar p.monthname').text(months[currentMonth-1] + ' '+ d.getFullYear()); // add month name to calendar

for (var i=0;i<fDay-2;i++) { // place the first day of the month in the correct position
  $('<li class="empty">&nbsp;</li>').appendTo('.calendar ul');
}

for (var i = 1;i<=days;i++) { // write out the days
  $('<li>'+i+'</li>').appendTo('.calendar ul');
}

function firstDay(month,year) {
  return new Date(year,month,1).getDay();
}

function numDays(month,year) {
  return new Date(year,month,0).getDate();
}


$('.calendar li').click(function(){ 
  $('.calendar li').removeClass('active');
  $(this).addClass('active');
});
}

$(document).ready(function(){
  var date=new Date();
  var months=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  var weekday = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
  var val=weekday[date.getDay()]+ ", "+date.getDate()+" de "+months[date.getMonth()];
  $("#printDate4").text(val);      
});


$('a#ver-semanal').click(function() {
  $(".pacientes-section").fadeOut();  
  $(".calendario-section").fadeIn();  
  $("a#medicos-panel").removeClass('active');
  $("a#calendario-panel").addClass('active');

});

$('a#ver-dia').click(function() {
  $(".pacientes-section").fadeOut();   
  $(".calendario-section").fadeIn();    
  $(".semana-calendario").fadeOut();
  $(".dia-calendario").fadeIn();
  $("#dia-menu").addClass('activeLink');
  $("a#semana-menu").removeClass('activeLink');
  $(".dia-calendario #prev-btn").css('display','inline-block');
  $(".dia-calendario #next-btn").css('display','inline-block');
  $(".semana-calendario #prev-btn").css('display','none');
  $(".semana-calendario #next-btn").css('display','none');
  $("a#medicos-panel").removeClass('active');
  $("a#calendario-panel").addClass('active');
});

$(document).ready(function() {
    $('.js-example-basic-single-9').select2();
});

/***
  PACIENTES ORDEN TABLAS
***/
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("table-pacientes");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc"; 
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
          $(".table#table-pacientes thead i").removeClass('active');
          $(".table#table-pacientes thead i").eq(n).addClass('active');
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        $(".table#table-pacientes thead i").removeClass('active');
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++; 
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}


$('a.borrar-paciente').click(function() {
  $(".modal-borrar-paciente").fadeIn();
});

$('a.close-borrar-paciente').click(function() {
  $(".modal-borrar-paciente").fadeOut();
});

$('a.close-modal-paciente').click(function() {
    $(".modal-paciente").fadeOut();
});

$('#addFicha').click(function() {
    if ($("#newFicha").is(":visible")) {
        $("#newFicha").hide();
        $("#addFicha").html("+");
    } else {
        $("#newFicha").show();
        $("#addFicha").html("-");
    }
});


$( document ).on( 'keydown', function ( e ) {
    if ( e.keyCode === 27 ) { // ESC
      $(".modal-borrar-paciente").fadeOut();
    }
});

$('[data-toggle="tooltip"]').tooltip();