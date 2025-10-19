import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { FormCompanyComponent } from '../form-company/form-company.component';
import { AdminServiceService } from '../../services/admin-service.service';
interface Company {
  _id: string;
  name: string;
  sector: string;
  description: string;
  email: string;
  phoneNumber: string;
  phonePrefix: string;
  website: string;
  fullAddress: string;
  hrManage: string;
  managerEmail: string;
  status: 'active' | 'pending';
}

@Component({
  selector: 'app-companies',
  standalone : true, 
  imports: [ FormsModule, ReactiveFormsModule , CommonModule , SidebarComponent , FormCompanyComponent],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css'
})
export class CompaniesComponent implements OnInit {
  companies: Company[] = [];
  filteredCompanies: Company[] = [];
  searchTerm: string = '';
  showAddModal: boolean = false;
    errorMessage = '';


  constructor(private adminService : AdminServiceService) {}

  ngOnInit() {
    this.filterCompanies();
    this.loadCompanies();
    this.loadCompanyCount()
  }

  loadCompanies() {
    this.adminService.getAllCompanies().subscribe({
      next: (res) => {
        this.companies = res;
        this.filteredCompanies = [...this.companies]; // copie pour le filtrage/sorting
      },
      error: (err) => {
        console.error('Erreur lors du chargement des sociétés:', err);
        this.errorMessage = 'Erreur lors du chargement des sociétés.';
      }
    });
  }

  totalCompany: number = 0;

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

  filterCompanies() {
    if (!this.searchTerm) {
      this.filteredCompanies = [...this.companies];
    } else {
      this.filteredCompanies = this.companies.filter(company =>
        company.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        company.sector.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        company.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        company.hrManage.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  getActiveCompanies(): number {
    return this.companies.filter(company => company.status === 'active').length;
  }

  getPendingCompanies(): number {
    return this.companies.filter(company => company.status === 'pending').length;
  }

  openAddCompanyModal() {
    this.showAddModal = true;
  }

  closeAddCompanyModal() {
    this.showAddModal = false;
  }

  // Nouvelle méthode pour gérer la soumission du formulaire
  handleFormSubmit(formData: any) {
    const newCompany: Company = {
      id: this.companies.length + 1,
      ...formData,
      status: 'pending' as const
    };
    
    this.companies.push(newCompany);
    this.filterCompanies();
    this.closeAddCompanyModal();
    
    console.log('Nouvelle société:', newCompany);
  }

  // Nouvelle méthode pour gérer l'annulation du formulaire
  handleFormCancel() {
    this.closeAddCompanyModal();
  }

  editCompany(company: Company) {
    console.log('Modifier société:', company);
    // Implémentez la logique d'édition
  }

  viewCompany(company: Company) {
    console.log('Voir société:', company);
    // Implémentez la logique de visualisation
  }

  deleteCompany(company: Company) {
    if (confirm(`Are you sure you want to delete ${company.name} ?`)) {
       this.adminService.deleteAgency(company._id).subscribe({
        next: () => {
          this.loadCompanies(); 
          this.loadCompanyCount()
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
        }
      });
    }
  }

  

  sortBy(field: string) {
    // Implémentez le tri
    console.log('Trier par:', field);
  }

  exportData() {
    console.log('Exporter les données');
  }

  refreshData() {
        this.loadCompanies();
  }
}