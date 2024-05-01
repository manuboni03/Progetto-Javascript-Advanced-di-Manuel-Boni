# ***Progetto Javascript Advanced***

## Ecco il mio terzo progetto
___

In questo progetto ho creato una pagina nella quale possiamo cercare il nostro libro preferito attraverso la [Open Library](https://openlibrary.org) 
Per provare quest'app clicca sul seguente collegamento ---> [Progetto](https://manuboni03.github.io/Progetto-Javascript-Advanced-di-Manuel-Boni/index.html) 

## Introduttiva
___

La pagina si sviluppa in 2 fasi:
1) Ricerca tramite un form-control della categoria a cui appartiene il libro
2) click sul button del libro che vogliamo cercare

Tutto questo per arrivare a leggere la **description** del nostro libro.

Per realizzare questo progetto ho utilizzato i seguenti linguaggi:
- **HTML**
- **CSS**
- **Javascript**

Mentre per quanto riguarda le librerie invece ho usato:
- [Bootstrap](https://getbootstrap.com/)

## Come funziona
___

Essendo *HTML* e *CSS* linguaggi di **markup**, mi soffermerò prettamente sulla spiegazione del funzionamento del codice ***Javascript***

Innanzitutto per interagire con l'altra pagina devo inoltrare una richiesta, inizializzata in questo modo:

```Javascript
let request = new XMLHttpRequest();
```

In seguito ho selezionato i nodi del form i quali mi serviranno dopo per estrapolare la categoria inserita dall'utente:

```Javascript
const form = document.forms.form;
const formElem = form.elements.cercalibro;
```

Poi ho impostato un *listener di eventi*, in particolare quello dell'invio del form:

```Javascript
form.onsubmit = function (e) {
    if (formElem.value === '') {  //se il campo d'immissione è vuoto emette l'alert al suo interno
        e.preventDefault();
        alert('devi inserire la categoria da cercare');
    }
    else{  //se invece l'utente ha digitato qualcosa inizia il processo
        e.preventDefault();  //questa istruzione previene il default, ovvero l'aggiornamento automatico del form in cui viene tolto ciò che abbiamo immesso

        request.open('GET', `https://openlibrary.org/subjects/${formElem.value}.json`);  //specifico il tipo della richiesta (voglio prendere dei valori)
        request.responseType = 'json';
        request.send();  //qui inoltro la richiesta

        request.onload = function(){  //imposto il listener sulla richiesta, cioè quando essa è stata processata e completata
            let risposta = request.response;  //acquisisco le informazioni (object) e le assegno in una variabile

            arrWorks = risposta.works;  //le informazioni di cui ho bisogno sono contenute in un array, perciò creo una variabile su cui lavorare
            form.appendChild(elencoLibri);  //appendo un nuovo nodo nel DOM che mi servirà poi per l'elenco dei button
            let x = 0;  //inizializzo un contatore che mi servirà per fare il "console.log" dei titoli
            for (let i = 0; i < arrWorks.length; ++i){  //loop di analisi per l'array
                let author = arrWorks[i].authors;  //ogni indice dell'array ha un oggetto al suo interno quindi devo creare variabili sottostanti per suddividere le info
                ++x; //cosi parte da 1 e non da 0
                console.log(`${x} titolo: ${arrWorks[i].title}`);  //verifico che tutti i titoli siano stati immagazzinati nel mio array

                creaElencoLibri(arrWorks[i].title);  //funzione che crea nuovi nodi "button" con i titoli dei libri sotto forma di elenco (quello precedente)

                for (let k = 0; k < author.length; ++k){
                    creaElencoAutori(author[k].name, arrWorks[i].title);  //altro loop con la funzione che immette nei button precedenti anche gli autori dei libri
                }
            }
        };     
    }
}
```

Le funzioni ***creaElencoLibri(mapLibri.get(arrWorks[i].key));*** e ***creaElencoAutori(author[k].name, arrWorks[i].title);*** sono queste:

```Javascript
function creaElencoLibri(membroElenco){
    elencoLibri.classList.add('row');
    let membroLista = document.createElement('button');
    membroLista.id = `${membroElenco}`;
    membroLista.innerHTML = `<strong>${membroElenco}</strong>`;
    membroLista.classList.add('btn');
    membroLista.style.fontSize = '15px';
    membroLista.style.width = '200px'
    membroLista.style.fontFamily = 'Arial, Helvetica, sans-serif';
    membroLista.style.padding = '10px 0 10px 0';
    membroLista.style.margin = '15px 0 15px 10px';
    membroLista.style.border = '1px groove darkcyan';
    elencoLibri.appendChild(membroLista);
}

function creaElencoAutori(nomeAutore, nomeLibro){
    let autorelista = document.createElement('li');
    autorelista.textContent = `${nomeAutore}`;
    autorelista.style.fontFamily = 'Arial, Helvetica, sans-serif';
    let libro = document.getElementById(`${nomeLibro}`);
    libro.appendChild(autorelista);
}
```

Per i **button** invece ho creato un altro *listener*:

```Javascript
elencoLibri.onclick = function(e){
    e.preventDefault();

    let target = e.target.closest('button').id;   //ottengo l'id del button che va a cliccare l'utente 
    let itemButton = arrWorks.find(item => item.title == target);  //verifico scorrendo i titoli dell'array quale ho selezionato
    let key = itemButton.key;  //ottengo la key corrispondente al titolo (mi servirà per cercare la description
    console.log(`il titolo da te selezionato è: ${target}`);  //verifico se il titolo è giusto
    console.log(`la key del libro selezionato è: ${key}`);  //mostro la sua chiave
    
    let URLdescription = new URL(`https://openlibrary.org${key}.json`);  //parametro di ricerca specifico del libro
    console.log(`cerco la descrione all'indirizzo: ${URLdescription}...`);  //verifico la correttezza del URL creato

    rimuoviElenco();  // rimuovo l'elenco dei button

    //qui riformulo (su modello precedente) la request per ottenere la descrizione del libro
    request.open('GET', URLdescription);
    request.responseType = 'json';
    request.send();

    request.onload = function(){
        let risposta = request.response;
        let descrizione = risposta.description;
        console.log('trovata!');

        if (typeof descrizione === 'object'){  //qui verifico che 'description' sia o un oggetto o una chiave di un oggetto
            console.log(`La descrizione del libro è: ${descrizione.value}`);  //nel caso si un oggetto vado a prendere il suo 'value'
            aggiungiDescription(descrizione.value);
        }
        else{
            console.log(`La descrizione del libro è: ${descrizione}`);  //altrimenti ci lavoro come stringa prendendo il suo valore effettivo
            aggiungiDescription(descrizione);
        }
    } 
    } 
};
```

Le due funzioni alle righe 118/119 fanno in modo che la prima, *rimuoviElenco*, rimuova tutti i button presenti finora nella pagina, mentre l'altra 
aggiunge la descrizione del libro selezionato; le due funzioni sono implementate in questo modo:

```Javascript
function rimuoviElenco(){
    elencoLibri.remove();
    inizioElenco.remove();
}

function stileDescription(div, intestazione, testo){
    div.style.padding = '30px 0 10px 0';
    div.classList.add('container');  //aggiungo questa classe presa dalla libreria Bootstrap per fare coprire al testo la massima larghezza per ogni tipo di dispositivo

    intestazione.style.fontSize = '25px';
    intestazione.style.fontFamily = 'Arial, Helvetica, sans-serif';
    intestazione.style.color = 'darkcyan';

    testo.style.fontSize = '18px';
    testo.style.fontFamily = 'Arial, Helvetica, sans-serif';
    testo.style.color = 'black';
}

function aggiungiDescription(textDescription){
    let divDescription = document.createElement('div');
    let inizioDescription = document.createElement('h3');
    inizioDescription.textContent = 'Descrizione del libro';
    let text = document.createElement('p');
    text.textContent = textDescription;
    divDescription.appendChild(inizioDescription);
    divDescription.appendChild(text);

    stileDescription(divDescription, inizioDescription, text);

    form.append(divDescription);
}
```

Inoltre ho aggiunto un button che tramite un listener di eventi permette di aggiornare la pagina:

```Javascript
let refresh = document.querySelector('#riaggiorna');  //seleziono il nodo che è già presente nel HTML

refresh.onclick = function(e){
    window.locator.reload();  //permette di aggiornare l'intera pagina web
}
```

## Uso
___

La pagina si presenta con un campo di immissione di testo in cui bisogna inserire la categoria del libro, poi una volta premuto *invio* appariranno 
sotto dei button (uno per ogni libro) in cui saranno specificati sia il nome del libro che l'autore/gli autori che lo hanno scritto. 
Infine apparirà la description del libro al posto dei button

## Contatto 

___


Per qualsiasi problema, chiarimento o informazioni puoi contattarmi qui:

- La mia pagina web:
[Vai alla mia pagina](https://manuboni03.github.io/Progetto-HTML-e-CSS-di-Manuel-Boni/sito.html)

- Il mio indirizzo email:
manuelboni2904@gmail.com

Per dare un'occhiata ai miei progetti visita il mio profilo Git:
[Github](https://github.com/manuboni03)





