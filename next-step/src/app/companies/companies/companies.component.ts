import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { FormCompanyComponent } from '../form-company/form-company.component';
import { AdminServiceService } from '../../services/admin-service.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
isViewMode: boolean = false;


 selectedCompany: Company | null = null; 

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
  this.selectedCompany = null;
  this.isViewMode = false; // ✅ formulaire en mode édition
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

viewCompany(company: any) {
  this.adminService.getCompanyById(company._id).subscribe({
    next: (res) => {
      this.selectedCompany = res;
      this.isViewMode = true; // ✅ mode lecture seule activé
      this.showAddModal = true;
    },
    error: (err) => {
      console.error('Erreur récupération société', err);
    }
  });
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
  try {
    const data = this.filteredCompanies && this.filteredCompanies.length ? this.filteredCompanies : this.companies;

    if (!data || data.length === 0) {
      alert('No companies to export.');
      return;
    }

    const doc: any = new jsPDF('landscape', 'pt', 'a4'); // cast to any to avoid TS type issues
    const pageWidth = doc.internal.pageSize.getWidth();

    // header
    const title = 'Companies List';
    const dateStr = new Date().toLocaleString();
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 40, 40);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Exported: ${dateStr}`, pageWidth - 160, 44, { align: 'right' });

    const head = [[
      'Company Name',
      'Sector',
      'E-mail',
      'Phone',
      'Manager HR',
      'Manager Email',
      'Website',
      'Address',
      'Status'
    ]];

    const body = data.map((c: any) => [
      c.name ?? '',
      c.sector ?? '',
      c.email ?? '',
      (c.phonePrefix ? c.phonePrefix + ' ' : '') + (c.phoneNumber ?? ''),
      c.hrManage ?? '',
      c.managerEmail ?? '',
      c.website ?? '',
      c.fullAddress ?? '',
      c.status ?? ''
    ]);

    autoTable(doc, {
      startY: 70,
      head,
      body,
      styles: { fontSize: 9, cellPadding: 6 },
      headStyles: { fillColor: [60, 141, 188], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 20, right: 20, top: 20, bottom: 30 },
      didDrawPage: (dataArg: any) => {
        // pageNumber fourni par autoTable ; pageCount via doc.internal (casted)
        const pageNumber = dataArg.pageNumber; // numéro de la page courante
        const pageCount = (doc as any).internal.getNumberOfPages(); // total pages
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidthLocal = doc.internal.pageSize.getWidth();

        // ligne séparatrice (optionnelle)
        doc.setDrawColor(200);
        doc.setLineWidth(0.5);
        doc.line(20, 60, pageWidthLocal - 20, 60);

        // footer : "Page X of Y"
        doc.setFontSize(9);
        doc.setTextColor(100);
        const footerText = `Page ${pageNumber} of ${pageCount}`;
        doc.text(footerText, pageWidthLocal / 2, pageHeight - 10, { align: 'center' });
      },
      showHead: 'everyPage'
    });

    const fileName = `companies_export_${ (new Date()).toISOString().slice(0,10) }.pdf`;
    doc.save(fileName);

  } catch (err) {
    console.error('Export PDF error:', err);
    alert('Erreur lors de la génération du PDF.');
  }
}



  refreshData() {
        this.loadCompanies();
  }
}