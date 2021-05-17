const cellSize = 50;
const columns = 10;
const rows = 3;
const socket = io();
let grid;
let speech;
let ready = false;
let isFirstFrame = true;

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
        const previousBoard = sessionStorage.getItem('board');
        if (previousBoard) {
            grid.restore(JSON.parse(previousBoard));
        }
    });

    socket.on('player-disconnect', () => {
        waitingP.html('Esperando a otro jugador...');
        sessionStorage.removeItem('board');
        location.reload();
    });

    createChat(socket);

    if (localStorage.getItem('name') == null)
        localStorage.setItem('name', prompt('¿Cómo te llamas?'));
    socket.emit('player-name', localStorage.getItem('name'));

    createSpan(`\t(${localStorage.getItem('name')})`)
        .parent(select('h2'));

    const previousBoard = sessionStorage.getItem('board');
    if (previousBoard) {
        grid.restore(JSON.parse(previousBoard));
    } else {
        sessionStorage.setItem('board', JSON.stringify(grid))
    }
}

function mousePressed() {
    grid.click(mouseX, mouseY);
}

function draw() {
    background(0);
    if (ready) {
        if (isFirstFrame) {
            grid[Grid.initFunction](columns, rows, cellSize);
            isFirstFrame = false;
        }

        grid.show();
    }
}