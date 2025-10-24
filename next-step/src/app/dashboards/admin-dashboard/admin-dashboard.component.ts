import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { AdminServiceService } from '../../services/admin-service.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true, 
  imports: [CommonModule , SidebarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  totalUser: number = 0;
  totalCompany: number = 0;
    totalOffers: number = 0;




  constructor(private adminService : AdminServiceService){}

    ngOnInit() {
    this.getTotalCandidates();
    this.loadCompanyCount() ;
    this.getTotalOffers() ;
  }


    getTotalCandidates() {
    this.adminService.getUserCount().subscribe({
      next: (res) => {
        this.totalUser = res.totalUser;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du nombre de users:', err);
      }
    });
  }


  loadCompanyCount() {
    this.adminService.getCompanyCount().subscribe({
      next: (res) => {
        this.totalCompany = res.totalCompany;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du nombre de sociétés:', err);
      }
    });
  }
getTotalOffers() {
  this.adminService.getOffreCount().subscribe({
    next: (res) => {
      this.totalOffers = res.totalOffers;
    },
    error: (err) => {
      console.error('Erreur lors du chargement du nombre d’offres :', err);
    }
  });
}

}
