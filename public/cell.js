const Cell = {
    initFunction: "init",
    
    init(x, y, w) {
        this.x = x;
        this.y = y;
        this.size = w;
        this.number = null;

        // 1/3 chance
        if (random(1) < 0.33) {
            this.number = x * 10 + floor(random(0, 10));
        }
    },

    show() {
        let numberExists = true;
        const [x, y] = [this.x * this.size, this.y * this.size]
        noFill();
        stroke(255);
        strokeWeight(4);

        square(x, y, this.size);

        
        // Check if the cell has a number
        this.number ?? (numberExists = false);
        
        if (numberExists) {
            // console.log(`[${this.x}, ${this.y}] Number: ${this.number}`);
            fill(255);
            textAlign(CENTER, CENTER);
            textSize(this.size - 20);
            textStyle(NORMAL);
            text(this.number, x + this.size / 2, y + this.size / 2);
        } else {
            // console.log(`[${this.x}, ${this.y}] No number`);
        }
    }
};