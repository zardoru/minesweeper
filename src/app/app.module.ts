import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { OptionsModalComponent } from './options-modal/options-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    OptionsModalComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
