import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WifidevicesComponent } from './wifidevices.component';

describe('WifidevicesComponent', () => {
  let component: WifidevicesComponent;
  let fixture: ComponentFixture<WifidevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WifidevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WifidevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
