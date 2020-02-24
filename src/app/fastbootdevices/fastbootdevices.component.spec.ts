import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FastbootdevicesComponent } from './fastbootdevices.component';

describe('FastbootdevicesComponent', () => {
  let component: FastbootdevicesComponent;
  let fixture: ComponentFixture<FastbootdevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FastbootdevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastbootdevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
