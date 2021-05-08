const cellSize = 50;
const columns = 10;
const rows = 3;
const socket = io();
let ready = false;

function setup() {
    createCanvas(cellSize * columns, cellSize * rows);//.parent('center');
    const waitingP = createP('Esperando a otro jugador...');
    const minPlayersInput = createInput(2, 'number');
    const minPlayersChangeButton = createButton('Cambiar nº mínimo de jugadores');

    minPlayersChangeButton.mousePressed(() => {
        const minPlayers = minPlayersInput.value();

        socket.emit('min-player-change', minPlayers);
    })

    socket.on('min-players', minPlayers => {
        minPlayersInput.value(minPlayers);
    });

    socket.on('ready', () => {
        ready = true;
        waitingP.html('');
    });

    socket.on('player-disconnect', () => {
        ready = false;
        waitingP.html('Esperando a otro jugador...');
    });
}

function draw() {
    background(0);
    if (ready) {
        Grid[Grid.initFunction](columns, rows, cellSize);

        Grid.show();
    }
}