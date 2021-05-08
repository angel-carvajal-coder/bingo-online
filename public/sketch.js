const cellSize = 50;
const columns = 10;
const rows = 3;
const socket = io();
let grid;
let speech;
let ready = false;

function setup() {
    createCanvas(cellSize * columns, cellSize * rows);//.parent('center');
    const waitingP = createP('Esperando a otro jugador...');
    const minPlayersInput = createInput(2, 'number');
    const minPlayersChangeButton = createButton('Cambiar nº mínimo de jugadores');
    createP();
    const numbersP = createP('No ha salido ningún número');
    const numbers = [];

    grid = Object.create(Grid);

    speech = new p5.Speech();
    speech.setLang('es-ES');

    minPlayersChangeButton.mousePressed(() => {
        const minPlayers = minPlayersInput.value();

        socket.emit('min-player-change', minPlayers);
    })

    socket.on('min-players', minPlayers => {
        minPlayersInput.value(minPlayers);
    });

    socket.on('next-number', nextNumber => {
        numbers.push(nextNumber);
        numbersP.html(`Número(s): ${numbers.join(", ")}`);

        speech.speak(`Siguiente número: ${nextNumber}`);
    });

    socket.on('ready', () => {
        ready = true;
        waitingP.html('');
    });

    socket.on('player-disconnect', () => {
        waitingP.html('Esperando a otro jugador...');
        grid = Object.create(Grid);
    });
}

function mousePressed() {
    grid.click(mouseX, mouseY);
}

function draw() {
    background(0);
    if (ready) {
        grid[Grid.initFunction](columns, rows, cellSize);

        grid.show();
    }
}