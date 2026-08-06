import { Injectable, signal } from '@angular/core';
import { Employee, CreateEmployee } from '../models/employee';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  employees = signal<Employee[]>([
    {
      id: '1',
      name: 'Harry',
      department: 'IT',
      salary: 50000,
    },
    {
      id: '2',
      name: 'Ron',
      department: 'Finance',
      salary: 30000,
    },
    {
      id: '3',
      name: 'Harmoine',
      department: 'HR',
      salary: 40000,
    },
  ]);

  private http = inject(HttpClient);

  // addEmployee(employee: Employee) {
  //   this.employees.update((currentEmployees) => [
  //     ...currentEmployees,
  //     employee,
  //   ]);
  // }

  // updateEmployee(updatedEmployee: Employee) {
  //   this.employees.update((currentEmployees) =>
  //     currentEmployees.map((employee) =>
  //       employee.id === updatedEmployee.id ? updatedEmployee : employee,
  //     ),
  //   );
  // }

  // deleteEmployee(id: string) {
  //   this.employees.update((currentEmployees) =>
  //     currentEmployees.filter((employee) => employee.id !== id),
  //   );
  // }

  //Get method
  loadEmployees() {
    this.http
      .get<Employee[]>(`${environment.apiUrl}/employees`)
      .subscribe((employees) => {
        this.employees.set(employees);
      });
  }

  //post method
  addEmployee(employee: CreateEmployee) {
    this.http
      .post<Employee>(`${environment.apiUrl}/employees`, employee)
      .subscribe((savedEmployee) => {
        this.employees.update((current) => [...current, savedEmployee]);
      });
  }

  //put method
  updateEmployee(employee: Employee) {
    this.http
      .put<Employee>(`${environment.apiUrl}/employees/${employee.id}`, employee)
      .subscribe((updatedEmployee) => {
        this.employees.update((current) =>
          current.map((emp) =>
            emp.id === updatedEmployee.id ? updatedEmployee : emp,
          ),
        );
      });
  }

  //delete method

  deleteEmployee(id: string) {
    this.http.delete(`${environment.apiUrl}/employees/${id}`).subscribe(() => {
      this.employees.update((current) =>
        current.filter((employee) => employee.id !== id),
      );
    });
  }
}
