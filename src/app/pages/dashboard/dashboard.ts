import { Component, inject } from '@angular/core';
import { EmployeeService } from '../../services/employee';
import { CurrencyPipe, AsyncPipe } from '@angular/common';
import {
  map,
  Subject,
  startWith,
  switchMap,
  debounceTime,
  distinctUntilChanged,
  combineLatest,
} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, AsyncPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  employeeService = inject(EmployeeService);

  selectedDepartment = '';

  departments = ['IT', 'HR', 'Finance', 'Sales', 'Marketing'];

  departmentSubject = new Subject<string>();

  searchSubject = new Subject<string>();

  searchTerm$ = this.searchSubject.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
  );

  employees$ = this.employeeService.loadEmployees();
  totalEmployees$ = this.employees$.pipe(map((employees) => employees.length));

  filteredEmployees$ = combineLatest([
    this.departmentSubject.pipe(startWith('')),
    this.searchTerm$,
  ]).pipe(
    switchMap(([department, searchTerm]) =>
      this.employees$.pipe(
        map((employees) =>
          employees.filter((employee) => {
            const matchesDepartment =
              department === '' || employee.department === department;

            const matchesSearch = employee.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase());

            return matchesDepartment && matchesSearch;
          }),
        ),
      ),
    ),
  );

  onDepartmentChange(department: string) {
    this.selectedDepartment = department;
    this.departmentSubject.next(department);
  }

  logDepartment() {
    this.departmentSubject.subscribe((department) => {
      console.log('Selected department:', department);
    });
  }

  onSearch(searchTerm: string) {
    this.searchSubject.next(searchTerm);
  }
}
