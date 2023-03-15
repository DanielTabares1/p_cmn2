const socket = io();
console.log("Socket: ", socket);

const urlParams = new URLSearchParams(window.location.search);
const player1 = urlParams.get('player1');
const player2 = urlParams.get('player2');
const player1Nombre = urlParams.get('player1Nombre');
const player2Nombre = urlParams.get('player2Nombre');
let turno = urlParams.get('turno') == 'true' ? true : false;
let aux = turno ? 1 : 2;

document.getElementById('player1-name').innerText = player1Nombre;
document.getElementById('player2-name').innerText = player2Nombre;

let vista_preguntas = document.getElementById('cuadro-preguntas');

if(!turno) {
    vista_preguntas.classList = 'preguntas-false';   
}

const character_list = [
    { name: 'John', hair_style: 'short', hair_color: 'brown', eye_color: 'blue', hat: false, shirt: 'red', skin: 'light' },
    { name: 'Mary', hair_style: 'long', hair_color: 'blonde', eye_color: 'brown', hat: true, shirt: 'blue', skin: 'light' },
    { name: 'Jack', hair_style: 'short', hair_color: 'black', eye_color: 'brown', hat: false, shirt: 'green', skin: 'dark' },
    { name: 'Sally', hair_style: 'long', hair_color: 'black', eye_color: 'blue', hat: true, shirt: 'yellow', skin: 'dark' },
    { name: 'Bob', hair_style: 'short', hair_color: 'blonde', eye_color: 'blue', hat: false, shirt: 'red', skin: 'light' },
    { name: 'Sue', hair_style: 'long', hair_color: 'blonde', eye_color: 'brown', hat: false, shirt: 'blue', skin: 'light' },
    { name: 'Joe', hair_style: 'long', hair_color: 'black', eye_color: 'brown', hat: false, shirt: 'green', skin: 'dark' },
    { name: 'Jane', hair_style: 'long', hair_color: 'black', eye_color: 'blue', hat: false, shirt: 'red', skin: 'dark' },
    { name: 'Bill', hair_style: 'short', hair_color: 'brown', eye_color: 'blue', hat: false, shirt: 'red', skin: 'dark' },
    { name: 'Sarah', hair_style: 'long', hair_color: 'blonde', eye_color: 'brown', hat: true, shirt: 'yellow', skin: 'light' },
    { name: 'Tom', hair_style: 'short', hair_color: 'black', eye_color: 'brown', hat: true, shirt: 'green', skin: 'dark' },
    { name: 'Alice', hair_style: 'short', hair_color: 'blonde', eye_color: 'blue', hat: true, shirt: 'yellow', skin: 'dark' },
    { name: 'Steve', hair_style: 'short', hair_color: 'brown', eye_color: 'blue', hat: false, shirt: 'green', skin: 'light' },
    { name: 'Linda', hair_style: 'long', hair_color: 'blonde', eye_color: 'blue', hat: true, shirt: 'blue', skin: 'light' },
    { name: 'Harry', hair_style: 'short', hair_color: 'black', eye_color: 'brown', hat: false, shirt: 'blue', skin: 'dark' },
    { name: 'Betty', hair_style: 'short', hair_color: 'black', eye_color: 'blue', hat: true, shirt: 'yellow', skin: 'light' },
];

const question_list = [
    { atributo: "hair_style", pregunta: "¿Tiene el cabello largo?" },
    { atributo: "hair_color", pregunta: "¿De qué color tiene el cabello?" },
    { atributo: "eye_color", pregunta: "¿De qué color son los ojos?" },
    { atributo: "hat", pregunta: "¿El personaje tiene sombrero?" },
    { atributo: "shirt", pregunta: "¿De qué color es la camiseta?" },
    { atributo: "skin", pregunta: "¿Qué tono de piel tiene?" }
]

character_list.forEach(character => {
    let nombre = character.name;
    let imagen = nombre + '.png';

    let contenedor = document.getElementById('cuadro-personajes');

    contenedor.appendChild(document.createElement('div')).innerHTML = `
        <div class="cuadro-personaje">
            <img src="images/${imagen}" alt="${nombre}" class="img-personaje">
            <button class="btn-personaje" onclick="seleccionarPersonaje('${nombre}')">${nombre}</button>
        </div>
    `;
});

question_list.forEach(pregunta => {
    let contenedor = document.getElementById('cuadro-preguntas');
    let atributo = pregunta.atributo;
    contenedor.appendChild(document.createElement('div')).innerHTML = `
        <h4 class="pregunta" onclick="resolverAtributo('${atributo}');">${pregunta.pregunta}</h4>
    `;
});

function resolverAtributo(atributo) {    
    let playerAux = aux == 1 ? player2 : player1;
    let personaje = character_list.find(x => x.name == playerAux)
    respuesta = personaje[atributo]     
    alert(respuesta)   
    actualizar() 
}

function seleccionarPersonaje(nombre){
    console.log('Adivinando personaje...')
    let playerAux = aux == 1 ? player2 : player1;
    if(nombre == playerAux) {
        win()
    }
    actualizar()
}

function cambiarTurno() {
    turno = !turno;    
}

function actualizar() {   
    socket.emit('actualizar', !turno);
    console.log('actualizar');
}

socket.on('actualizar-nuevo-turno', ( turno_p ) => {
    console.log('actualizar-nuevo-turno');
    if(turno) {
        turno = false;
        vista_preguntas.classList = 'preguntas-false';
    } else {
        turno = true;
        vista_preguntas.classList = 'preguntas';
    }
});

function win() {
    let playerAux = aux == 1 ? player1Nombre : player2Nombre;
    socket.emit('win', playerAux);
}

socket.on('game-over', ( ganador ) => {
    alert('Ganó ' + ganador);
    window.location.href = `/`;
});

