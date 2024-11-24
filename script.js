let oceny = [];
let wartoscPlusa = 0.25;
let wartoscMinusa = 0.25;

window.etap = 1;

$('#waga').on('input', function() {
    if(isNaN($(this).val())) {
        $(this).val('1');
    }
    
    if($(this).val() > 999) {
        $(this).val('999');
    }
    
    if($(this).val().startsWith('0')) {
        $(this).val($(this).val().substring(1));
    }

    moznaDodacOcene();
});

$('#oceny').on('click', '#wyborOceny .wybierzOcene', function() {
    $('.wybierzOcene').removeClass('ring-2 ring-gray-50');
    $(this).addClass('ring-2 ring-gray-50');
    moznaDodacOcene();
});

function moznaDodacOcene() {
    let ileOcenZaznaczonych = 0;
    $('.wybierzOcene').each(function() {
        if($(this).hasClass('ring-2 ring-gray-50')) {
            ileOcenZaznaczonych++;
        }
    })

    if(ileOcenZaznaczonych === 1 && $('#waga').val() > 0) {
        $('#potwierdzDodanie').prop('disabled', false)
    } else {
        $('#potwierdzDodanie').prop('disabled', true)
    }
}

$('#oceny').on('click', '#wyborOceny #potwierdzDodanie',function() {
    let ocena = $('.wybierzOcene.ring-2 span').text();
    let waga = $('#waga').val();

    if(typeof window.edycja === 'undefined') {
        oceny.push({
            ocena: ocena,
            waga: waga
        });
    } else {
        oceny[window.edycja].ocena = ocena;
        oceny[window.edycja].waga = waga;
        window.edycja = undefined;
    }

    aktualizujSrednia();
    aktualizujListeOcen();

});

$('#oceny').on('click', '#wyborOceny #anuluj',function() {
    if(window.etap === 1) {
        window.etap = 2;
        $('#edytujPlusMinus').addClass('hidden');

        $('#etap1').addClass('hidden');
        $('#aktualnaSredniaSpan').html('Aktualna średnia: ');
        $('#sredniaPoEdycjiDiv').removeClass('hidden');
        $('#otworzDodawanieOceny').removeClass('hidden');
        $('#wyborOceny').remove();

        aktualizujSrednia();
    } else {
        $('#wyborOceny').remove();
        aktualizujSrednia();
        aktualizujListeOcen();
        window.edycja = undefined;
    }
});

$('#otworzDodawanieOceny').on('click', function() {
    if(window.etap === 2 && !$('#wyborOceny').length) {
        nowaOcena();
    }
})

$('#oceny').on('click', '.usunOcene' ,function() {
    let indexOcenyDoUsuniecia = $(this).parent().index();
    oceny.splice(indexOcenyDoUsuniecia, 1);
    
    $(this).parent().remove();
    aktualizujSrednia();
});

$('#oceny').on('click', '.edytujOcene' ,function() {
    let indexOcenyDoEdycji = $(this).parent().index();
    nowaOcena(indexOcenyDoEdycji);
});

function aktualizujSrednia() {
    let ileOcen = oceny.reduce((sum, ocena) => sum + parseFloat(ocena.waga), 0);
    let sumaOcen = 0;
    
    for(let i = 0; i < oceny.length; i++) {
        let ocenaDoDodania = 0;
        
        if(!isNaN(oceny[i].ocena) && oceny[i].ocena.indexOf('-') == -1 && oceny[i].ocena.indexOf('+') == -1 && oceny[i].ocena.indexOf(',') == -1) {
            ocenaDoDodania += parseInt(oceny[i].ocena);
        } else if(oceny[i].ocena.indexOf('+') != -1) {
            ocenaDoDodania = ocenaDoDodania + wartoscPlusa + parseInt(oceny[i].ocena);
        } else if(oceny[i].ocena.indexOf('-') != -1) {
            ocenaDoDodania = ocenaDoDodania - wartoscMinusa + parseInt(oceny[i].ocena);
        }

        sumaOcen += ocenaDoDodania * oceny[i].waga;
    }
    
    let srednia = (sumaOcen / ileOcen).toFixed(2);
    if(srednia === 'NaN') srednia = (0).toFixed(2);

    let kolorTekstu = '';
    let kolorTla = '';
    if(srednia <= 0) {
        kolorTekstu = 'text-gray-950';
        kolorTla = 'bg-gray-500';
    } else if(srednia <= 1.75) {
        kolorTekstu = 'text-red-950';
        kolorTla = 'bg-red-500';
    } else if(srednia <= 2.75) {
        kolorTekstu = 'text-orange-950';
        kolorTla = 'bg-orange-400';
    } else if(srednia <= 3.75) {
        kolorTekstu = 'text-yellow-950';
        kolorTla = 'bg-yellow-500';
    } else if(srednia <= 4.75) {
        kolorTekstu = 'text-green-950';
        kolorTla = 'bg-green-500';
    } else if(srednia <= 5.75) {
        kolorTekstu = 'text-green-950';
        kolorTla = 'bg-green-600';
    } else if(srednia <= 7) {
        kolorTekstu = 'text-blue-950';
        kolorTla = 'bg-blue-500';
    }
    
    if(window.etap === 1) {
        resetSredniaKolor('aktualna');
        $('#sredniaSpan').html(srednia.replace('.', ','));
        $('#sredniaDiv').addClass(kolorTla);
        $('#sredniaSpan').addClass(kolorTekstu);
    } else {
        resetSredniaKolor('edycja');
        $('#nowaSrednia').html(srednia.replace('.', ','));
        $('#nowaSredniaDiv').addClass(kolorTla);
        $('#nowaSrednia').addClass(kolorTekstu);
    }
}

function aktualizujListeOcen() {
    $('#oceny').empty();

    for (let i = 0; i < oceny.length; i++) {
        let ocena = oceny[i].ocena;
        let waga = oceny[i].waga;
        let kolorTla = '';
        let kolorTekstu = '';

        if (ocena === '1-') {
            kolorTla = 'bg-red-600';
            kolorTekstu = 'text-red-950';
        } else if (ocena === '1' || ocena === '1+') {
            kolorTla = 'bg-red-500';
            kolorTekstu = 'text-red-950';
        } else if (ocena === '2-') {
            kolorTla = 'bg-orange-500';
            kolorTekstu = 'text-orange-950';
        } else if (ocena === '2') {
            kolorTla = 'bg-orange-400';
            kolorTekstu = 'text-orange-950';
        } else if (ocena === '2+') {
            kolorTla = 'bg-amber-400';
            kolorTekstu = 'text-amber-950';
        } else if (ocena === '3-' || ocena === '3' || ocena === '3+') {
            kolorTla = 'bg-yellow-500';
            kolorTekstu = 'text-yellow-950';
        } else if (ocena === '4-' || ocena === '4') {
            kolorTla = 'bg-green-500';
            kolorTekstu = 'text-green-950';
        } else if (ocena === '4+' || ocena === '5-' || ocena === '5') {
            kolorTla = 'bg-green-600';
            kolorTekstu = 'text-green-950';
        } else if (ocena === '5+' || ocena === '6-') {
            kolorTla = 'bg-teal-500';
            kolorTekstu = 'text-teal-950';
        } else if (ocena === '6' || ocena === '6+') {
            kolorTla = 'bg-blue-500';
            kolorTekstu = 'text-blue-950';
        }

        let html = '<div class="ocena flex flex-row px-3 py-1.5">' +
            '<div class="flex w-12 h-12 px-1.5 py-1 justify-center items-center rounded-md ' + kolorTla + '"><span class="numerOceny w-8 flex-shrink-0 text-2xl ' + kolorTekstu + ' text-center font-semibold leading-6">' + ocena + '</span></div>' +
            '<p class="self-center content-center ml-4 text-gray-300">waga ' + waga + '</p>' +
            '<div class="flex-grow"></div>' +
            '<button class="edytujOcene mr-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg></button>' +
            '<button class="usunOcene mr-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-delete"><path d="M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/><path d="m12 9 6 6"/><path d="m18 9-6 6"/></svg></button>' +
            '</div>';

        $('#oceny').append(html);
    }

    if(window.etap === 1) {
        nowaOcena();
    }
}

function nowaOcena(numerOceny) {
    if($('#wyborOceny').length) return;
    if(typeof numerOceny === 'undefined') {
        let przycisk = 'anuluj';
        if(window.etap === 1) {
            przycisk = 'zakończ';
        }

        $('#oceny').append(`<div id="wyborOceny" class="bg-gray-800 p-3 mt-3 flex flex-row">
        
        <div class="grid grid-rows-3 grid-cols-6 grid-flow-col gap-1.5 select-none">
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-red-600"><span class="w-5 text-red-950 text-center font-semibold leading-6">1-</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-red-500"><span class="w-5 text-red-950 text-center font-semibold leading-6">1</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-red-500"><span class="w-5 text-red-950 text-center font-semibold leading-6">1+</span></div>
        
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-orange-500"><span class="w-5 text-orange-950 text-center font-semibold leading-6">2-</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-orange-400"><span class="w-5 text-orange-950 text-center font-semibold leading-6">2</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-amber-400"><span class="w-5 text-amber-950 text-center font-semibold leading-6">2+</span></div>
        
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-yellow-500"><span class="w-5 text-yellow-950 text-center font-semibold leading-6">3-</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-yellow-500"><span class="w-5 text-yellow-950 text-center font-semibold leading-6">3</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-yellow-500"><span class="w-5 text-yellow-950 text-center font-semibold leading-6">3+</span></div>
        
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-green-500"><span class="w-5 text-green-950 text-center font-semibold leading-6">4-</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-green-500"><span class="w-5 text-green-950 text-center font-semibold leading-6">4</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-green-600"><span class="w-5 text-green-950 text-center font-semibold leading-6">4+</span></div>
        
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-green-600"><span class="w-5 text-green-950 text-center font-semibold leading-6">5-</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-green-600"><span class="w-5 text-green-950 text-center font-semibold leading-6">5</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-teal-500"><span class="w-5 text-teal-950 text-center font-semibold leading-6">5+</span></div>
        
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-teal-500"><span class="w-5 text-teal-950 text-center font-semibold leading-6">6-</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-blue-500"><span class="w-5 text-blue-950 text-center font-semibold leading-6">6</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-blue-500"><span class="w-5 text-blue-950 text-center font-semibold leading-6">6+</span></div>
        </div>
        
        <div class="mx-auto flex flex-col gap-1.5">
        <label class="justify-center text-center text-xs text-gray-300">waga</label>
        <input type="number" name="waga" id="waga" class="border-2 border-gray-300 w-24 h-8 rounded-md bg-gray-900 text-semibold text-center text-sm ring-0 outline-none" min="1" max="999" value="1">
        
        <div class="flex-grow"></div>
        
        <div class="flex flex-row">
            <button id="potwierdzDodanie" class="flex w-8 h-8 px-1.5 py-1 justify-center items-center rounded-md bg-gray-900 text-gray-300 disabled:text-gray-600" disabled><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus mx-auto"><path d="M5 12h14"/><path d="M12 5v14"/></svg></button>
        
            <div class="flex-grow"></div>
        
            <button id="anuluj" class="text-sm">${przycisk}</button>
        </div>
        
        </div>
        
        
        </div>`)

    } else {
        if(numerOceny > oceny) {
            console.error('Nie znaleziono oceny o szukanym ID ' + numerOceny);
            return;
        }

        window.edycja = numerOceny;
        
        let przycisk = 'anuluj';
        if(window.etap === 1) {
            przycisk = 'zakończ';
        }

        let waga = oceny[numerOceny].waga;
        let ocena = oceny[numerOceny].ocena;

        $('#oceny .ocena').eq(numerOceny).after(`<div id="wyborOceny" class="bg-gray-800 p-3 mt-3 flex flex-row">
        
        <div class="grid grid-rows-3 grid-cols-6 grid-flow-col gap-1.5 select-none">
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-red-600"><span class="w-5 text-red-950 text-center font-semibold leading-6">1-</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-red-500"><span class="w-5 text-red-950 text-center font-semibold leading-6">1</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-red-500"><span class="w-5 text-red-950 text-center font-semibold leading-6">1+</span></div>
        
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-orange-500"><span class="w-5 text-orange-950 text-center font-semibold leading-6">2-</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-orange-400"><span class="w-5 text-orange-950 text-center font-semibold leading-6">2</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-amber-400"><span class="w-5 text-amber-950 text-center font-semibold leading-6">2+</span></div>
        
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-yellow-500"><span class="w-5 text-yellow-950 text-center font-semibold leading-6">3-</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-yellow-500"><span class="w-5 text-yellow-950 text-center font-semibold leading-6">3</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-yellow-500"><span class="w-5 text-yellow-950 text-center font-semibold leading-6">3+</span></div>
        
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-green-500"><span class="w-5 text-green-950 text-center font-semibold leading-6">4-</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-green-500"><span class="w-5 text-green-950 text-center font-semibold leading-6">4</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-green-600"><span class="w-5 text-green-950 text-center font-semibold leading-6">4+</span></div>
        
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-green-600"><span class="w-5 text-green-950 text-center font-semibold leading-6">5-</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-green-600"><span class="w-5 text-green-950 text-center font-semibold leading-6">5</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-teal-500"><span class="w-5 text-teal-950 text-center font-semibold leading-6">5+</span></div>
        
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-teal-500"><span class="w-5 text-teal-950 text-center font-semibold leading-6">6-</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-blue-500"><span class="w-5 text-blue-950 text-center font-semibold leading-6">6</span></div>
        <div class="wybierzOcene flex px-1.5 py-1 justify-center items-center rounded-md bg-blue-500"><span class="w-5 text-blue-950 text-center font-semibold leading-6">6+</span></div>
        </div>
        
        <div class="mx-auto flex flex-col gap-1.5">
        <label class="justify-center text-center text-xs text-gray-300">waga</label>
        <input type="number" name="waga" id="waga" class="border-2 border-gray-300 w-24 h-8 rounded-md bg-gray-900 text-semibold text-center text-sm ring-0 outline-none" min="1" max="999" value="${waga}">
        
        <div class="flex-grow"></div>
        
        <div class="flex flex-row">
            <button id="potwierdzDodanie" class="flex w-8 h-8 px-1.5 py-1 justify-center items-center rounded-md bg-gray-900 text-gray-300 disabled:text-gray-600" disabled><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg></button>
        
            <div class="flex-grow"></div>
        
            <button id="anuluj" class="text-sm">${przycisk}</button>
        </div>
        
        </div>
        
        </div>`);

        let ocenaDoZaznaczenia = $('.wybierzOcene span').filter(function() {
            return $(this).text() === ocena;
        }).parent();
        ocenaDoZaznaczenia.addClass('ring-2 ring-gray-50');
        moznaDodacOcene();


        $('#oceny .ocena').eq(numerOceny).remove();

        aktualizujSrednia();

    }
}

function resetSredniaKolor(ktoryElement) {
    if(ktoryElement && ktoryElement === 'aktualna') {
        $('#sredniaSpan').text('0,00');
        $('#sredniaDiv').removeClass('bg-gray-500');
        $('#sredniaDiv').removeClass('bg-red-500');
        $('#sredniaDiv').removeClass('bg-orange-400');
        $('#sredniaDiv').removeClass('bg-yellow-500');
        $('#sredniaDiv').removeClass('bg-green-500');
        $('#sredniaDiv').removeClass('bg-green-600');
        $('#sredniaDiv').removeClass('bg-blue-500');
        
        $('#sredniaSpan').removeClass('text-gray-950');
        $('#sredniaSpan').removeClass('text-red-950');
        $('#sredniaSpan').removeClass('text-orange-950');
        $('#sredniaSpan').removeClass('text-yellow-950');
        $('#sredniaSpan').removeClass('text-green-950');
        $('#sredniaSpan').removeClass('text-blue-950');
    } else if(ktoryElement && ktoryElement === 'edycja') {
        $('#nowaSrednia').text('0,00');
        $('#nowaSredniaDiv').removeClass('bg-gray-500');
        $('#nowaSredniaDiv').removeClass('bg-red-500');
        $('#nowaSredniaDiv').removeClass('bg-orange-400');
        $('#nowaSredniaDiv').removeClass('bg-yellow-500');
        $('#nowaSredniaDiv').removeClass('bg-green-500');
        $('#nowaSredniaDiv').removeClass('bg-green-600');
        $('#nowaSredniaDiv').removeClass('bg-blue-500');
        
        $('#nowaSrednia').removeClass('text-gray-950');
        $('#nowaSrednia').removeClass('text-red-950');
        $('#nowaSrednia').removeClass('text-orange-950');
        $('#nowaSrednia').removeClass('text-yellow-950');
        $('#nowaSrednia').removeClass('text-green-950');
        $('#nowaSrednia').removeClass('text-blue-950');
    } else {
        $('#sredniaSpan').text('0,00');
        $('#sredniaDiv').removeClass('bg-gray-500');
        $('#sredniaDiv').removeClass('bg-red-500');
        $('#sredniaDiv').removeClass('bg-orange-400');
        $('#sredniaDiv').removeClass('bg-yellow-500');
        $('#sredniaDiv').removeClass('bg-green-500');
        $('#sredniaDiv').removeClass('bg-green-600');
        $('#sredniaDiv').removeClass('bg-blue-500');
    
        $('#sredniaSpan').removeClass('text-gray-950');
        $('#sredniaSpan').removeClass('text-red-950');
        $('#sredniaSpan').removeClass('text-orange-950');
        $('#sredniaSpan').removeClass('text-yellow-950');
        $('#sredniaSpan').removeClass('text-green-950');
        $('#sredniaSpan').removeClass('text-blue-950');
    
        $('#nowaSrednia').text('0,00');
        $('#nowaSredniaDiv').removeClass('bg-gray-500');
        $('#nowaSredniaDiv').removeClass('bg-red-500');
        $('#nowaSredniaDiv').removeClass('bg-orange-400');
        $('#nowaSredniaDiv').removeClass('bg-yellow-500');
        $('#nowaSredniaDiv').removeClass('bg-green-500');
        $('#nowaSredniaDiv').removeClass('bg-green-600');
        $('#nowaSredniaDiv').removeClass('bg-blue-500');
    
        $('#nowaSrednia').removeClass('text-gray-950');
        $('#nowaSrednia').removeClass('text-red-950');
        $('#nowaSrednia').removeClass('text-orange-950');
        $('#nowaSrednia').removeClass('text-yellow-950');
        $('#nowaSrednia').removeClass('text-green-950');
        $('#nowaSrednia').removeClass('text-blue-950');
    }
}

$('#edytujPlusMinus').on('click', function() {
    $('#modalContainer').removeClass('hidden');
    $('#modalContainer').css('animation', 'fadeIn 0.2s forwards');
    $('#modal').css('animation', 'dialogOpen 0.2s forwards');
});

$('#zapiszPlusMinus').on('click', function() {
    $('#modalContainer').css('animation', 'fadeOut 0.2s forwards');
    $('#modal').css('animation', 'dialogClose 0.2s forwards');

    setTimeout(function() {
        $('#modalContainer').css('animation', '');
        $('#modalContainer').addClass('hidden');
        $('#modal').css('animation', '');
    }, 200);

    let plus = parseFloat($('#setWPlusa').val().replace(',', '.'));
    let minus = parseFloat($('#setWMinusa').val().replace(',', '.'));

    if(isNaN(plus) || plus < 0.01 || plus > 0.99) plus = 0.25;
    if(isNaN(minus) || minus < 0.01 || minus > 0.99) minus = 0.25;

    wartoscPlusa = plus;
    wartoscMinusa = minus;

    $('#wPlusa').html(plus.toFixed(2).replace('.', ','));
    $('#wMinusa').html(minus.toFixed(2).replace('.', ','));

    aktualizujSrednia();
});

$('#setWPlusa').on('blur', function() {
    let wartosc = $(this).val().replace(',', '.');

    if (wartosc === '') {
        wartosc = '0.25';
    } else if (!/^\d*\.?\d*$/.test(wartosc)) {
        wartosc = '0.25';
    }

    wartosc = parseFloat(wartosc);

    if (isNaN(wartosc) || wartosc < 0.01 || wartosc > 0.99) {
        wartosc = 0.25;
    }

    $(this).val(wartosc.toFixed(2).replace('.', ','));
});

$('#setWMinusa').on('blur', function() {
    let wartosc = $(this).val().replace(',', '.');

    if (wartosc === '') {
        wartosc = '0.25';
    } else if (!/^\d*\.?\d*$/.test(wartosc)) {
        wartosc = '0.25';
    }

    wartosc = parseFloat(wartosc);

    if (isNaN(wartosc) || wartosc < 0.01 || wartosc > 0.99) {
        wartosc = 0.25;
    }

    $(this).val(wartosc.toFixed(2).replace('.', ','));
});
