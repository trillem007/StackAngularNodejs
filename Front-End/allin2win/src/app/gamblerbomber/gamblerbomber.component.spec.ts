import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamblerbomberComponent } from './gamblerbomber.component';

describe('GamblerbomberComponent', () => {
  let component: GamblerbomberComponent;
  let fixture: ComponentFixture<GamblerbomberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamblerbomberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamblerbomberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
