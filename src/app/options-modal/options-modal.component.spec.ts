import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsModalComponent } from './options-modal.component';

describe('OptionsModalComponent', () => {
  let component: OptionsModalComponent;
  let fixture: ComponentFixture<OptionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should becoome visible on show', () => {
    component.close(new MouseEvent(''));
    component.show();
    expect(component.visible).toBeTrue();
  });

  it('should close', () => {
    component.show();
    component.close(new MouseEvent(''));
    expect(component.visible).toBeFalse();
  });
});
