

const form = document.forms.form;
const formElem = form.elements.cercalibro;
let submit = document.querySelector('#pulsanteinvio');
let refresh = document.querySelector('#riaggiorna');
let elencoLibri = document.createElement('form');
let inizioElenco = document.getElementById('terzolabel');

let request = new XMLHttpRequest();

function stileMembroLista(elementoLista){
    elementoLista.classList.add('btn');
    elementoLista.style.fontSize = '15px';
    elementoLista.style.width = '200px'
    elementoLista.style.fontFamily = 'Arial, Helvetica, sans-serif';
    elementoLista.style.padding = '10px 0 10px 0';
    elementoLista.style.margin = '15px 0 15px 10px';
    elementoLista.style.border = '1px groove darkcyan';
}

function creaElencoLibri(membroElenco){
    elencoLibri.classList.add('row');
    let membroLista = document.createElement('button');
    membroLista.id = `${membroElenco}`;
    membroLista.innerHTML = `<strong>${membroElenco}</strong>`;
    stileMembroLista(membroLista);
    elencoLibri.appendChild(membroLista);
}

function creaElencoAutori(nomeAutore, nomeLibro){
    let autorelista = document.createElement('li');
    autorelista.textContent = `${nomeAutore}`;
    autorelista.style.fontFamily = 'Arial, Helvetica, sans-serif';
    let libro = document.getElementById(`${nomeLibro}`);
    libro.appendChild(autorelista);
}

let arrWorks;

form.onsubmit = function (e) {
    if (formElem.value === '') {
        e.preventDefault();
        alert('devi inserire la categoria da cercare');
    }
    else{
        e.preventDefault();

        let titolo = formElem.value;
        titolo = titolo.toLowerCase();
        request.open('GET', `https://openlibrary.org/subjects/${titolo}.json`);
        request.responseType = 'json';
        request.send();

        request.onload = function(){
            let risposta = request.response;

            arrWorks = risposta.works;
            form.appendChild(elencoLibri);
            let x = 0;
            for (let i = 0; i < arrWorks.length; ++i){
                let author = arrWorks[i].authors;
                ++x;
                console.log(`${x} titolo: ${arrWorks[i].title}`);
                creaElencoLibri(arrWorks[i].title);
                for (let k = 0; k < author.length; ++k){
                    creaElencoAutori(author[k].name, arrWorks[i].title);
                }
            }
        };
    }
};

function rimuoviElenco(){
    elencoLibri.remove();
    inizioElenco.remove();
}

function stileDescription(div, intestazione, testo){
    div.style.padding = '30px 0 10px 0';
    div.classList.add('container');

    intestazione.style.fontSize = '25px';
    intestazione.style.fontFamily = 'Arial, Helvetica, sans-serif';
    intestazione.style.color = 'darkcyan';

    testo.style.fontSize = '18px';
    testo.style.fontFamily = 'Arial, Helvetica, sans-serif';
    testo.style.color = 'black';
}

function aggiungiDescription(textDescription){
    let divDescription = document.querySelector('.descrizione');
    let inizioDescription = document.createElement('h3');
    inizioDescription.textContent = 'Descrizione del libro';
    let text = document.createElement('p');
    text.textContent = textDescription;
    divDescription.appendChild(inizioDescription);
    divDescription.appendChild(text);

    stileDescription(divDescription, inizioDescription, text);

    form.append(divDescription);
}

elencoLibri.onclick = function(e){
    e.preventDefault();

    let target = e.target.closest('button').id;
    let itemButton = arrWorks.find(item => item.title == target);
    let key = itemButton.key;
    console.log(`il titolo da te selezionato è: ${target}`);
    console.log(`la key del libro selezionato è: ${key}`);
    
    let URLdescription = new URL(`https://openlibrary.org${key}.json`);
    console.log(`cerco la descrione all'indirizzo: ${URLdescription}...`);

    rimuoviElenco();

    request.open('GET', URLdescription);
    request.responseType = 'json';
    request.send();

    request.onload = function(){
        let risposta = request.response;
        let descrizione = risposta.description;
        console.log('trovata!');

        if (typeof descrizione === 'object'){
            console.log(`La descrizione del libro è: ${descrizione.value}`);
            aggiungiDescription(descrizione.value);
        }
        else{
            console.log(`La descrizione del libro è: ${descrizione}`);
            aggiungiDescription(descrizione);
        }
    } 
};

refresh.onclick = function(e){
    window.location.reload();
};