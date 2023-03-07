export enum CellState {
  HIDDEN,
  FLAGGED,
  EXPOSED,
  EXPOSED_UNREVEALED, /* it is exposed but it wasn't revealed by the player*/
  DETONATED,
  FLAGGED_EXPOSED
}

export class Cell {
  public exposed: CellState = CellState.HIDDEN;

  // -1: bomb, 0: do not display text, any other number: display the number
  public content: number = 0;

  public row = 0;
  public col = 0;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  isNumberCell(): boolean {
    return this.content > 0;
  }

  isFlagged(): boolean {
    return this.exposed == CellState.FLAGGED;
  }

  isEmpty(): boolean {
    return this.content == 0;
  }

  isRevealed() {
    return this.exposed > CellState.FLAGGED;
  }

  isBomb() {
    return this.content == -1;
  }

  makeBomb() {
    this.content = -1;
  }

  setAdjacentCount(n: number) {
    this.content = n;
  }

  flag(): number {
    if (this.exposed == CellState.HIDDEN) {
      this.exposed = CellState.FLAGGED;
      return 1;
    }
    else if (this.exposed == CellState.FLAGGED) {
      this.exposed = CellState.HIDDEN;
      return -1;
    }

    return 0;
  }

  activate(): boolean {
    if (this.exposed == CellState.HIDDEN) {
      this.exposed = CellState.EXPOSED;

      if (this.isBomb()) {
        this.exposed = CellState.DETONATED;
        return true;
      }
    }

    return false;
  }

  reset() {
    this.exposed = CellState.HIDDEN;
    this.content = 0;
  }
}
