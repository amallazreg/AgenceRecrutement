import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone : true , 
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
 @Input() role: 'admin' | 'recruteur' | 'candidat' = 'candidat';

  get menuItems() {
    switch (this.role) {
      case 'admin':
        return [
          { icon: 'dashboard', label: 'Tableau de bord', link: '/admin/dashboard' },
          { icon: 'group', label: 'Utilisateurs', link: '/admin/utilisateurs' },
          { icon: 'settings', label: 'Paramètres', link: '/admin/parametres' },
        ];
      case 'recruteur':
        return [
          { icon: 'dashboard', label: 'Tableau de bord', link: '/recruteur/dashboard' },
          { icon: 'work', label: 'Mes offres', link: '/recruteur/offres' },
          { icon: 'assignment', label: 'Candidatures reçues', link: '/recruteur/candidatures' },
        ];
      default:
        return [
          { icon: 'dashboard', label: 'Tableau de bord', link: '/candidat/dashboard' },
          { icon: 'search', label: 'Offres d’emploi', link: '/candidat/offres' },
          { icon: 'send', label: 'Mes candidatures', link: '/candidat/candidatures' },
          { icon: 'person', label: 'Mon profil', link: '/candidat/profil' },
        ];
    }
  }
}