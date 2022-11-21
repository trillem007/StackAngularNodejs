import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCasinoComponent } from './register-casino.component';

describe('RegisterCasinoComponent', () => {
  let component: RegisterCasinoComponent;
  let fixture: ComponentFixture<RegisterCasinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterCasinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterCasinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
