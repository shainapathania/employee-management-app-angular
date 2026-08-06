import { Component, inject, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee';
import { CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-employees',
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees implements OnInit {
  employeeService = inject(EmployeeService);
  fb = inject(FormBuilder);

  ngOnInit(): void {
    this.employeeService.loadEmployees();
  }

  departments = ['IT', 'HR', 'Finance', 'Sales', 'Marketing'];

  employeeForm = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
    ],
    department: ['', Validators.required],
    salary: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1000),
      Validators.max(500000),
    ]),
  });

  onSubmit() {
    if (this.employeeForm.invalid) {
      return;
    }

    if (this.editingEmployeeId === null) {
      const employee = {
        name: this.employeeForm.value.name!,
        department: this.employeeForm.value.department!,
        salary: this.employeeForm.value.salary!,
      };

      this.employeeService.addEmployee(employee);
    } else {
      const employee = {
        id: this.editingEmployeeId,
        name: this.employeeForm.value.name!,
        department: this.employeeForm.value.department!,
        salary: this.employeeForm.value.salary!,
      };

      this.employeeService.updateEmployee(employee);
    }
  }

  editingEmployeeId: string | null = null;
  editEmployee(employee: Employee) {
    this.editingEmployeeId = employee.id;
    this.employeeForm.patchValue({
      name: employee.name,
      department: employee.department,
      salary: employee.salary,
    });
  }

  deleteEmployee(id: string) {
    const confirmed = confirm('Are you sure you want to delete this employee?');
    if (!confirmed) {
      return;
    }
    this.employeeService.deleteEmployee(id);
  }
}
