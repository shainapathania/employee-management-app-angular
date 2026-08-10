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
    return this.http.get<Employee[]>(`${environment.apiUrl}/employees`);
  }

  //post method
  addEmployee(employee: CreateEmployee) {
    return this.http.post<Employee>(
      `${environment.apiUrl}/employees`,
      employee,
    );
  }

  //put method
  updateEmployee(employee: Employee) {
    return this.http.put<Employee>(
      `${environment.apiUrl}/employees/${employee.id}`,
      employee,
    );
  }

  //delete method

  deleteEmployee(id: string) {
    return this.http.delete(`${environment.apiUrl}/employees/${id}`);
  }

  getEmployeeById(id: string) {
    return this.http.get<Employee>(`${environment.apiUrl}/employees/${id}`);
  }
}
