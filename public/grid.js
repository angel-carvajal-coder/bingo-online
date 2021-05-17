
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

                this.cells[i].push(cell);
            }
        }

        for (let j = 0; j < rows; j++) {
            let numberHaving /* can't think of a better name */ = 
                Array(columns).fill().map((_, i) => i < 5);
            
            shuffle(numberHaving, /*modify=*/true);
        
            for (let i = 0; i < columns; i++) {
                const cell = this.cells[i][j];
                cell[cell.initFunction](i, j, cellSize, numberHaving[i]);
            }
        }
        this.innited = true;
    },

    click(x, y) {
        x /= this.cellSize;
        y /= this.cellSize;
        [x, y] = [x, y].map(Math.floor);

        this.cells[x][y].mark();
    },

    toJSON() {
        return this.cells;
    },

    restore(nums) {
        let i = 0;
        for (const column of nums) {
            let j = 0;
            for (const num of column) {
                const cell = Object.create(Cell)
                cell[cell.initFunction](i, j, this.cellSize, null, num);
                j++;
            }
            i++;
        }
    },

    show() {
        for (const column of this.cells) {
            for (const cell of column) {
                cell.show();
            }
        }
    }
};