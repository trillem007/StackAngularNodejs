import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCasinoComponent } from './login-casino.component';

describe('LoginCasinoComponent', () => {
  let component: LoginCasinoComponent;
  let fixture: ComponentFixture<LoginCasinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginCasinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginCasinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
