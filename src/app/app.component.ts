import { Component, ViewChild, AfterViewInit, AfterContentInit } from '@angular/core';
import { BoardComponent } from './board/board.component';
import {OptionsModalComponent} from "./options-modal/options-modal.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterContentInit {
  title = 'buscaminas';

  @ViewChild(BoardComponent)
  public board!: BoardComponent;

  @ViewChild(OptionsModalComponent)
  public modal!: OptionsModalComponent;

  ngAfterContentInit(): void { /* noop */ }

  flags(): number {
    if (this.board)
      return this.board.flags;
    else
      return 0;
  }

  mines(): number {
    if (this.board)
      return this.board.mineCount;
    else
      return 0;
  }

  secs(): number {
    if (this.board)
      return this.board?.timer % 60;
    else
      return 0;
  }

  mins(): number {
    if (this.board)
      return Math.floor(this.board.timer / 60);
    else
      return 0;
  }

  resetBoard() {
    this.board.reset();
  }
}
