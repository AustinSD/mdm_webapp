import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbebaseComponent } from './abebase.component';

describe('AbebaseComponent', () => {
  let component: AbebaseComponent;
  let fixture: ComponentFixture<AbebaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbebaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbebaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
