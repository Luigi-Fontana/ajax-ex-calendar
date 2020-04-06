$(document).ready(function () {

    var sourceCalendar = $('#calendar-template').html(); // Handlebars
    var templateCalendar = Handlebars.compile(sourceCalendar);

    var defaultDate = moment('2018-01-01'); // Assegno a una variabile una data di partenza
    var startingDate = moment('2018-01-01'); // Assegno a una variabile una data di apertura
    var closingDate = moment('2018-12-01'); // Assegno a una variabile una data di chiusura
    printCalendar(defaultDate); // Richiamo funzione stampa calendario con data di partenza
    printHolidays(defaultDate); // Richiamo funzione stampa festività con data di partenza

    $('.btn-next').click(function () {
        $('.btn-prev').prop('disabled', false); // Prima di tutto tolgo il disable al bottone prev
        if (defaultDate.isSameOrAfter(closingDate)) { // Controllo sulla manipolazione del codice
            alert('Hai provato a manipolare');
        } else {
            defaultDate.add(1, 'month'); // Aggiungo un mese alla data di partenza
            printCalendar(defaultDate); // Richiamo delle funzioni con questa data aggiornata
            printHolidays(defaultDate);
            if (defaultDate.isSameOrAfter(closingDate)) { // Controllo se siamo all'ultimo mese disponibile
                $('.btn-next').prop('disabled', true); // Nel caso vero disabilitiamo il bottone next
            }
        }
    });

    $('.btn-prev').click(function () { // Stesso ragionamento del bottone next ma al contrario
        $('.btn-next').prop('disabled', false);
        if (defaultDate.isSameOrBefore(startingDate)) {
            alert('Hai provato a manipolare');
        } else {
            defaultDate.subtract(1, 'month');
            printCalendar(defaultDate);
            printHolidays(defaultDate);
            if (defaultDate.isSameOrBefore(startingDate)) {
                $('.btn-prev').prop('disabled', true);
            }
        }
    });

    function printCalendar(inputDate) {
        $('.days-calendar').empty(); // Prima di tutto cancelliamo il contenuto del calendario
        var standardDate = inputDate.clone(); // Cloniamo la data presa da input per manipolarla in seguito
        var inputDays = inputDate.daysInMonth(); // Giorni nel mese corrente
        var inputMonth = inputDate.format('MMMM'); // Prendiamo il nome del mese
        $('#month-name').text(inputMonth); // Aggiorniamo il nome del mese in top calendar
        for (var i = 1; i <= inputDays; i++) { // Ciclo su ogni giorno del mese
            var outputDay = {
                day: i,
                dataDay: standardDate.format('YYYY-MM-DD')
            }
            var htmlCalendar = templateCalendar(outputDay); // Popolamento Template Handlebars
            $('.days-calendar').append(htmlCalendar); // Append per ogni singolo giorno del mese
            standardDate.add(1, 'day'); // Aggiunta di 1 giorno al ciclo
        }
    }

    function printHolidays(inputDate) {
        $.ajax({
            url: 'https://flynn.boolean.careers/exercises/api/holidays',
            method: 'GET',
            data: {
                year: inputDate.year(), // Data estrapolando l'anno dell'input
                month: inputDate.month() // Data estrapolando il mese dell'input
            },
            success: function (data) {
                var holidays = data.response; // Solito ciclo sull'array di oggetti dati dal response
                for (var i = 0; i < holidays.length; i++) {
                    var holiday = holidays[i];
                    var holidayName = holiday.name;
                    var holidayDate = holiday.date;
                    $('.cont-calendar[data-day="' + holidayDate + '"]').addClass('holiday').append('<p class="holiday-name">' + holidayName + '</p>'); // Aggiunta del data-day e della classe holiday
                }
            }
        });
    }

});
