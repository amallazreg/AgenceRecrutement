import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { FormCompanyComponent } from '../form-company/form-company.component';
interface Company {
  id: number;
  name: string;
  sector: string;
  description: string;
  email: string;
  phone: string;
  phonePrefix: string;
  website: string;
  fullAddress: string;
  hrManager: string;
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

  constructor() {}

  ngOnInit() {
    this.loadSampleData();
    this.filterCompanies();
  }

  loadSampleData() {
    this.companies = [
      {
        id: 1,
        name: 'Tech Solutions SARL',
        sector: 'Technologie',
        description: 'Entreprise spécialisée dans les solutions IT',
        email: 'contact@techsolutions.com',
        phone: '1 23 45 67 89',
        phonePrefix: '+33',
        website: 'https://techsolutions.com',
        fullAddress: '123 Rue de la Tech, 75001 Paris',
        hrManager: 'Marie Dubois',
        managerEmail: 'marie.dubois@techsolutions.com',
        status: 'active'
      },
      {
        id: 2,
        name: 'Marketing Pro',
        sector: 'Marketing',
        description: 'Agence de marketing digital',
        email: 'info@marketingpro.com',
        phone: '1 98 76 54 32',
        phonePrefix: '+33',
        website: 'https://marketingpro.com',
        fullAddress: '456 Avenue Marketing, 69002 Lyon',
        hrManager: 'Pierre Martin',
        managerEmail: 'pierre.martin@marketingpro.com',
        status: 'pending'
      },
      {
        id: 3,
        name: 'Finance Group',
        sector: 'Finance',
        description: 'Conseil en gestion financière',
        email: 'contact@financegroup.com',
        phone: '1 45 67 89 01',
        phonePrefix: '+33',
        website: 'https://financegroup.com',
        fullAddress: '789 Boulevard Finance, 13008 Marseille',
        hrManager: 'Sophie Laurent',
        managerEmail: 'sophie.laurent@financegroup.com',
        status: 'active'
      }
    ];
    this.filteredCompanies = [...this.companies];
  }

  filterCompanies() {
    if (!this.searchTerm) {
      this.filteredCompanies = [...this.companies];
    } else {
      this.filteredCompanies = this.companies.filter(company =>
        company.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        company.sector.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        company.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        company.hrManager.toLowerCase().includes(this.searchTerm.toLowerCase())
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
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${company.name} ?`)) {
      this.companies = this.companies.filter(c => c.id !== company.id);
      this.filterCompanies();
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
    this.loadSampleData();
  }
}