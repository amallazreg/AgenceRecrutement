import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarAcceuilComponent } from '../../shared/sidebar-acceuil/sidebar-acceuil.component';
import { Offer, OfferService } from '../../services/offers.service';
import { OfferHelperServiceService, SpecificField } from '../../services/offer-helper-service.service';
import { CandidatureService } from '../../services/candidature.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { MatchScoreService, OfferWithScore } from '../../services/match-score.service';

@Component({
  selector: 'app-job-offers',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarAcceuilComponent],
  templateUrl: './job-offers.component.html',
  styleUrls: ['./job-offers.component.css']
})
export class JobOffersComponent implements OnInit {
  // Données
  offers: Offer[] = []; // 🔥 Toutes les offres normales
  filteredOffers: Offer[] = [];
  selectedOffer: Offer | null = null;
  companyNames: { [key: string]: string } = {};
  
  // 🔥 Données de recommandation (de l'API)
  recommendedOffers: OfferWithScore[] = []; // Offres recommandées de l'API
  offersWithScores: Map<string, number> = new Map(); // offerId -> matchingScore
  
  // 🔥 Mode d'affichage
  showOnlyRecommended: boolean = false; // false = toutes les offres, true = recommandées uniquement

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
  
  // 🔥 Mode de tri
  sortMode: 'score' | 'date' | 'none' = 'none';

  // Variables pour le modal de candidature
  isApplyModalOpen: boolean = false;
  cvFile: File | null = null;
  cvFileName: string = '';
  motivationLetterFile: File | null = null;
  motivationLetterFileName: string = '';

  // Catégories et types
  categories: string[] = [
    'Technologie', 'Marketing', 'Finance', 'Santé',
    'Éducation', 'Commerce', 'Industrie'
  ];
  contractTypes: string[] = ['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance'];

  // Emojis mappings
  private sectorEmojis: { [key: string]: string } = {
    'Technologie': '💻', 'Marketing': '📢', 'Finance': '💰',
    'Santé': '🏥', 'Éducation': '📚', 'Commerce': '🛍️',
    'Industrie': '🏭', 'Informatique': '🖥️', 'Autre': '💼'
  };

  private contractTypeEmojis: { [key: string]: string } = {
    'CDI': '📝', 'CDD': '📄', 'Stage': '🎓',
    'Freelance': '💼', 'Alternance': '🔄'
  };

  private experienceEmojis: { [key: string]: string } = {
    'Débutant': '🌱', 'Junior': '🌿', 'Intermédiaire': '🌳',
    'Senior': '🏆', 'Expert': '⭐'
  };
minScore: any;

  constructor(
    private router: Router,
    private offersService: OfferService,
    private offerHelperService: OfferHelperServiceService,
    private candidatureService: CandidatureService,
    private authService: AuthServiceService,
    private recommendationService: MatchScoreService
  ) {}

ngOnInit(): void {
  const candidateId = this.authService.getUserId() as string;

  if (candidateId) {
    this.loadRecommendationsOnly(candidateId);
  } else {
    this.filteredOffers = [];
    this.isLoading = false;
  }
}


  // 🔥 Charger TOUTES les offres + les recommandations en parallèle
 

  // 🔥 Charger les recommandations (pour avoir les scores)
loadRecommendationsOnly(candidateId: string): void {
  this.isLoading = true;

  this.recommendationService.getRecommendedOffers(candidateId).subscribe({
    next: (response) => {
      this.recommendedOffers = response.recommendations || [];

      // Remplace TOUTES les offres par les recommandations
      this.offers = [...this.recommendedOffers];

      // Remplit le Map des scores
      this.offersWithScores.clear();
      this.recommendedOffers.forEach(offer => {
        this.offersWithScores.set(offer._id!, offer.matchingScore);
      });

      // Appliquer filtres
      this.applyFilters();
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Erreur lors du chargement des recommandations:', err);
      this.isLoading = false;
    }
  });
}

  // 🔥 MÉTHODE PRINCIPALE : Toggle entre toutes les offres et recommandées
  toggleRecommendedOnly(): void {
    this.showOnlyRecommended = !this.showOnlyRecommended;
    
    if (this.showOnlyRecommended) {
      // Mode "Recommandées uniquement"
      console.log('🔥 Affichage des offres recommandées (score >= 40%)');
      this.sortMode = 'score'; // Activer le tri par score automatiquement
    } else {
      // Mode "Toutes les offres"
      console.log('📋 Affichage de toutes les offres');
      this.sortMode = 'none'; // Désactiver le tri
    }
    
    this.applyFilters();
  }

  // 🔥 Obtenir le score d'une offre (0-1)
  getOfferScore(offerId: string): number {
    return this.offersWithScores.get(offerId) || 0;
  }

  // 🔥 Obtenir le score en pourcentage (0-100)
  getOfferScorePercentage(offerId: string): number {
    const score = this.getOfferScore(offerId);
    return this.recommendationService.scoreToPercentage(score);
  }

  // 🔥 Vérifier si une offre est recommandée
  isOfferRecommended(offerId: string): boolean {
    return this.offersWithScores.has(offerId);
  }

  // 🔥 Vérifier si une offre a un score >= 40%
  hasGoodMatch(offerId: string): boolean {
    const percentage = this.getOfferScorePercentage(offerId);
    return percentage >= 40; // Bon match ou mieux
  }

  // 🔥 Tri par score
  sortByScore(): void {
    if (this.sortMode === 'score') {
      this.filteredOffers.sort((a, b) => {
        const scoreA = this.getOfferScore(a._id!);
        const scoreB = this.getOfferScore(b._id!);
        return scoreB - scoreA; // Décroissant
      });
    }
  }

  // 🔥 AMÉLIORATION : Filtres intelligents
  applyFilters(): void {
    // 🎯 LOGIQUE PRINCIPALE
    if (this.showOnlyRecommended) {
      // ============================================
      // MODE "RECOMMANDÉES UNIQUEMENT" (score >= 40%)
      // ============================================
      this.filteredOffers = this.recommendedOffers
        .filter(offer => {
          // Filtre 1 : Offres publiées uniquement
          if (offer.status !== 'Publié') return false;

          // Filtre 2 : Score >= 40% (Bon match minimum)
          const scorePercentage = this.getOfferScorePercentage(offer._id!);
          if (scorePercentage < 40) return false;

          // Filtre 3 : Recherche
          const matchesSearch = 
            offer.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            offer.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
           (offer.requiredSkills || []).some((skill: string) =>
    skill.toLowerCase().includes(this.searchQuery.toLowerCase())
);

          
          // Filtre 4 : Catégorie
          const matchesCategory = this.selectedCategory === 'all' || offer.sector === this.selectedCategory;
          
          // Filtre 5 : Type de contrat
          const matchesType = this.selectedType === 'all' || offer.contractType === this.selectedType;
          
          // Filtre 6 : Localisation
          const matchesLocation = this.selectedLocation === 'all' || offer.location === this.selectedLocation;
          
          // Filtre 7 : Remote
          const matchesRemote = !this.showRemoteOnly || offer.remoteOption;
          
          return matchesSearch && matchesCategory && matchesType && 
                 matchesLocation && matchesRemote;
        });

      // Tri automatique par score décroissant
      this.sortByScore();
      
    } else {
      // ============================================
      // MODE "TOUTES LES OFFRES"
      // ============================================
      this.filteredOffers = this.offers.filter(offer => {
        if (offer.status !== 'Publié') return false;

        const matchesSearch = 
          offer.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          offer.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (offer.requiredSkills || []).some(skill => 
            skill.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
        
        const matchesCategory = this.selectedCategory === 'all' || offer.sector === this.selectedCategory;
        const matchesType = this.selectedType === 'all' || offer.contractType === this.selectedType;
        const matchesLocation = this.selectedLocation === 'all' || offer.location === this.selectedLocation;
        const matchesRemote = !this.showRemoteOnly || offer.remoteOption;
        
        return matchesSearch && matchesCategory && matchesType && 
               matchesLocation && matchesRemote;
      });

      // Tri optionnel par score si activé manuellement
      if (this.sortMode === 'score') {
        this.sortByScore();
      }
    }

    console.log(`📊 Offres affichées: ${this.filteredOffers.length}`);
  }

  // 🔥 Compter les offres recommandées (score >= 40%)
  getRecommendedCount(): number {
    return this.recommendedOffers.filter(offer => {
      const scorePercentage = this.getOfferScorePercentage(offer._id!);
      return scorePercentage >= 40 && offer.status === 'Publié';
    }).length;
  }

  // Méthodes existantes...
  getSectorEmoji(sector: string): string {
    return this.sectorEmojis[sector] || this.sectorEmojis['Autre'];
  }

  getContractTypeEmoji(contractType: string): string {
    return this.contractTypeEmojis[contractType] || '📋';
  }

  getExperienceEmoji(experience: string): string {
    if (this.experienceEmojis[experience]) {
      return this.experienceEmojis[experience];
    }
    const expLower = experience.toLowerCase();
    if (expLower.includes('débutant')) return '🌱';
    if (expLower.includes('junior')) return '🌿';
    if (expLower.includes('intermédiaire')) return '🌳';
    if (expLower.includes('senior')) return '🏆';
    return '📈';
  }

  getContractTypeBadgeClass(contractType: string): string {
    return `badge-${contractType.toLowerCase()}`;
  }

  // Méthodes de matching
  getMatchColor(score: number): string {
    return this.recommendationService.getMatchColor(score);
  }

  getMatchLabel(score: number): string {
    return this.recommendationService.getMatchLabel(score);
  }

  getMatchEmoji(score: number): string {
    return this.recommendationService.getMatchEmoji(score);
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
    this.showOnlyRecommended = false; // Retour à toutes les offres
    this.sortMode = 'none';
    this.applyFilters();
  }

  // 🔥 Toggle tri par score manuel
  toggleSortByScore(): void {
    this.sortMode = this.sortMode === 'score' ? 'none' : 'score';
    this.applyFilters();
  }

  openOfferDetails(offer: Offer) {
    this.offersService.incrementViews(offer._id!).subscribe({
      next: (updatedOffer) => {
        offer.views = updatedOffer.views;
      },
      error: (err) => console.error('Erreur incrémentation vues', err)
    });

    this.selectedOffer = offer;
    this.isDetailModalOpen = true;
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedOffer = null;
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  getUniqueLocations(): string[] {
    return [...new Set(this.offers.map(offer => offer.location))];
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

  // Méthodes du modal de candidature
  openApplyModal() {
    this.isApplyModalOpen = true;
  }

  closeApplyModal() {
    this.isApplyModalOpen = false;
    this.cvFile = null;
    this.motivationLetterFile = null;
  }

  onFileSelected(event: any, type: 'cv' | 'motivationLetter') {
    const file: File = event.target.files[0];
    if (!file) return;

    if (type === 'cv') {
      this.cvFile = file;
      this.cvFileName = file.name;
    } else {
      this.motivationLetterFile = file;
      this.motivationLetterFileName = file.name;
    }
  }

  removeFile(type: 'cv' | 'motivationLetter') {
    if (type === 'cv') {
      this.cvFile = null;
      this.cvFileName = '';
    } else {
      this.motivationLetterFile = null;
      this.motivationLetterFileName = '';
    }
  }

  submitApplication() {
    if (!this.selectedOffer) return;

    const candidateId = this.authService.getUserId() as string;
    const offerId = this.selectedOffer._id as string;

    this.candidatureService.applyOffer(offerId, candidateId, this.cvFile, this.motivationLetterFile)
      .subscribe({
        next: (res) => {
          alert(res.message);
          this.closeApplyModal();
          this.closeDetailModal();
        },
        error: (err) => {
          console.error('Erreur candidature', err);
          alert('Erreur lors de l\'envoi de la candidature');
        }
      });
  }
}