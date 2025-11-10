import { Component } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar-acceuil',
  imports: [CommonModule ,RouterModule],
  templateUrl: './sidebar-acceuil.component.html',
  styleUrl: './sidebar-acceuil.component.css'
})
export class SidebarAcceuilComponent {
isLoggedIn = false;
userName = '';
showUserMenu = false;

constructor(private authService: AuthServiceService, private router: Router) {}

ngOnInit() {
  this.isLoggedIn = this.authService.isAuthenticated();
  this.userName = this.authService.getUserName();
}

toggleUserMenu() {
  this.showUserMenu = !this.showUserMenu;
}

viewProfile() {
  this.router.navigate(['/profile']);
}

logout() {
  this.authService.logout();
  this.isLoggedIn = false;
  this.router.navigate(['/auth/login']);
}

}
