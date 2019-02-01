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
/***
  MEDICOS - CALENDARIO
***/

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
  $("#printDate").text(val);      
});

$(document).ready(function(){
  var date=new Date();
  var months=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  var weekday = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
  var val=weekday[date.getDay()]+ ", "+date.getDate()+" de "+months[date.getMonth()];
  $("#printDate2").text(val);      
});

$(document).ready(function(){
  var date=new Date();
  var months=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  var weekday = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
  var val=weekday[date.getDay()]+ ", "+date.getDate()+" de "+months[date.getMonth()];
  $("#printDate3").text(val);      
});
$(document).ready(function(){
  var date=new Date();
  var months=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  var weekday = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
  var val=weekday[date.getDay()]+ ", "+date.getDate()+" de "+months[date.getMonth()];
  $("#printDate4").text(val);      
});
$('a#ver-semanal').click(function() {
  $(".medicos-section").fadeOut();
  $(".pacientes-section").fadeOut();  
  $(".obrassocial-section").fadeOut();    
  $(".especialidades-section").fadeOut();  
  $(".calendario-section").fadeIn();  
  $("a#medicos-panel").removeClass('active');
  $("a#calendario-panel").addClass('active');

});

$('a#ver-dia').click(function() {
  $(".medicos-section").fadeOut();
  $(".medicos-section").fadeOut();
  $(".pacientes-section").fadeOut();  
  $(".obrassocial-section").fadeOut();    
  $(".especialidades-section").fadeOut();    
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

/***
  MEDICOS - CALENDARIO
***/

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
  $("#printDate").text(val);      
});



$('a#ver-semanal').click(function() {
  $(".medicos-section").fadeOut();
  $(".calendario-section").fadeIn();  
  $("a#medicos-panel").removeClass('active');
  $("a#calendario-panel").addClass('active');

});

$('a#ver-dia').click(function() {
  $(".medicos-section").fadeOut();   
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

/***
  MODAL HORARIOS
***/

$('a.close-modal-horarios').click(function() {
  $(".modal-horarios").fadeOut();
});

$('a.close-modal-especialidades').click(function() {
    $(".modal-especialidades").fadeOut();
});

/***
  MODAL AGREGAR MEDICO
***/

$('a.close-modal-agregar-medico').click(function() {
  $(".modal-agregar-medico").fadeOut();
});

$( document ).on( 'keydown', function ( e ) {
    if ( e.keyCode === 27 ) { // ESC
        $(".modal-agregar-medico").fadeOut();
    }
});

$( document ).on( 'keydown', function ( e ) {
    if ( e.keyCode === 27 ) { // ESC
        $(".modal-horarios").fadeOut();
    }
});

$('a.close-borrar-medico').click(function() {
  $(".modal-borrar-medico").fadeOut();
});

$( document ).on( 'keydown', function ( e ) {
    if ( e.keyCode === 27 ) { // ESC
      $(".modal-borrar-medico").fadeOut();
    }
});


/***
  MEDICOS ORDEN TABLAS
***/
function sortTable2(n) {
  var table2, rows2, switching2, i2, x2, y2, shouldSwitch2, dir2, switchcount2 = 0;
  table2 = document.getElementById("table-medicos");
  switching2 = true;
  // Set the sorting direction to ascending:
  dir2 = "asc"; 
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching2) {
    // Start by saying: no switching is done:
    switching2 = false;
    rows2 = table2.getElementsByTagName("TR");
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows2.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch2 = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x2 = rows2[i].getElementsByTagName("TD")[n];
      y2 = rows2[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir2 == "asc") {
          $(".table#table-medicos thead i").removeClass('active');
          $(".table#table-medicos thead i").eq(n).addClass('active');
        if (x2.innerHTML.toLowerCase() > y2.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch2= true;
          break;
        }
      } else if (dir2 == "desc") {
        $(".table#table-medicos thead i").removeClass('active');
        if (x2.innerHTML.toLowerCase() < y2.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch2= true;
          break;
        }
      }
    }
    if (shouldSwitch2) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows2[i].parentNode.insertBefore(rows2[i + 1], rows2[i]);
      switching2 = true;
      // Each time a switch is done, increase this count by 1:
      switchcount2 ++; 
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount2 == 0 && dir2 == "asc") {
        dir2 = "desc";
        switching2= true;
      }
    }
  }
};