import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { inject } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  //constructor(public auth: Auth) {}
  auth = inject(Auth);
  router = inject(Router);
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
