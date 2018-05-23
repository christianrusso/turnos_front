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
    $("#printDate2").text(val);      
  });
  
  
  
  $('a#ver-semanal').click(function() {  
    $(".obrassocial-section").fadeOut();     
    $(".calendario-section").fadeIn();  
    $("a#medicos-panel").removeClass('active');
    $("a#calendario-panel").addClass('active');
  
  });
  
  $('a#ver-dia').click(function() {  
    $(".obrassocial-section").fadeOut();    
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
  
  $(".listado-obras-sociales .letras div#all").addClass('activeLetra');
  $(".listado-obras-sociales .letras div").each(function() {
  
    $(this).click(function(){
      $(".listado-obras-sociales .letras div").removeClass('activeLetra');
      $(this).addClass('activeLetra');
      var id= $(this).attr('id');
      $("div.cluster-obras-sociales#div" + id).show();
      $("div.cluster-obras-sociales#div" + id).css('overflow-y', 'scroll');                   
    });
  });
  
  $('a.edit-obra-social').click(function() {
    $(".modal-obra-social").fadeIn();
  });
  
  $('a.close-modal-obra-social').click(function() {
    $(".modal-obra-social").fadeOut();
  });
  
  
  $('a#agregar-obra-social').click(function() {
    $(".modal-nueva-obra-social").fadeIn();
  });
  
  $('a.close-modal-nueva-obra-social').click(function() {
    $(".modal-nueva-obra-social").fadeOut();
  });
  
  
  $('a.delete-obra-social').click(function() {
    $(".borrar-obra-social").fadeIn();
  });
  
  $('a.close-borrar-obra-social').click(function() {
    $(".borrar-obra-social").fadeOut();
  });
  
  $( document ).on( 'keydown', function ( e ) {
      if ( e.keyCode === 27 ) { // ESC
        $(".modal-obra-social").fadeOut();
      }
  });
  
  $( document ).on( 'keydown', function ( e ) {
      if ( e.keyCode === 27 ) { // ESC
        $(".borrar-obra-social").fadeOut();
      }
  });
  $( document ).on( 'keydown', function ( e ) {
      if ( e.keyCode === 27 ) { // ESC
        $(".modal-nueva-obra-social").fadeOut();
      }
  });
  
  