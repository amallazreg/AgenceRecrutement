import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { AdminServiceService } from '../../services/admin-service.service';

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  skills: string[];
  cvUrl: string;
  status: 'active' | 'inactive';
  registrationDate: string;
}
@Component({
  selector: 'app-condidate',
  standalone : true, 
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './condidate.component.html',
  styleUrl: './condidate.component.css'
})
export class CondidateComponent implements OnInit {
  candidates: Candidate[] = [];
  filteredCandidates: Candidate[] = [];
  searchTerm: string = '';
  totalUser: number = 0;
  errorMessage = '' ; 

  constructor(private adminService : AdminServiceService) {

  }

  ngOnInit() {
    this.loadSampleData();
    this.filterCandidates();
    this.getTotalCandidates() ;
  }

  
  filterCandidates() {
    if (!this.searchTerm) {
      this.filteredCandidates = [...this.candidates];
    } else {
      this.filteredCandidates = this.candidates.filter(candidate =>
        candidate.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        candidate.specialty.toLowerCase().includes(this.searchTerm.toLowerCase()) 
      );
    }
  }

  loadSampleData() {
   this.adminService.getAllUsers().subscribe({
      next: (res) => {
        this.candidates = res;
        this.filteredCandidates = [...this.candidates]; 
      },
      error: (err) => {
        console.error('Erreur lors du chargement des sociétés:', err);
        this.errorMessage = 'Erreur lors du chargement des sociétés.';
      }
    });
  }


  getActiveCandidates(): number {
    return this.candidates.filter(candidate => candidate.status === 'active').length;
  }

  getTotalCandidates()  {
    this.adminService.getUserCount().subscribe({
      next: (res) => {
        this.totalUser = res.totalUser;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du nombre de users:', err);
      }
    });
  }

  downloadCV(candidate: Candidate) {
    console.log('Downloading CV:', candidate.cvUrl);
    // Implement download logic
  }

  viewCandidate(candidate: Candidate) {
    console.log('View candidate:', candidate);
    // Implement view logic
  }

  editCandidate(candidate: Candidate) {
    console.log('Edit candidate:', candidate);
    // Implement edit logic
  }

  deleteCandidate(candidate: Candidate) {
    if (confirm(`Are you sure you want to delete ${candidate.name}?`)) {
      this.candidates = this.candidates.filter(c => c.id !== candidate.id);
      this.filterCandidates();
    }
  }

  exportData() {
    console.log('Exporting candidates data');
  }

  refreshData() {
    this.loadSampleData();
  }
}