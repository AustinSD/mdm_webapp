import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbekeygenComponent } from './abekeygen.component';

describe('AbekeygenComponent', () => {
  let component: AbekeygenComponent;
  let fixture: ComponentFixture<AbekeygenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbekeygenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbekeygenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
