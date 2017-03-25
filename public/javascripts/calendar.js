(function (global) {
  'use strict';
var socket = io.connect('http://localhost:3000');

socket.on('new_event_from_server', function (data) {
    var newEvent = new Event(data.group, data.start, data.end, data.description, data.color);
    newEvent.renderEventDays();
  });

  function Event(group, dateStart, dateEnd, description, color) {
    this.group = group;
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.description = description;
    this.color = color;
    this.eventDays = this.returnEventDays(this.dateStart, this.dateEnd);
  };

  function EventDay(id) {
    this.id = id;
  };

  Event.prototype.pushEventDays = function () {
    for (var i = 0; i < this.returnEventDays.length; i++) {
      this.eventDays.push(new EventDay(this.returnEventDays[i]));
    }
  };

  Event.prototype.renderEventDays = function() {
      for (var i = 0; i < this.eventDays.length; i++) {
      var elem = document.getElementById(this.eventDays[i]);
      if(elem != null){
        var event = document.createElement('div', {class: 'event'});
        event.innerHTML = this.description;
        event.getAttribute('class', 'event');
        event.style.backgroundColor = this.color;
        elem.appendChild(event);
     }
    }
  }

  Event.prototype.returnEventDays = function (start, end) {
    var days = [];
    var eventDays = [];
    if (this.group == 2) {
      days = [2, 4, 6];
    } if (this.group == 1) {
      days = [1, 3, 5];
    }
    var startDate = new Date(start);
    var endDate = new Date(end)
    while (startDate <= endDate) {
      if (startDate.getUTCDay() == days[0] || startDate.getUTCDay() == days[1] || startDate.getUTCDay() == days[2]) {
        eventDays.push(startDate.getUTCDate() + '/' + startDate.getUTCMonth() + '/' + startDate.getUTCFullYear());
      }
      startDate.setDate(startDate.getDate() + 1);
    };
    return eventDays;
  };

  function Calendar(o) {
    this.events = [];
    this.divId = o.ParentID;
    this.DaysOfWeek = o.DaysOfWeek;
    this.Months = o.Months;
    var d = new Date();
    this.CurrentMonth = d.getMonth();
    this.CurrentYear = d.getFullYear();
    var f = o.Format;
    if (typeof (f) == 'string') {
      this.f = f.charAt(0).toUpperCase();
    } else {
      this.f = 'M';
    }
  };

  Calendar.prototype.pushEvents = function (dateStart, dateEnd, nameBlock, authorName) {
    this.events.push(new Event(dateStart, dateEnd, nameBlock, authorName));
  };

  Calendar.prototype.bindEventDays = function () {

  };

  Calendar.prototype.nextMonth = function () {
    if (this.CurrentMonth == 11) {
       this.CurrentMonth = 0;
       this.CurrentYear = this.CurrentYear + 1;
    } else {
       this.CurrentMonth = this.CurrentMonth + 1;
    }
    this.showCurrent();
  };


  Calendar.prototype.previousMonth = function () {
    if (this.CurrentMonth == 0) {
      this.CurrentMonth = 11;
      this.CurrentYear = this.CurrentYear - 1;
    } else {
      this.CurrentMonth = this.CurrentMonth - 1;
    }
    this.showCurrent();
  };


  Calendar.prototype.previousYear = function () {
    this.CurrentYear = this.CurrentYear - 1;
    this.showCurrent();
  }


  Calendar.prototype.nextYear = function () {
    this.CurrentYear = this.CurrentYear + 1;
    this.showCurrent();
  }

  // Получаем текущий месяц
  Calendar.prototype.showCurrent = function () {
    this.Calendar(this.CurrentYear, this.CurrentMonth);
  };


  Calendar.prototype.Calendar = function (y, m) {
    typeof (y) == 'number' ? this.CurrentYear = y : null;
    typeof (y) == 'number' ? this.CurrentMonth = m : null;
    var firstDayOfCurrentMonth = new Date(y, m, 1).getDay();
    var lastDateOfCurrentMonth = new Date(y, m + 1, 0).getDate();

    // Последний день предыдущего месяца
    var lastDateOfLastMonth = m == 0 ? new Date(y - 1, 11, 0).getDate() : new Date(y, m, 0).getDate();
    var monthandyearhtml = '<span id="monthandyearspan" class="calendatTitle">' + this.Months[m] + ' ' + y + '</span>';
    var html = '<table>';

    // Заголовок дней недели
    html += '<tr>';
    for (var i = 0; i < 7; i++) {
      html += '<th class="daysheader">' + this.DaysOfWeek[i] + '</th>';
    }
    html += '</tr>';
    var p, dm;
    p = dm = this.f == 'M' ? 1 : firstDayOfCurrentMonth == 0 ? -5 : 2; // 2
    var cellvalue;

    for (var d, i = 0, z0 = 0; z0 < 6; z0++) {
      html += '<tr>';
      for (var z0a = 0; z0a < 7; z0a++) {
        d = i + dm - firstDayOfCurrentMonth;

        // Дни предшествующего месяца
        if (d < 1) {
          cellvalue = lastDateOfLastMonth - firstDayOfCurrentMonth + p++;
          html += '<td id="' + cellvalue + '" class="prevmonthdates">' +
            '<span id="cellvaluespan">' + (cellvalue) + '</span><br/>' +
            '</td>';

          // Дни следующего месяца
        } else if (d > lastDateOfCurrentMonth) {
          var firstFaysOfNextDays = p++;
          html += '<td id="' + firstFaysOfNextDays + '" class="nextmonthdates">' + firstFaysOfNextDays + '</td>';

          // Дни текущего месяца
        } else {
          html += '<td><div day="' + this.DaysOfWeek[z0a] + '"  class="currentmonthdates">' + (d) + 
          '</div><div class="eventContent" id="' + (d) + '/' + this.CurrentMonth + '/' + this.CurrentYear + 
          '"></div><div><button id="myBtn" value="Add" class="add">+</button></div></td>';
          p = 1;
        }

        if (i % 7 == 6 && d >= lastDateOfCurrentMonth) {
          z0 = 10; // большие строки не формировать
        }
        i++;
      }
      html += '</tr>';
    }

    html += '</table>';

    //document.getElementById("year").innerHTML = yearhtml;
    //document.getElementById("month").innerHTML = monthhtml;

    document.getElementById("monthandyear").innerHTML = monthandyearhtml;
    document.getElementById(this.divId).innerHTML = html;

    // находить элементы с айди дней, в которые есть занятия
    socket.emit('require_events');

    //-------modal
        // Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementsByTagName("button");

// Get the <span> element that closes the modal
var close = document.getElementsByClassName("close");

// When the user clicks on the button, open the modal 
for(var i = 0; i < btn.length; i++){
    btn[i].onclick = function() {
    modal.style.display = "block";
}
}

for(var i = 0; i < close.length; i++){
    close[i].onclick = function () {
    modal.style.display = "none";
}
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
  };



  //************************************************************************************  
  var newCalendar = new Calendar({
    ParentID: "divcalendartable",

    DaysOfWeek: [
      'ПН',
      'ВТ',
      'СР',
      'ЧТ',
      'ПТ',
      'СБ',
      'ВС'
    ],

    Months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],

    Format: 'dd/mm/yyyy'
  });

  newCalendar.showCurrent();

  function getId(id) {
    return document.getElementById(id);
  }

  getId('btnPrev').onclick = function () {
    newCalendar.previousMonth();
  };

  getId('btnNext').onclick = function () {
    newCalendar.nextMonth();
  };

  socket.on('events_from_server', function (obj) {
    console.log("events: " + obj.length);
    for (var j = 0; j < obj.length; j++){
      var newEvent = new Event(obj[j].id_group, obj[j].date_start, obj[j].date_end, obj[j].event_description, obj[j].id_color);
      console.log('newEvent: ' + newEvent.eventDays);
      newEvent.renderEventDays();
    }
  });

  function createDOMelement(tag, attr) {
        var elem = document.createElement(tag);
        for (var key in attr) {
            elem.setAttribute(key, attr[key]);
        }
        return elem;
    }

} (window));


// elem.hasAttribute(name) – проверяет наличие атрибута
// elem.getAttribute(name) – получает значение атрибута
// elem.setAttribute(name, value) – устанавливает атрибут
// elem.removeAttribute(name) – удаляет атрибут

/*
var date = new Date(2011, 0, 1, 2, 3, 4, 567);
alert( date ); // 1.01.2011, 02:03:04.567
*/

/*
getDay()
Получить номер дня в неделе. 
Неделя в JavaScript начинается с воскресенья, 
так что результат будет числом от 0(воскресенье) до 6(суббота).
*/

/*
Чтобы прибавить к дате нужное количество дней пример
function dni() {
  var D = new Date(1999,11,31);
  D.setDate(D.getDate() + 3);
  alert(D);
}
*/
