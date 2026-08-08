import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Employees } from './employees';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Employees', () => {
  let component: Employees;
  let fixture: ComponentFixture<Employees>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Employees],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Employees);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
