import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidatureService } from '../../services/candidature.service';

interface Education {
  degree: string;
  institution: string;
  startYear: number;
  endYear: number;
  _id?: string;
}

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  _id?: string;
}

interface Project {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  _id?: string;
}

interface Language {
  name: string;
  level: string;
  _id?: string;
}

interface Certification {
  title: string;
  issuer: string;
  date: string;
  certificateFile?: string;
  _id?: string;
}

interface Candidat {
  _id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  phone: string;
  skills: string[];
  education: Education[];
  experiences: Experience[];
  projects?: Project[];
  languages: Language[];
  certifications: Certification[];
  linkedin?: string;
  github?: string;
  cv: string;
  motivationLetter: string;
  additionalDocuments: string[];
  status: 'En attente' | 'Accepté' | 'Refusé';
  submittedAt: string;
}

@Component({
  selector: 'app-candidates-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './candidates-list.component.html',
  styleUrl: './candidates-list.component.css'
})
export class CandidatesListComponent implements OnInit {
  candidates: Candidat[] = [];
  filteredCandidates: Candidat[] = [];
  
  offerId: string = '';
  offerTitle: string = '';
  
  isLoading: boolean = true;
  activeFilter: string = 'all';
  searchQuery: string = '';
  
  // Modal de confirmation
  showActionModal: boolean = false;
  selectedCandidate: Candidat | null = null;
  actionType: 'Accepté' | 'Refusé' | null = null;
  
  // Modal détails candidat
  showDetailsModal: boolean = false;
  candidateDetails: Candidat | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private candidatureService: CandidatureService,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Récupérer l'offerId depuis l'URL
    this.offerId = this.route.snapshot.paramMap.get('offerId') || '';
    this.offerTitle = this.route.snapshot.queryParamMap.get('title') || 'Offre';
    
    if (this.offerId) {
      this.loadCandidates();
    } else {
      console.error('Aucun ID d\'offre fourni');
      this.router.navigate(['/company/offers']);
    }
  }

  loadCandidates(): void {
    this.isLoading = true;
    
    this.candidatureService.getCandidatesForOffer(this.offerId).subscribe({
      next: (response: any) => {
        console.log('✅ Candidats chargés:', response);
        this.candidates = response.candidature || [];
        console.log(this.candidates[0]._id); // affiche l'_id du premier candidat
        console.log('CV du premier candidat:', this.candidates[0].cv);
console.log('Lettre de motivation du premier candidat:', this.candidates[0].motivationLetter);

        this.filteredCandidates = this.candidates;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Erreur chargement candidats:', err);
        this.isLoading = false;
      }
    });
  }

  // Nettoyer et parser les skills
  parseSkills(skills: string[]): string[] {
    if (!skills || skills.length === 0) return [];
    
    const allSkills: string[] = [];
    
    skills.forEach(skill => {
      // Nettoyer les caractères spéciaux et diviser
      const cleaned = skill.replace(/[\[\]"]/g, '').split(',').map(s => s.trim()).filter(s => s);
      allSkills.push(...cleaned);
    });
    
    return allSkills;
  }

  // Filtrer par status
  filterByStatus(status: string): void {
    this.activeFilter = status;
    this.applyFilters();
  }

  // Recherche
  onSearchChange(): void {
    this.applyFilters();
  }

  // Appliquer les filtres
  applyFilters(): void {
    let filtered = [...this.candidates];

    // Filtre par status
    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(c => c.status === this.activeFilter);
    }

    // Filtre par recherche
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.candidateName.toLowerCase().includes(query) ||
        c.candidateEmail.toLowerCase().includes(query) ||
        this.parseSkills(c.skills).some(skill => skill.toLowerCase().includes(query))
      );
    }

    this.filteredCandidates = filtered;
  }

  // Compter par status
  getStatusCount(status: string): number {
    return this.candidates.filter(c => c.status === status).length;
  }

  // Ouvrir modal d'action
  openActionModal(candidate: Candidat, action: 'Accepté' | 'Refusé'): void {
    this.selectedCandidate = candidate;
    this.actionType = action;
    this.showActionModal = true;
  }

  // Confirmer l'action
confirmAction(): void {
  if (!this.selectedCandidate || !this.actionType || !this.selectedCandidate._id) return;

  this.candidatureService.updateCandidatureStatus(this.selectedCandidate._id, this.actionType).subscribe({
    next: (response) => {
      console.log('✅ Statut mis à jour:', response);
      
      const index = this.candidates.findIndex(c => c._id === this.selectedCandidate?._id);
      if (index !== -1) {
        this.candidates[index].status = this.actionType!;
      }

      this.applyFilters();
      this.closeActionModal();
    },
    error: (err) => {
      console.error('❌ Erreur mise à jour statut:', err);
      alert('Erreur lors de la mise à jour du statut');
      this.closeActionModal();
    }
  });
}


  closeActionModal(): void {
    this.showActionModal = false;
    this.selectedCandidate = null;
    this.actionType = null;
  }

  // Voir les détails du candidat
  viewDetails(candidate: Candidat): void {
    this.candidateDetails = candidate;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.candidateDetails = null;
  }

  // Classes CSS
  getStatusClass(status: string): string {
    switch (status) {
      case 'En attente': return 'status-pending';
      case 'Accepté': return 'status-accepted';
      case 'Refusé': return 'status-rejected';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'En attente': return '⏳';
      case 'Accepté': return '✅';
      case 'Refusé': return '❌';
      default: return '❓';
    }
  }

  // Temps écoulé
  getTimeAgo(date: string): string {
    const now = new Date();
    const submitted = new Date(date);
    const diffMs = now.getTime() - submitted.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    return `Il y a ${Math.floor(diffDays / 30)} mois`;
  }

goBack(): void {
  this.location.back();
}
  // Télécharger CV
  downloadCV(cv: string): void {
    window.open(`http://localhost:3000/uploads/${cv}`, '_blank');
  }

  // Télécharger lettre de motivation
  downloadMotivation(letter: string): void {
    window.open(`http://localhost:3000/uploads/${letter}`, '_blank');
  }
}