import { Injectable, signal } from '@angular/core';
import { Employee } from '../models/employee';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  employees = signal<Employee[]>([
    {
      id: 1,
      name: 'Harry',
      department: 'IT',
      salary: 50000,
    },
    {
      id: 2,
      name: 'Ron',
      department: 'Finance',
      salary: 30000,
    },
    {
      id: 3,
      name: 'Harmoine',
      department: 'HR',
      salary: 40000,
    },
  ]);

  private http = inject(HttpClient);
  addEmployee(employee: Employee) {
    this.employees.update((currentEmployees) => [
      ...currentEmployees,
      employee,
    ]);
  }
  updateEmployee(updatedEmployee: Employee) {
    this.employees.update((currentEmployees) =>
      currentEmployees.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee,
      ),
    );
  }
  deleteEmployee(id: number) {
    this.employees.update((currentEmployees) =>
      currentEmployees.filter((employee) => employee.id !== id),
    );
  }
}
