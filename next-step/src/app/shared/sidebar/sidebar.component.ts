import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
interface MenuItem {
  name: string;
  icon: string;
  route: string;
  isActive: boolean;
}
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule ,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  platformName = 'Next Step';
  isCollapsed = false;

  menuItems: MenuItem[] = [
    {
      name: 'Tableau de bord',
      icon: 'dashboard',
      route: '/adminDashboard',
      isActive: false
    },
    {
      name: 'Offres d\'emploi',
      icon: 'work',
      route: '/jobs',
      isActive: false
    },
    {
      name: 'Companies',
      icon: 'business',
      route: '/companies',
      isActive: false
    },
    {
      name: 'Candidats',
      icon: 'people',
      route: '/candidates',
      isActive: false
    }
  ];

  constructor(private router: Router) {
    // Activer l'élément correspondant à la route actuelle
    this.setActiveItemByRoute();
  }

  toggleSidebar(): void {
    this.isCollapsed = true;
  }

  expandSidebar(): void {
    this.isCollapsed = false;
  }

  setActiveItem(selectedItem: MenuItem): void {
    this.menuItems.forEach(item => {
      item.isActive = item.name === selectedItem.name;
    });
    
    // Navigation vers la route
    this.router.navigate([selectedItem.route]);
  }

  setActiveItemByRoute(): void {
    const currentRoute = this.router.url;
    this.menuItems.forEach(item => {
      item.isActive = currentRoute === item.route || currentRoute.startsWith(item.route + '/');
    });
  }

  navigateToRoute(route: string): void {
    this.router.navigate([route]);
  }

  logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  this.router.navigate(['/login']);
}

}