import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  isLoggedIn = signal(false);
  constructor() {
    const loggedin = localStorage.getItem('isLoggedIn');
    if (loggedin === 'true') {
      this.isLoggedIn.set(true);
    }
  }

  login(email: string, password: string): boolean {
    if (email === 'admin@gmail.com' && password === '123456') {
      this.isLoggedIn.set(true);
      localStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    this.isLoggedIn.set(false);
    return false;
  }

  logout() {
    this.isLoggedIn.set(false);
    localStorage.removeItem('isLoggedIn');
  }
}
