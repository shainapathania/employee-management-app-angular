import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { EmployeeService } from './employee';
import { CreateEmployee, Employee } from '../models/employee';
import { environment } from '../../environments/enviroment';

describe('Employee', () => {
  let service: EmployeeService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmployeeService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(EmployeeService);
    httpTesting = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load employees', () => {
    const mockEmployees: Employee[] = [
      { id: '1', name: 'John', department: 'IT', salary: 50000 },
      { id: '2', name: 'Alice', department: 'HR', salary: 60000 },
    ];
    service.loadEmployees().subscribe((employees) => {
      expect(employees).toEqual(mockEmployees);
    });

    const request = httpTesting.expectOne(`${environment.apiUrl}/employees`);
    expect(request.request.method).toBe('GET');
    request.flush(mockEmployees);
  });

  it('should add an employee', () => {
    const newEmployee: CreateEmployee = {
      name: 'Ronald',
      department: 'Sales',
      salary: 55000,
    };

    service.addEmployee(newEmployee).subscribe((savedEmployee) => {
      expect(savedEmployee).toEqual({
        id: '4',
        name: 'Ronald',
        department: 'Sales',
        salary: 55000,
      });
    });
    const request = httpTesting.expectOne(`${environment.apiUrl}/employees`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(newEmployee);
    request.flush({
      id: '4',
      name: 'Ronald',
      department: 'Sales',
      salary: 55000,
    });
  });

  it('should update an employee', () => {
    const updatedEmployee: Employee = {
      id: '1',
      name: 'John Updated',
      department: 'Finance',
      salary: 65000,
    };

    service.updateEmployee(updatedEmployee).subscribe((employee) => {
      expect(employee).toEqual(updatedEmployee);
    });

    const request = httpTesting.expectOne(
      `${environment.apiUrl}/employees/${updatedEmployee.id}`,
    );

    expect(request.request.method).toBe('PUT');

    expect(request.request.body).toEqual(updatedEmployee);

    request.flush(updatedEmployee);
  });

  it('should delete an employee', () => {
    const employeeId = '1';

    service.deleteEmployee(employeeId).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const request = httpTesting.expectOne(
      `${environment.apiUrl}/employees/${employeeId}`,
    );

    expect(request.request.method).toBe('DELETE');

    request.flush({ success: true });
  });

  it('should handle server error', () => {
    service.loadEmployees().subscribe({
      next: () => {
        fail('Expected an error, but got successful response');
      },
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });
    const request = httpTesting.expectOne(`${environment.apiUrl}/employees`);
    request.flush('something went wrong', {
      status: 500,
      statusText: 'Server Error',
    });
  });
});
