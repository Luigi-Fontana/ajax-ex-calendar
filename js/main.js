$(document).ready(function () {

    var htmlGiorno = $('#calendar-template').html();
    var templateGiorno = Handlebars.compile(htmlGiorno);

    // Stampare il mese di Gennaio 2018
    // Tramite click stampare il mese successivo

    var dataIniziale = moment('2018-01-01');
    var meseIniziale = dataIniziale.month();
    stampaGiorniMese(dataIniziale); // Inizializzazione Calendario
    stampaFestivi(meseIniziale);

    $('.mese-succ').click(function () {
        dataIniziale.add(1, 'month');
        var meseAttuale = dataIniziale.month();
        stampaGiorniMese(dataIniziale);
        stampaFestivi(meseAttuale);
    });

    $('.mese-prec').click(function () {
        dataIniziale.subtract(1, 'month');
        var meseAttuale = dataIniziale.month();
        stampaGiorniMese(dataIniziale);
        stampaFestivi(meseAttuale);
    });

    function stampaFestivi(mese) {
        $.ajax({
            url: 'https://flynn.boolean.careers/exercises/api/holidays',
            method: 'GET',
            data: {
                year: 2018,
                month: mese
            },
            success: function (data) {
                var giorniFestivi = data.response;
                for (var i = 0; i < giorniFestivi.length; i++) {
                    var giornoFestivo = giorniFestivi[i];
                    var nomeFestivo = giornoFestivo.name;
                    var dataFestivo = giornoFestivo.date;
                    $('#calendar li[data-day="' + dataFestivo + '"]').addClass('festivo').append(' - ' + nomeFestivo);
                }
            },
            error: function (err) {
                alert ('errore');
            }
        });
    }

    function stampaGiorniMese(meseDaStampare) {
        $('#calendar').empty();
        var annoCorretto = meseDaStampare.year();
        if (annoCorretto == 2018) {
            var standardDay = meseDaStampare.clone();
            var giorniMese = meseDaStampare.daysInMonth();
            var nomeMese = meseDaStampare.format('MMMM');
            $('#nome-mese').text(nomeMese); // Aggiorniamo il nome del mese in top calendar
            for (var i = 1; i <= giorniMese; i++) {
                var giornoDaInserire = {
                    day: i + ' ' + nomeMese,
                    dataDay: standardDay.format('YYYY-MM-DD')
                }
                var templateFinale = templateGiorno(giornoDaInserire); // Stiamo popolando il template con i dati dell'oggetto
                $('#calendar').append(templateFinale);
                standardDay.add(1, 'day');
            }
        } else {
            $('.container').empty();
            alert('l\'API funziona solo con il 2018. Ricarica la pagina!');
        }
    }

});
