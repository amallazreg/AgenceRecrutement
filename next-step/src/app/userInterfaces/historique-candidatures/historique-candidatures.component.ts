import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SidebarAcceuilComponent } from '../../shared/sidebar-acceuil/sidebar-acceuil.component';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CandidatureService } from '../../services/candidature.service';
import { AuthServiceService } from '../../services/auth-service.service';

interface Offer {
  _id: string;
  title: string;
  company?: string;
  location: string;
  contractType: string;
  sector: string;
  description?: string;
  requirements?: string[];
  salary?: string;
  benefits?: string[];
  companyId?: {
    name: string;
    _id: string;
  };
}

interface Candidature {
  _id: string;
  candidateId: string;
  offerId: Offer;
  cv: string;
  motivationLetter: string;
  additionalDocuments: string[];
  status: 'En attente' | 'Accepté' | 'Refusé';
  submittedAt: string;
  __v: number;
}

@Component({
  selector: 'app-historique-candidatures',
  standalone: true,
  imports: [CommonModule, SidebarAcceuilComponent, FormsModule],
  templateUrl: './historique-candidatures.component.html',
  styleUrl: './historique-candidatures.component.css'
})
export class HistoriqueCandidaturesComponent implements OnInit {
  candidatures: Candidature[] = [];
  filteredCandidatures: Candidature[] = [];
  
  searchQuery: string = '';
  activeFilter: string = 'all';
  isLoading: boolean = true;
  
  // Modal de suppression
  showDeleteModal: boolean = false;
  candidatureToDelete: string | null = null;

  // Modal de détails de l'offre
  showOfferModal: boolean = false;
  selectedOffer: Offer | null = null;

  // ID du candidat connecté
  currentCandidateId: string = '';

  constructor(
    private router: Router,
    private candidatureService: CandidatureService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    
    if (userId) {
      this.currentCandidateId = userId;
      console.log('✅ ID du candidat connecté:', this.currentCandidateId);
      this.loadCandidatures();
    } else {
      console.error('❌ Aucun candidat connecté - Token invalide ou expiré');
      this.isLoading = false;
      this.router.navigate(['/login']);
    }
  }
getCompanyName(offer: Offer): string {
  // Cas 1 → companyId est un objet avec name
  if (offer.companyId && typeof offer.companyId === 'object' && offer.companyId.name) {
    return offer.companyId.name;
  }

  // Cas 2 → companyId est un ID (string)
  if (offer.companyId && typeof offer.companyId === 'string') {
    return 'Entreprise'; // Ou afficher un placeholder
  }

  // Cas 3 → company est directement présent
  if (offer.company) {
    return offer.company;
  }

  return 'Entreprise inconnue';
  
}

  loadCandidatures(): void {
    this.isLoading = true;
    
    this.candidatureService.getMyCandidatures(this.currentCandidateId).subscribe({
      next: (data) => {
        console.log('✅ Candidatures chargées:', data);
        this.candidatures = data;
        this.filteredCandidatures = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Erreur chargement candidatures:', err);
        this.isLoading = false;
        
        if (err.status === 401) {
          console.error('Token expiré ou invalide - Redirection...');
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  filterByStatus(status: string): void {
    this.activeFilter = status;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.candidatures];

    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(c => c.status === this.activeFilter);
    }

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.offerId.title.toLowerCase().includes(query) ||
        (c.offerId.company?.toLowerCase().includes(query)) ||
        (c.offerId.companyId?.name?.toLowerCase().includes(query))
      );
    }

    this.filteredCandidatures = filtered;
  }

  getStatusCount(status: string): number {
    return this.candidatures.filter(c => c.status === status).length;
  }

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

  getSectorEmoji(sector: string): string {
    const emojis: { [key: string]: string } = {
      'Informatique': '💻',
      'Marketing': '📱',
      'Finance': '💰',
      'RH': '👥',
      'Vente': '🛍️',
      'Santé': '🏥',
      'Éducation': '📚',
      'Ingénierie': '⚙️',
      'Design': '🎨',
      'Agriculture': '🌾'
    };
    return emojis[sector] || '🏢';
  }

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

  // 🆕 Afficher les détails de l'offre dans une modal
  viewOfferDetails(offer: Offer): void {
    this.selectedOffer = offer;
    this.showOfferModal = true;
  }

  // 🆕 Fermer la modal de l'offre
  closeOfferModal(): void {
    this.showOfferModal = false;
    this.selectedOffer = null;
  }

  deleteCandidature(id: string): void {
    this.candidatureToDelete = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.candidatureToDelete) return;

    this.candidatureService.deleteCandidature(this.candidatureToDelete).subscribe({
      next: () => {
        console.log('✅ Candidature supprimée avec succès');
        this.candidatures = this.candidatures.filter(c => c._id !== this.candidatureToDelete);
        this.applyFilters();
        this.showDeleteModal = false;
        this.candidatureToDelete = null;
      },
      error: (err) => {
        console.error('❌ Erreur suppression:', err);
        this.showDeleteModal = false;
        this.candidatureToDelete = null;
        alert('Erreur lors de la suppression de la candidature');
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.candidatureToDelete = null;
  }
}