import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { AdminServiceService } from '../../services/admin-service.service';

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
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

  constructor(private adminService : AdminServiceService) {

  }

  ngOnInit() {
    this.loadSampleData();
    this.filterCandidates();
    this.getTotalCandidates() ;
  }

  loadSampleData() {
    this.candidates = [
      {
        id: 1,
        firstName: 'Marie',
        lastName: 'Dubois',
        email: 'marie.dubois@email.com',
        phone: '+33 6 12 34 56 78',
        specialty: 'Full Stack Development',
        skills: ['Angular', 'Node.js', 'TypeScript', 'MongoDB'],
        cvUrl: '/cv/marie-dubois.pdf',
        status: 'active',
        registrationDate: '2024-01-15'
      },
      {
        id: 2,
        firstName: 'Pierre',
        lastName: 'Martin',
        email: 'pierre.martin@email.com',
        phone: '+33 7 23 45 67 89',
        specialty: 'Data Science',
        skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
        cvUrl: '/cv/pierre-martin.pdf',
        status: 'active',
        registrationDate: '2024-01-20'
      },
      {
        id: 3,
        firstName: 'Sophie',
        lastName: 'Laurent',
        email: 'sophie.laurent@email.com',
        phone: '+33 6 34 56 78 90',
        specialty: 'Digital Marketing',
        skills: ['SEO', 'Google Analytics', 'Content Marketing', 'Social Media'],
        cvUrl: '/cv/sophie-laurent.pdf',
        status: 'inactive',
        registrationDate: '2024-01-10'
      },
      {
        id: 4,
        firstName: 'Thomas',
        lastName: 'Bernard',
        email: 'thomas.bernard@email.com',
        phone: '+33 7 45 67 89 01',
        specialty: 'DevOps',
        skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
        cvUrl: '/cv/thomas-bernard.pdf',
        status: 'active',
        registrationDate: '2024-01-25'
      },
      {
        id: 5,
        firstName: 'Julie',
        lastName: 'Moreau',
        email: 'julie.moreau@email.com',
        phone: '+33 6 56 78 90 12',
        specialty: 'UI/UX Design',
        skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
        cvUrl: '/cv/julie-moreau.pdf',
        status: 'active',
        registrationDate: '2024-01-18'
      }
    ];
    this.filteredCandidates = [...this.candidates];
  }

  filterCandidates() {
    if (!this.searchTerm) {
      this.filteredCandidates = [...this.candidates];
    } else {
      this.filteredCandidates = this.candidates.filter(candidate =>
        candidate.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        candidate.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        candidate.specialty.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
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
    if (confirm(`Are you sure you want to delete ${candidate.firstName} ${candidate.lastName}?`)) {
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