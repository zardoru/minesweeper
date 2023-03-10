import { Cell, CellState } from "./cell";

export class Grid {
  private readonly grid: Cell[][];

  public colCnt = 16;
  public rowCnt = 16;

  public mineCount = 0;

  constructor(rows: number, cols: number) {
    this.colCnt = cols;
    this.rowCnt = rows;

    this.grid = this.makeGrid(rows, cols);

    let randCount = Math.floor(Math.random() * rows * cols / 5.);
    let mineCount = Math.min(Math.max(20, randCount), (rows - 1) * (cols - 1));
    this.generateBoard(mineCount);
  }

  getCell(row: number, col: number): Cell {
    return this.grid[row][col];
  }

  reset() {
    for (let row = 0; row < this.rowCnt; row++) {
      for (let col = 0; col < this.colCnt; col++) {
        this.grid[row][col].reset();
      }
    }
  }

  generateBoard(mineCount: number, row: number | null = null, col: number | null = null) {
    for (let row = 0; row < this.rowCnt; row++) {
      for (let col = 0; col < this.colCnt; col++) {
        this.grid[row][col].reset();
      }
    }

    if (mineCount < 0) {
      mineCount = Math.max( 10, Math.floor(Math.random() * (this.rowCnt - 1) * (this.colCnt - 1)) );
    }

    this.mineCount = mineCount;

    this.placeMinesRandomly(row, col);

    this.calculateCellAdjacencies();
  }

  private placeMinesRandomly(row: number | null, col: number | null) {
    for (let i = 0; i < this.mineCount; i++) {

      /* it is possible to loop forever if minecount >= rowCnt * colCnt */
      while (true) {
        let attemptRow = Math.floor(Math.random() * this.rowCnt);
        let attemptCol = Math.floor(Math.random() * this.colCnt);

        let prohibitedRow = row != null ? row == attemptRow : false;
        let prohibitedCol = col != null ? col == attemptCol : false;
        let prohibit = prohibitedCol && prohibitedRow;

        if (!this.grid[attemptRow][attemptCol].isBomb() && !prohibit) {
          this.grid[attemptRow][attemptCol].makeBomb();
          break;
        }
      }
    }
  }

  public calculateCellAdjacencies() {
    for (let row = 0; row < this.rowCnt; row++) {
      for (let col = 0; col < this.colCnt; col++) {
        if (this.grid[row][col].isBomb()) continue;

        let count = this.getAdjacencyCount(row, col);
        this.grid[row][col].setAdjacentCount(count);
      }
    }
  }

  makeGrid(row: number, col: number): Cell[][] {
    return new Array(row).fill(0).map((_, r) => new Array(col).fill(0).map((_, c) => new Cell(r, c)));
  }

  public printBoard(keepBombsHidden: boolean) {
    let boardstr = "\n";
    for (let row = 0; row < this.rowCnt; row++) {
      let rowstr = ""
      for (let col = 0; col < this.colCnt; col++) {
        const c = this.getCell(row, col);
        switch (c.content) {
          case -1:
            if (keepBombsHidden && !c.isRevealed())
              rowstr += '???';
            else
              rowstr += 'B';
            break;
          default:
            if (c.isRevealed())
            {
              if (c.content == 0)
                rowstr += '.';
              else
                rowstr += c.content;
            } else {
              rowstr += '???';
            }
        }
      }
      boardstr += rowstr + "\n";
    }

    console.log(boardstr);
  }

  cols(): number {
    return this.colCnt
  }

  rows(): number {
    return this.rowCnt
  }

  private *surrounding(row: number, col: number): Generator<Cell> {
    for (let rowOffs = -1; rowOffs <= 1; rowOffs++) {
      for (let colOffs = -1; colOffs <= 1; colOffs++) {
        let chkRow = row + rowOffs;
        let chkCol = col + colOffs;

        /* is the current cell */
        if (rowOffs == colOffs && rowOffs == 0) continue;

        /* out of bounds */
        if (chkRow >= this.rowCnt || chkRow < 0) continue;
        if (chkCol >= this.colCnt || chkCol < 0) continue;

        yield this.grid[chkRow][chkCol];
      }
    }
  }

  private getAdjacencyCount(row: number, col: number) {
    let count = 0;
    [...this.surrounding(row, col)].forEach(c => {
      if (c.isBomb()) {
        count++;
      }
    });
    return count;
  }

  reveal() {
    for (let row = 0; row < this.rowCnt; row++) {
      for (let col = 0; col < this.colCnt; col++) {
        let cell = this.grid[row][col];
        if (cell.exposed == CellState.HIDDEN)
          cell.exposed = CellState.EXPOSED_UNREVEALED;
        if (cell.exposed == CellState.FLAGGED)
          cell.exposed = CellState.FLAGGED_EXPOSED;
      }
    }
  }

  /* returns: number of flags to add or remove */
  chord(row: number, col: number): { addedFlags: number, failed: boolean } {
    let c = this.grid[row][col];

    if (!c.isNumberCell()) return { addedFlags: 0, failed: false };

    let unrevealed = 0;
    let surroundingFlags = 0;
    let surrounding = [... this.surrounding(row, col)];
    surrounding.forEach(c => {
      if (!c.isRevealed()) unrevealed++;
      if (c.isFlagged()) surroundingFlags++;
    })

    let addedFlags = 0;
    let failed = false

    /* no reveladas = contenido */
    if (unrevealed == c.content) {
      surrounding.forEach(c => {
        if (!c.isRevealed() && !c.isFlagged()) {
          c.flag()
          addedFlags += 1;
        }
      });
    /* no reveladas sin bandera == numero actual */
    } else if (surroundingFlags == c.content) {
      surrounding.forEach(c => {
        if (!c.isFlagged() && !c.isRevealed()) {
          if (c.activate())
            failed = true;
          if (c.isEmpty())
            this.revealEmpty(c.row, c.col);
        }
      });
    }

    return { addedFlags, failed };
  }

  allNonMinesRevealed(): boolean {
    let revealed = 0
    for (let row = 0; row < this.rowCnt; row++) {
      for (let col = 0; col < this.colCnt; col++) {
        let cell = this.grid[row][col];
        if (cell.isRevealed())
          revealed++;
      }
    }

    return (revealed + this.mineCount) == (this.rowCnt * this.colCnt);
  }

  revealEmpty(row: number, col: number) {
    if (row < 0 || col < 0) return;

    if (this.grid[row][col].isNumberCell())
      return;

    [... this.surrounding(row, col)].forEach(c => {
      if (c.isRevealed()) return;

      if (!c.isBomb()) {
        c.activate();

        this.revealEmpty(c.row, c.col);
      }
    })
  }

  activateFlag(cell: Cell): { addedFlags: number, failed: boolean } {
    if (cell.isRevealed()) {
      return this.chord(cell.row, cell.col);
    } else {
       return { addedFlags: cell.flag(), failed: false }
    }
  }

  cells(): Cell[] {
    return this.grid.flat();
  }
}
