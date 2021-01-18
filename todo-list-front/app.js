var zadaci = [];
var api_route = "http://localhost/Domaci5/todo-list/api";

function citajZadatke(){
    return $.ajax({
        type: "GET",
        url: api_route + "/get_tasks.php",
        success: (result) => {
            zadaci = JSON.parse(result);
        }
    });
}

function prikaziZadatke(){
    // let tabela_body = document.getElementById('tabela_svih_body');
    let tabela_body = $('#tabela_svih_body');
    let tabela = [];

    zadaci.forEach( (zadatak, i) => {
        let zavrsen_chk = '';
        let klasa_zavrsen = '';
        if(zadatak.zavrsen){
            zavrsen_chk = 'checked';
            klasa_zavrsen = 'zavrsen';
        }
        let chk_box = `<input type="checkbox" onchange="zavrsiZadatak(${i})" ${zavrsen_chk} />`;
        let dugme_brisanje = `<button class="btn btn-sm btn-danger " onclick="ukloniZadatak(${i})" ><i class="fa fa-times"></i></button>`;
        let dugme_izmjena = `<button class="btn btn-sm btn-primary " onclick="izmijeniZadatak(${i})" ><i class="fa fa-edit"></i></button>`;
        tabela.push(`<tr id="red_${i}" class="${klasa_zavrsen}" > <td>${zadatak.id}</td><td>${zadatak.tekst}</td><td>${zadatak.opis}</td> <td>${chk_box}</td> <td>${dugme_brisanje}</td><td>${dugme_izmjena}</td> </tr>`);
    });
    tabela_body.html(tabela.join(''));
}

function generisiNoviID(){
    let max = 0;
    for(let i = 0; i < zadaci.length; i++){
        if(zadaci[i].id > max) max = zadaci[i].id;
    }
    return max+1;
}

function zavrsiZadatak(index){
    zadaci[index].zavrsen = !(zadaci[index].zavrsen);
    $.ajax({ 
        type: "POST",
        url: api_route + '/complete_task.php',
        data: { index: index, status: (zadaci[index].zavrsen) },
        success: (response) => {
            $('#red_'+index).toggleClass('zavrsen');
        }
    });
    // prikaziZadatke();
}

function ukloniZadatak(index){
    console.log(index, zadaci[index])
    if(confirm("Da li ste sigurni?")){
        $.ajax({
            type: 'GET',
            url: api_route + '/delete_task.php?id=' + zadaci[index].id,
            success: () => {
                zadaci.splice(index, 1);
                prikaziZadatke();
            }
        })
        
    }
}

function izmijeniZadatak(index){
    let zadatak = zadaci[index];
    document.getElementById('izmjena_tekst').value = zadatak.tekst;
    document.getElementById('izmjena_opis').value = zadatak.opis;
    document.getElementById('index_izmjena').value = index;
    
    $("#modal_izmjena").modal('show');
}

function isprazniPolja(tip){
    if(tip == 'izmjena'){
        document.getElementById('izmjena_tekst').value = "";
        document.getElementById('izmjena_opis').value = "";
        document.getElementById('index_izmjena').value = -1;
    }else if(tip == 'dodavanje'){
        document.getElementById('novi_zadatak_tekst').value = "";
        document.getElementById('novi_zadatak_opis').value = ""; 
    }
}

citajZadatke().then( () => {
    prikaziZadatke();
}).catch(e => {
    // console.log(e)
});

// dodavanje event listener-a
document.getElementById('dodaj_novi_forma').addEventListener('submit', function(e){
    e.preventDefault();
    let novi_tekst = document.getElementById('novi_zadatak_tekst').value;
    let novi_opis = document.getElementById('novi_zadatak_opis').value;
    let novi_zadatak = { id: generisiNoviID(), tekst: novi_tekst, opis: novi_opis, zavrsen: false };
    zadaci.push(novi_zadatak);

    $.ajax({
        type: "POST",
        url: api_route + '/add_task.php',
        data: novi_zadatak,
        success: (result) => {
            if(result == "OK"){
                prikaziZadatke();
                $("#modal_dodavanje").modal('hide');
                isprazniPolja('dodavanje');
            }else{
                alert(result);
            }
        }    
    });

});

document.getElementById('izmjena_zadatka_forma').addEventListener('submit', function(e){
    e.preventDefault();
    let index = document.getElementById('index_izmjena').value;
    zadaci[index].tekst = document.getElementById('izmjena_tekst').value;
    zadaci[index].opis = document.getElementById('izmjena_opis').value;

    $.ajax({
        type: "POST",
        url: api_route + "/edit_task.php",
        data: {id: zadaci[index].id, tekst: zadaci[index].tekst, opis: zadaci[index].opis} ,
        success: res => {
            prikaziZadatke();
            $("#modal_izmjena").modal('hide');
            isprazniPolja('izmjena');
        }
    })

});



document.getElementById('pretraga_tekst').addEventListener('input', e => {
    let zadaciSearch = zadaciFilter()

    filterTable(zadaciSearch)
})

document.getElementById('pretraga_opis').addEventListener('input', e => {
    let zadaciSearch = zadaciFilter()

    filterTable(zadaciSearch)
})

document.getElementById('pretraga_zavrsen').addEventListener('change', e => {
    let zadaciSearch = zadaciFilter()

    filterTable(zadaciSearch)
})


function zadaciFilter() {
    let tekst2 = $('#pretraga_tekst').val() ? $('#pretraga_tekst').val() : ''
    let opis2 = $('#pretraga_opis').val() ? $('#pretraga_opis').val() : ''
    let zavrsen2 = $('#pretraga_zavrsen').val()

    const zadaciSearch = zadaci.filter( el => {
        let tekstt = el.tekst
        let opiss = el.opis
        let zavrsenn = el.zavrsen

        if(tekstt.includes(tekst2) && opiss.includes(opis2)) {
            if(zavrsen2 === '0' && !zavrsenn) {
                return el
            }
    
            if(zavrsen2 === '1' && zavrsenn) {
                return el
            }
    
            if(zavrsen2 === '2') {
                return el
            }
        }
    })

    return zadaciSearch
}


function filterTable(array) {
    let tabela_body = $('#tabela_svih_body');
    let tabela = [];

    array.forEach( (zadatak, i) => {
        let zavrsen_chk = '';
        let klasa_zavrsen = '';
        if(zadatak.zavrsen){
            zavrsen_chk = 'checked';
            klasa_zavrsen = 'zavrsen';
        }
        let chk_box = `<input type="checkbox" onchange="zavrsiZadatak(${i})" ${zavrsen_chk} />`;
        let dugme_brisanje = `<button class="btn btn-sm btn-danger " onclick="ukloniZadatak(${i})" ><i class="fa fa-times"></i></button>`;
        let dugme_izmjena = `<button class="btn btn-sm btn-primary " onclick="izmijeniZadatak(${i})" ><i class="fa fa-edit"></i></button>`;
        tabela.push(`<tr id="red_${i}" class="${klasa_zavrsen}" > <td>${zadatak.id}</td><td>${zadatak.tekst}</td><td>${zadatak.opis}</td> <td>${chk_box}</td> <td>${dugme_brisanje}</td><td>${dugme_izmjena}</td> </tr>`);
    });
    tabela_body.html(tabela.join(''));
}