  $(".semana-calendario").fadeIn();
  $(".dia-calendario").fadeOut();
  $("a#semana-menu").addClass('activeLink');
  $("a#dia-menu").removeClass('activeLink');
  $(".semana-calendario #prev-btn").css('display','inline-block');
  $(".semana-calendario #next-btn").css('display','inline-block');
  $(".dia-calendario #prev-btn").css('display','none');
  $(".dia-calendario #next-btn").css('display','none');
  
$('a#semana-menu').click(function() {
	$(".semana-calendario").fadeIn();
	$(".dia-calendario").fadeOut();
	$("a#semana-menu").addClass('activeLink');
	$("a#dia-menu").removeClass('activeLink');
	$(".semana-calendario #prev-btn").css('display','inline-block');
	$(".semana-calendario #next-btn").css('display','inline-block');
  $(".dia-calendario #prev-btn").css('display','none');
  $(".dia-calendario #next-btn").css('display','none');
});

$('a#dia-menu').click(function() {
	$(".semana-calendario").fadeOut();
	$(".dia-calendario").fadeIn();
	$("#dia-menu").addClass('activeLink');
	$("a#semana-menu").removeClass('activeLink');
	$(".dia-calendario #prev-btn").css('display','inline-block');
	$(".dia-calendario #next-btn").css('display','inline-block');
  $(".semana-calendario #prev-btn").css('display','none');
  $(".semana-calendario #next-btn").css('display','none');
});


/***
	HORARIOS
***/
$('.clock_input').attr({
  readonly: 'true',
  value: '14:30'
});

$('.hour').attr({
  readonly: 'true',
  value: '14'
});

$('.minute').attr({
  readonly: 'true',
  value: '30'
});

$('.clock_input').click(function(e) {
	e.preventDefault();
  $('.clock_container').css({
    display: 'none'
  });
  $(this).siblings().css({
    display: 'block',
    display: 'flex'
  });
});

$('.clock_footer').click(function(e) {
	e.preventDefault();
  $(this).parent().css({
    display: 'none'
  });
});

$('.up_hour').click(function(e) {
	e.preventDefault();
  const get_hour = parseInt($('.hour').val());
  if(get_hour < 21){
    var calc_hour = ("0" + (get_hour + 1)).slice (-2);
    $(this).next("input").val(calc_hour);
  }
});

$('.down_hour').click(function(e) {
	e.preventDefault();
  const get_hour = parseInt($('.hour').val());
  if(get_hour > 07){
    var calc_hour = ("0" + (get_hour - 1)).slice (-2);
    $(this).prev("input").val(calc_hour);
  }
});

$('.up_minute').click(function(e) {
	var sum=0;
		e.preventDefault();
  const get_minute = parseInt($('.minute').val());
  if(get_minute < 55){
    var calc_minute = ("0" + (get_minute + 5)).slice (-2);
    $(this).next("input").val(calc_minute);
  }
});

$('.down_minute').click(function(e) {
		e.preventDefault();
  const get_minute = parseInt($('.minute').val());
  if(get_minute > 0){
    var calc_minute = ("0" + (get_minute - 5)).slice (-2);
    $(this).prev("input").val(calc_minute);
  }
});

/***
	HORARIOS
***/
$('.ci').attr({
  readonly: 'true',
  value: '14:30'
});

$('.ho').attr({
  readonly: 'true',
  value: '14'
});

$('.mi').attr({
  readonly: 'true',
  value: '30'
});

$('.ci').click(function(e) {
	e.preventDefault();
  $('.cc').css({
    display: 'none'
  });
  $(this).siblings().css({
    display: 'block',
    display: 'flex'
  });
});

$('.cf').click(function(e) {
	e.preventDefault();
  $(this).parent().css({
    display: 'none'
  });
});

$('.uh').click(function(e) {
	e.preventDefault();
  const get_hour2 = parseInt($('.ho').val());
  if(get_hour2 < 21){
    var calc_hour2 = ("0" + (get_hour2 + 1)).slice (-2);
    $(this).next("input").val(calc_hour2);
  }
});

$('.dh').click(function(e) {
	e.preventDefault();
  const get_hour2 = parseInt($('.ho').val());
  if(get_hour2 > 07){
    var calc_hour2 = ("0" + (get_hour2 - 1)).slice (-2);
    $(this).prev("input").val(calc_hour2);
  }
});

$('.um').click(function(e) {
		e.preventDefault();
  const get_minute2 = parseInt($('.mi').val());
  if(get_minute2 < 55){
    var calc_minute2 = ("0" + (get_minute2 + 5)).slice (-2);
    $(this).next("input").val(calc_minute2);
  }
});

$('.dm').click(function(e) {
		e.preventDefault();
  const get_minute2 = parseInt($('.mi').val());
  if(get_minute2 > 0){
    var calc_minute2 = ("0" + (get_minute2 - 5)).slice (-2);
    $(this).prev("input").val(calc_minute2);
  }
});

/***
	CAMBIO DÍAS CALENDARIO
***/
$(document).ready(function(){
    $(".semanas div.div-puntual2").each(function(e) {
        if (e != 0)
            $(this).hide();
    });
    
    $(".semana-calendario #next-btn").click(function(){
        if ($(".semanas div.div-puntual2:visible").next().length != 0)
            $(".semanas div.div-puntual2:visible").next().show().prev().hide();
        else {
            $(".semanas div.div-puntual2:visible").hide();
            $(".semanas div.div-puntual2:first").show();
        }
        return false;
    });

    $(".semana-calendario #prev-btn").click(function(){
        if ($(".semanas div.div-puntual2:visible").prev().length != 0)
            $(".semanas div.div-puntual2:visible").prev().show().next().hide();
        else {
            $(".semanas div.div-puntual2:visible").hide();
            $(".semanas div.div-puntual2:last").show();
        }
        return false;
    });
});


/**
  BUSCADOR CALENDARIO
**/
$(document).ready(function() {
    $('.js-example-basic-single').select2();
});

$(document).ready(function() {
    $('.js-example-basic-single-2').select2();
});
 
$(document).ready(function() {
    $('.js-example-basic-single-3').select2();
});



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


/***
  AGREGAR TURNO
***/
$('a#add-turno').click(function() {
  $(".modal-agregar-turno").fadeIn();
});

$('a.close-modal-agregar-turno').click(function() {
  $(".modal-agregar-turno").fadeOut();
});

$( document ).on( 'keydown', function ( e ) {
    if ( e.keyCode === 27 ) { // ESC
      $(".modal-agregar-turno").fadeOut();
    }
});

/* Menu */
$("a#paciente-turno").addClass('activeTurno');
$(".paciente-cluster").fadeIn();

$('a#paciente-turno').click(function() {
  $(".paciente-cluster").fadeIn();
  $(".cliente-cluster").fadeOut();
  $(".noexiste-cluster").fadeOut();
  $("a#paciente-turno").addClass('activeTurno');
  $("a#cliente-turno").removeClass('activeTurno');
  $("a#noexiste-turno").removeClass('activeTurno');
});

$('a#cliente-turno').click(function() {
  $(".cliente-cluster").fadeIn();
  $(".paciente-cluster").fadeOut();
  $(".noexiste-cluster").fadeOut();
  $("a#cliente-turno").addClass('activeTurno');
  $("a#paciente-turno").removeClass('activeTurno');
  $("a#noexiste-turno").removeClass('activeTurno');
});

$('a#noexiste-turno').click(function() {
  $(".noexiste-cluster").fadeIn();
  $(".cliente-cluster").fadeOut();
  $(".paciente-cluster").fadeOut();
  $("a#noexiste-turno").addClass('activeTurno');
  $("a#cliente-turno").removeClass('activeTurno');
  $("a#paciente-turno").removeClass('activeTurno');
});

/* Select medico */
$(document).ready(function() {
    $('.js-example-basic-single-12').select2();
});

/* Hora */
$('.cci3').attr({
  readonly: 'true',
  value: '14:30'
});

$('.hho3').attr({
  readonly: 'true',
  value: '14'
});

$('.mmi3').attr({
  readonly: 'true',
  value: '30'
});

$('.cci3').click(function(e) {
  e.preventDefault();
  $('.ccc3').css({
    display: 'none'
  });
  $(this).siblings().css({
    display: 'block',
    display: 'flex'
  });
});

$('.ccf3').click(function(e) {
  e.preventDefault();
  $(this).parent().css({
    display: 'none'
  });
});

$('.uuh3').click(function(e) {
  e.preventDefault();
  const get_hour3 = parseInt($('.hho3').val());
  if(get_hour3 < 21){
    var calc_hour3 = ("0" + (get_hour3 + 1)).slice (-2);
    $(this).next("input").val(calc_hour3);
  }
});

$('.ddh3').click(function(e) {
  e.preventDefault();
  const get_hour3 = parseInt($('.hho3').val());
  if(get_hour3 > 07){
    var calc_hour3 = ("0" + (get_hour3 - 1)).slice (-2);
    $(this).prev("input").val(calc_hour3);
  }
});

$('.uum3').click(function(e) {
    e.preventDefault();
  const get_minute3 = parseInt($('.mmi3').val());
  if(get_minute3 < 55){
    var calc_minute3 = ("0" + (get_minute3 + 5)).slice (-2);
    $(this).next("input").val(calc_minute3);
  }
});

$('.ddm3').click(function(e) {
    e.preventDefault();
  const get_minute3 = parseInt($('.mmi3').val());
  if(get_minute3 > 0){
    var calc_minute3 = ("0" + (get_minute3 - 5)).slice (-2);
    $(this).prev("input").val(calc_minute3);
  }
});


$('.cci4').attr({
  readonly: 'true',
  value: '14:30'
});

$('.hho4').attr({
  readonly: 'true',
  value: '14'
});

$('.mmi4').attr({
  readonly: 'true',
  value: '30'
});

$('.cci4').click(function(e) {
  e.preventDefault();
  $('.ccc4').css({
    display: 'none'
  });
  $(this).siblings().css({
    display: 'block',
    display: 'flex'
  });
});

$('.ccf4').click(function(e) {
  e.preventDefault();
  $(this).parent().css({
    display: 'none'
  });
});

$('.uuh4').click(function(e) {
  e.preventDefault();
  const get_hour4 = parseInt($('.hho4').val());
  if(get_hour4 < 21){
    var calc_hour4 = ("0" + (get_hour4 + 1)).slice (-2);
    $(this).next("input").val(calc_hour4);
  }
});

$('.ddh4').click(function(e) {
  e.preventDefault();
  const get_hour4 = parseInt($('.hho4').val());
  if(get_hour4 > 07){
    var calc_hour4 = ("0" + (get_hour4 - 1)).slice (-2);
    $(this).prev("input").val(calc_hour4);
  }
});

$('.uum4').click(function(e) {
    e.preventDefault();
  const get_minute4 = parseInt($('.mmi4').val());
  if(get_minute4 < 55){
    var calc_minute4 = ("0" + (get_minute4 + 5)).slice (-2);
    $(this).next("input").val(calc_minute4);
  }
});

$('.ddm4').click(function(e) {
    e.preventDefault();
  const get_minute4 = parseInt($('.mmi4').val());
  if(get_minute4 > 0){
    var calc_minute4 = ("0" + (get_minute4 - 5)).slice (-2);
    $(this).prev("input").val(calc_minute4);
  }
});


$(document).ready(function() {
$(".tab").click(function () {
    $(".tab").removeClass("active");
    // $(".tab").addClass("active"); // instead of this do the below 
    $(this).addClass("active");   
        
});
});