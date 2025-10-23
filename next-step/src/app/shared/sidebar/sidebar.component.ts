import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface MenuItem {
  name: string;
  icon: string;
  route: string;
  isActive: boolean;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  platformName = 'Next Step';
  isCollapsed = false;
  currentUserRole: string = ''; // <- par défaut vide

  allMenuItems: MenuItem[] = [
    // ----------------- ADMIN -----------------
    {
      name: 'Tableau de bord',
      icon: 'dashboard',
      route: '/adminDashboard',
      isActive: false,
      roles: ['admin']
    },
    {
      name: 'Offres d\'emploi',
      icon: 'work',
      route: '/jobs',
      isActive: false,
      roles: ['admin']
    },
    {
      name: 'Companies',
      icon: 'business',
      route: '/companies',
      isActive: false,
      roles: ['admin']
    },
    {
      name: 'Candidats',
      icon: 'people',
      route: '/candidates',
      isActive: false,
      roles: ['admin']
    },

    // ----------------- COMPANY -----------------
    {
      name: 'Tableau de bord',
      icon: 'dashboard',
      route: '/companyDashboard',
      isActive: false,
      roles: ['company']
    },
    {
      name: 'Mes Offres',
      icon: 'work',
      route: '/offers',
      isActive: false,
      roles: ['company']
    },
    {
      name: 'Candidats',
      icon: 'people',
      route: '/company/candidates',
      isActive: false,
      roles: ['company']
    },
    {
      name: 'Entretiens',
      icon: 'calendar_today',
      route: '/company/interviews',
      isActive: false,
      roles: ['company']
    },

    // ----------------- USER -----------------
    {
      name: 'Tableau de bord',
      icon: 'dashboard',
      route: '/userDashboard',
      isActive: false,
      roles: ['user']
    },
    {
      name: 'Offres',
      icon: 'search',
      route: '/user/jobs',
      isActive: false,
      roles: ['user']
    },
    {
      name: 'Mes Candidatures',
      icon: 'description',
      route: '/user/applications',
      isActive: false,
      roles: ['user']
    },
    {
      name: 'Mon Profil',
      icon: 'person',
      route: '/user/profile',
      isActive: false,
      roles: ['user']
    }
  ];

  menuItems: MenuItem[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.getCurrentUserRole();
    this.filterMenuItems();
    this.setActiveItemByRoute();
  }

  // 🔹 Récupère le rôle depuis le localStorage (défini après le login)
  getCurrentUserRole(): void {
    const role = localStorage.getItem('role');
    this.currentUserRole = role ? role : 'user'; // valeur par défaut
  }

  filterMenuItems(): void {
    this.menuItems = this.allMenuItems.filter(item => 
      item.roles.includes(this.currentUserRole)
    );
  }

  getUserDisplayInfo(): { name: string; role: string } {
    switch(this.currentUserRole) {
      case 'admin':
        return { name: 'Admin', role: 'Administrateur' };
      case 'company':
        return { name: 'Entreprise', role: 'Recruteur' };
      case 'user':
        return { name: 'Candidat', role: 'Chercheur d\'emploi' };
      default:
        return { name: 'Utilisateur', role: 'Membre' };
    }
  }

  getUserAvatarIcon(): string {
    switch(this.currentUserRole) {
      case 'admin':
        return 'admin_panel_settings';
      case 'company':
        return 'business';
      case 'user':
        return 'person';
      default:
        return 'person';
    }
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  setActiveItem(selectedItem: MenuItem): void {
    this.menuItems.forEach(item => {
      item.isActive = item.name === selectedItem.name;
    });
    this.router.navigate([selectedItem.route]);
  }

  setActiveItemByRoute(): void {
    const currentRoute = this.router.url;
    this.menuItems.forEach(item => {
      item.isActive = currentRoute === item.route || currentRoute.startsWith(item.route + '/');
    });
  }


expandSidebar(): void {
  this.isCollapsed = false;
}

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
