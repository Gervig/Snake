export default class Grid {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.arr = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => 0)
    );
  }

  set({ row, col }, value) {
    this.arr[row][col] = value;
  }

  get({ row, col }) {
    return this.arr[row][col];
  }

  // flatten 2D array, så fx:
  //   Row  	Col	  Index
  //   0	    0	      0
  //   0	    1	      1
  //   0	    2	      2
  //   1	    0	      3
  //   1	    1	      4
  //   1	    2	      5

  // kan bruges til indexFor() & rowColFor()

  // returnerer index (nummeret) på cellen i denne række+kolonne
  indexFor({ row, col }) {
    return row * this.cols + col;
  }

  // returnerer et {row, col} objekt for cellen med dette index (nummer)
  rowColFor(index) {
    const row = Math.floor(index / this.cols);
    const col = index % this.cols;
    return { row, col };
  }

  // returnerer en liste over alle naboceller til denne (i form af {row, col} objekter
  neighbours({ row, col }) {
    const n = this.north({ row, col });
    const s = this.south({ row, col });
    const w = this.west({ row, col });
    const e = this.east({ row, col });

    const nw = this.west(n);
    const ne = this.east(n);
    const sw = this.west(s);
    const se = this.east(s);

    return [nw, n, ne, w, e, sw, s, se];
  }

  // returnerer en liste over alle nabocellers values.
  // Når der skal returneres en celle, er det i form at et objekt med `{row, col, value}`
  neighboursValues({ row, col }) {
    const neighbours = this.neighbours({ row, col });

    const values = [];
    for (let n of neighbours) {
      if (n) {
        // skip out-of-bounds
        values.push(this.arr[n.row][n.col]);
      }
    }
    return values;
  }

  // retunere cellen i en retning, undefined hvis der ikke er nogen
  north({ row, col }) {
    if (row - 1 < 0) return undefined;
    return { row: row - 1, col };
  }

  south({ row, col }) {
    if (row + 1 >= this.rows) return undefined;
    return { row: row + 1, col };
  }

  west({ row, col }) {
    if (col - 1 < 0) return undefined;
    return { row, col: col - 1 };
  }

  east({ row, col }) {
    if (col + 1 >= this.cols) return undefined;
    return { row, col: col + 1 };
  }

  // har vi virkelig brug for dem her? grid.rows er det samme some grid.rows()?
  // Samme med cols, virker bare forvirrende
  rows() {
    return this.rows;
  }

  cols() {
    return this.cols;
  }

  // returnerer det samlede antal celler
  size() {
    return this.rows * this.cols;
  }

  // skriver den angivne value ind i alle celler
  fill(value) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.arr[i][j] = value;
      }
    }
  }

  clear() {
    this.arr = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => 0)
    );
  }

  clone() {
    const newGrid = new Grid(this.rows, this.cols);
    newGrid.arr = this.arr.map((row) => [...row]);
    return newGrid;
  }
}
