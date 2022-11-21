import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuletaComponent } from './ruleta.component';

describe('RuletaComponent', () => {
  let component: RuletaComponent;
  let fixture: ComponentFixture<RuletaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RuletaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuletaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
