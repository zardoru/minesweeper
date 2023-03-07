import { Component, Input } from '@angular/core';
import {BoardComponent} from "../board/board.component";

interface BoardConfig {
  rowCnt: number,
  colCnt: number,
  mineCount: number;
}



@Component({
  selector: 'app-options-modal',
  templateUrl: './options-modal.component.html',
  styleUrls: ['./options-modal.component.css']
})
export class OptionsModalComponent {
  visible: boolean = false;

  @Input()
  board: BoardComponent | null = null;

  show() {
    this.visible = true;
  }

  changedDifficulty($event: Event) {
    if ($event.target == null || this.board == null) return;

    let v: number = Number((<HTMLSelectElement>$event.target).value);
    let board = this.board;

    switch (v) {
      case 0:
        board.rowCnt = 8;
        board.colCnt = 8;
        board.mineCount = 10;
        break;
      case 1:
        board.rowCnt = 9;
        board.colCnt = 9;
        board.mineCount = 10;
        break;
      case 2:
        board.rowCnt = 16;
        board.colCnt = 16;
        board.mineCount = 40;
        break;
      case 3:
        board.rowCnt = 16;
        board.colCnt = 30;
        board.mineCount = 99;
        break;
      case 4:
        board.rowCnt = 24;
        board.colCnt = 30;
        board.mineCount = -1; // autogenerate, see grid.ts
        break;
    }

    board.reset();
  }

  close($event: MouseEvent) {
    $event.preventDefault()
    this.visible = false;
  }
}
