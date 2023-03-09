import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {BoardComponent} from "./board/board.component";
import {OptionsModalComponent} from "./options-modal/options-modal.component";

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        BoardComponent,
        OptionsModalComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have created the sub-components successfully', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-board')).withContext('board').toBeTruthy();
    expect(compiled.querySelector('app-options-modal')).withContext('options modal').toBeTruthy();
  });
});
