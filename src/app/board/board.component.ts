import {Component} from '@angular/core';
import {Cell, CellState} from '../cell';
import { Grid } from '../grid';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  public grid: Grid;

  public boardStyle = {};

  public rowCnt = 10;
  public colCnt = 10;

  public mineCount = 15;

  public failed = false;

  public flags = 0;
  public reveals = 0;

  public timer = 0;
  public timerHandle: number | null = null;

  constructor() {
    this.grid = new Grid(this.rowCnt, this.colCnt);
    this.reset();
  }

  reset() {
    this.boardStyle = {
      'grid-template-rows': `1fr `.repeat(this.rowCnt),
      'grid-template-columns': `1fr `.repeat(this.colCnt),
      'aspect-ratio': this.colCnt / this.rowCnt,
      'font-size': "150%"
    }

    this.timer = 0;
    this.flags = 0;
    this.reveals = 0;

    if (this.timerHandle != null)
      clearInterval(this.timerHandle);

    // @ts-ignore
    this.timerHandle = setInterval(() => { this.timer += 1; }, 1000);

    if (this.rowCnt != this.grid.rowCnt || this.colCnt != this.grid.colCnt) {
      this.grid = new Grid(this.rowCnt, this.colCnt);
    }

    this.grid.generateBoard(this.mineCount);
    this.failed = false;
  }

  cellStyle(cell: Cell) {
    switch (cell.exposed) {
      case CellState.HIDDEN:
        return {
          'background-color': 'black'
        }
      case CellState.FLAGGED:
        return {
          'background-color': 'yellow'
        }
      case CellState.EXPOSED_UNREVEALED:
        return {
          'background-color': '#bdbdbd'
        }
      case CellState.FLAGGED_EXPOSED:
        if (cell.isBomb()) {
          return {
            'background-color': 'green'
          }
        } else {
          return {
            'background-color': 'yellow'
          }
        }
      case CellState.DETONATED:
        return {
          'background-color': 'red'
        }
      default:
        return {
          'background-color': 'transparent'
        }
    }
  }

  cellClick(cell: Cell) {
    if (this.failed) return;

    if (this.reveals == 0) {
      this.grid.generateBoard(this.mineCount, cell.row, cell.col);
    }

    if (cell.isRevealed())
      return;

    this.reveals++;
    if (cell.activate()) {
      this.endGame(true);
    } else {
      if (cell.isEmpty())
        this.grid.revealEmpty(cell.row, cell.col);

      this.checkVictory();
    }
  }

  endGame(fail: boolean) {
    this.timerHandle && clearInterval(this.timerHandle);
    this.failed = fail;
    this.grid.reveal();
  }

  cellRightClick(evt: any, cell: Cell) {
    evt.preventDefault();

    if (this.failed) return;

    let status = this.grid.activateFlag(cell);
    this.flags += status.addedFlags;
    if (status.failed)
      this.endGame(true);
    else
      this.checkVictory();
  }

  cellContentStyle(content: number) {
    switch (content) {
      case 1:
        return {'color': 'blue'}
      case 2:
        return {'color': 'green'}
      case 3:
        return {'color': 'red'}
      case 4:
        return {'color': 'purple'}
      case 5:
        return {'color': 'blue'}
      case 6:
        return {'color': 'green'}
      case 7:
        return {'color': 'red'}
      case 8:
        return {'color': 'purple'}
      default:
        return {'color': 'black'}
    }
  }

  private checkVictory() {
    if (this.grid.allNonMinesRevealed()) {
      this.endGame(false);
    }
  }
}
