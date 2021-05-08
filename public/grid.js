
const Grid = {
    cells: [],
    initFunction: "init",
    initted: false,

    init(columns, rows, cellSize) {
        if (this.innited) return;
        this.columns = columns;
        this.rows = rows;
        this.cellSize = cellSize;
        for (let i = 0; i < columns; i++) {
            this.cells.push([])
            for (let j = 0; j < rows; j++) {
                const cell = Object.create(Cell);
                cell[cell.initFunction](i, j, cellSize);

                this.cells[i].push(cell);
            }
        }
        this.innited = true;
    },

    show() {
        for (const column of this.cells) {
            for (const cell of column) {
                cell.show();
            }
        }
    }
};