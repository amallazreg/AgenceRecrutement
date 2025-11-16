import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarAcceuilComponent } from '../../shared/sidebar-acceuil/sidebar-acceuil.component';
import { Offer, OfferService } from '../../services/offers.service';
import { OfferHelperServiceService, SpecificField } from '../../services/offer-helper-service.service';



@Component({
  selector: 'app-job-offers',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarAcceuilComponent],
  templateUrl: './job-offers.component.html',
  styleUrls: ['./job-offers.component.css']
})
export class JobOffersComponent implements OnInit {
  // Données
  offers: Offer[] = [];
  filteredOffers: Offer[] = [];
  selectedOffer: Offer | null = null;
  companyNames: { [key: string]: string } = {};

  // Recherche et filtres
  searchQuery: string = '';
  selectedCategory: string = 'all';
  selectedType: string = 'all';
  selectedLocation: string = 'all';
  showRemoteOnly: boolean = false;
  
  // UI States
  isDetailModalOpen: boolean = false;
  isLoading: boolean = true;
  viewMode: 'grid' | 'list' = 'grid';

  // Catégories disponibles
  categories: string[] = [
    'Technologie',
    'Marketing',
    'Finance',
    'Santé',
    'Éducation',
    'Commerce',
    'Industrie'
  ];
  
  // Types de contrat
  contractTypes: string[] = ['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance'];
  
  // ============================================
  // SYSTÈME D'ICÔNES EMOJI PAR SECTEUR
  // ============================================
  private sectorEmojis: { [key: string]: string } = {
    'Technologie': '💻',
    'Marketing': '📢',
    'Finance': '💰',
    'Santé': '🏥',
    'Éducation': '📚',
    'Commerce': '🛍️',
    'Industrie': '🏭',
    
    // Variations possibles
    'Informatique': '🖥️',
    'Digital Marketing': '📱',
    'Banque': '🏦',
    'Médecine': '⚕️',
    'Formation': '🎓',
    'E-commerce': '🛒',
    'Production': '⚙️',
    
    // Par défaut
    'Autre': '💼'
  };

  // ============================================
  // ICÔNES PAR TYPE DE CONTRAT
  // ============================================
  private contractTypeEmojis: { [key: string]: string } = {
    'CDI': '📝',
    'CDD': '📄',
    'Stage': '🎓',
    'Freelance': '💼',
    'Alternance': '🔄',
    'Intérim': '⏱️',
    'Temps Partiel': '⏰',
    'Temps Plein': '⌚'
  };

  // ============================================
  // ICÔNES PAR NIVEAU D'EXPÉRIENCE
  // ============================================
  private experienceEmojis: { [key: string]: string } = {
    'Débutant': '🌱',
    'Junior': '🌿',
    'Intermédiaire': '🌳',
    'Senior': '🏆',
    'Expert': '⭐',
    'Manager': '👔',
    'Directeur': '💎',
    '0-1 ans': '🌱',
    '1-3 ans': '🌿',
    '3-5 ans': '🌳',
    '5+ ans': '🏆',
    '10+ ans': '⭐'
  };

  // ============================================
  // MAPPING BACKEND -> EMOJIS
  // ============================================
  private backendIconToEmoji: { [key: string]: string } = {
    'computer': '💻',
    'campaign': '📢',
    'account_balance': '💰',
    'local_hospital': '🏥',
    'school': '📚',
    'store': '🛍️',
    'precision_manufacturing': '🏭'
  };

  constructor(
    private router: Router, 
    private offersService: OfferService,
    private offerHelperService: OfferHelperServiceService
  ) {}

  ngOnInit(): void {
    this.loadJobOffers();
  }

  // ============================================
  // MÉTHODES POUR OBTENIR LES ICÔNES EMOJI
  // ============================================
  
  /**
   * Obtenir l'emoji d'un secteur
   * Compatible avec les données du backend
   */
  getSectorEmoji(sector: string): string {
    // Recherche directe par nom de secteur
    if (this.sectorEmojis[sector]) {
      return this.sectorEmojis[sector];
    }
    
    // Recherche case-insensitive
    const sectorLower = sector.toLowerCase();
    const foundKey = Object.keys(this.sectorEmojis).find(
      key => key.toLowerCase() === sectorLower
    );
    
    if (foundKey) {
      return this.sectorEmojis[foundKey];
    }
    
    // Par défaut
    return this.sectorEmojis['Autre'];
  }

  /**
   * Convertir une icône Material du backend en emoji
   */
  convertBackendIconToEmoji(materialIcon: string): string {
    return this.backendIconToEmoji[materialIcon] || '💼';
  }

  /**
   * Obtenir l'emoji d'un type de contrat
   */
  getContractTypeEmoji(contractType: string): string {
    return this.contractTypeEmojis[contractType] || '📋';
  }

  /**
   * Obtenir l'emoji d'un niveau d'expérience
   */
  getExperienceEmoji(experience: string): string {
    // Recherche exacte
    if (this.experienceEmojis[experience]) {
      return this.experienceEmojis[experience];
    }
    
    // Recherche par mots-clés
    const expLower = experience.toLowerCase();
    if (expLower.includes('débutant') || expLower.includes('0-1')) {
      return '🌱';
    } else if (expLower.includes('1-3') || expLower.includes('junior')) {
      return '🌿';
    } else if (expLower.includes('3-5') || expLower.includes('intermédiaire')) {
      return '🌳';
    } else if (expLower.includes('5+') || expLower.includes('senior')) {
      return '🏆';
    } else if (expLower.includes('10+') || expLower.includes('expert')) {
      return '⭐';
    }
    
    return '📈';
  }

  /**
   * Obtenir la classe CSS de couleur pour un badge de secteur
   */
  getSectorBadgeClass(sector: string): string {
    const classes: { [key: string]: string } = {
      'Technologie': 'badge-tech',
      'Marketing': 'badge-marketing',
      'Finance': 'badge-finance',
      'Santé': 'badge-health',
      'Éducation': 'badge-education',
      'Commerce': 'badge-commerce',
      'Industrie': 'badge-industry'
    };
    
    return classes[sector] || 'badge-default';
  }

  /**
   * Obtenir la classe CSS pour un type de contrat
   */
  getContractTypeBadgeClass(contractType: string): string {
    const type = contractType.toLowerCase();
    return `badge-${type}`;
  }

  // ============================================
  // CHARGEMENT DES OFFRES
  // ============================================
  
  loadJobOffers(): void {
    this.isLoading = true;

    this.offersService.getAllOffers().subscribe({
      next: (offers) => {
        this.offers = offers || [];

        // Récupérer le nom de chaque company
        this.offers.forEach(offer => {
          offer.daysRemaining = offer.daysRemaining ?? 0;
          if (offer.companyId) {
            this.offersService.getCompanyById(offer.companyId._id).subscribe(company => {
              this.companyNames[offer.companyId.name!] = company.name;
            });
          }
        });

        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des offres:', error);
        this.isLoading = false;
      }
    });
  }

  calculateDaysRemaining(endDate: string): number {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getStatusInfo(offer: Offer): string {
    const days = this.calculateDaysRemaining(offer.endOffreDate);
    if (days < 0) return 'Offre expirée';
    if (days === 0) return 'Dernier jour';
    if (days <= 3) return `Plus que ${days} jours`;
    return `${days} jours restants`;
  } 

  getSpecificFields(offer: Offer): SpecificField[] {
    return this.offerHelperService.getSpecificFields(offer);
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  asArray(value: any): string[] {
    return Array.isArray(value) ? value : [value];
  }

  // ============================================
  // FILTRAGE ET RECHERCHE
  // ============================================
  
  applyFilters(): void {
    this.filteredOffers = this.offers.filter(offer => {
      // Filtre uniquement les offres publiées
      if (offer.status !== 'Publié') return false;

      const matchesSearch = 
        offer.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        offer.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (offer.requiredSkills || []).some(skill => skill.toLowerCase().includes(this.searchQuery.toLowerCase()));
      
      const matchesCategory = this.selectedCategory === 'all' || offer.sector === this.selectedCategory;
      const matchesType = this.selectedType === 'all' || offer.contractType === this.selectedType;
      const matchesLocation = this.selectedLocation === 'all' || offer.location === this.selectedLocation;
      const matchesRemote = !this.showRemoteOnly || offer.remoteOption;
      
      return matchesSearch && matchesCategory && matchesType && matchesLocation && matchesRemote;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.selectedType = 'all';
    this.selectedLocation = 'all';
    this.showRemoteOnly = false;
    this.applyFilters();
  }

  // ============================================
  // GESTION DU MODAL
  // ============================================
  
  openOfferDetails(offer: Offer): void {
    this.selectedOffer = offer;
    this.isDetailModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedOffer = null;
    document.body.style.overflow = 'auto';
  }

  applyToOffer(offerId: string): void {
    console.log('Postuler à l\'offre:', offerId);
    // TODO: Implémenter la logique de candidature
    alert('Candidature envoyée avec succès ! 🎉');
    this.closeDetailModal();
  }

  // ============================================
  // UTILITAIRES
  // ============================================
  
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  getDaysRemaining(deadline: Date): number {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getUniqueLocations(): string[] {
    return [...new Set(this.offers.map(offer => offer.location))];
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}