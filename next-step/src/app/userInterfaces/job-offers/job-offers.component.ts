import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarAcceuilComponent } from '../../shared/sidebar-acceuil/sidebar-acceuil.component';
import { Offer, OfferService } from '../../services/offers.service';
import { OfferHelperServiceService, SpecificField } from '../../services/offer-helper-service.service';
import { CandidatureService } from '../../services/candidature.service';
import { AuthServiceService } from '../../services/auth-service.service';



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

  // Variables pour le modal de candidature
  isApplyModalOpen: boolean = false;

  // Variables pour les fichiers
  cvFile: File | null = null;
  cvFileName: string = '';
  motivationLetterFile: File | null = null;
  motivationLetterFileName: string = '';

  
  
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
  
constructor(private router: Router, private offersService: OfferService,private offerHelperService : OfferHelperServiceService,private candidatureService : CandidatureService,
  private authService : AuthServiceService
) {}

  ngOnInit(): void {
  this.loadJobOffers();
}


  // Charger les offres (simulé - à remplacer par un vrai appel API)
loadJobOffers(): void {
  this.isLoading = true;

  this.offersService.getAllOffers().subscribe({
    next: (offers) => {
      this.offers = offers || [];

      // Récupérer le nom de chaque company
      this.offers.forEach(offer => {
        offer.daysRemaining = offer.daysRemaining ?? 0; // <-- Ici
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

  /**
   * Vérifie si la valeur est un tableau
   */
  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  /**
   * Convertit la valeur en tableau
   */
  asArray(value: any): string[] {
    return Array.isArray(value) ? value : [value];
  }

  // Recherche et filtrage
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


  // Recherche en temps réel
  onSearchChange(): void {
    this.applyFilters();
  }

  // Réinitialiser les filtres
  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.selectedType = 'all';
    this.selectedLocation = 'all';
    this.showRemoteOnly = false;
    this.filteredOffers = [...this.offers];
  }

openOfferDetails(offer: Offer) {
  // Incrémente les vues via le service
  this.offersService.incrementViews(offer._id!).subscribe({
    next: (updatedOffer) => {
      offer.views = updatedOffer.views; // met à jour localement pour affichage immédiat
    },
    error: (err) => console.error('Erreur lors de l\'incrémentation des vues', err)
  });

  // Ouvre le modal
  this.selectedOffer = offer;
  this.isDetailModalOpen = true;
}


  // Fermer le modal
  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedOffer = null;
    document.body.style.overflow = 'auto';
  }

  // Postuler à une offre
  applyToOffer(offerId: string): void {
    console.log('Postuler à l\'offre:', offerId);
    // TODO: Implémenter la logique de candidature
    alert('Candidature envoyée avec succès ! 🎉');
    this.closeDetailModal();
  }

  // Changer le mode d'affichage
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  // Calculer les jours restants
  getDaysRemaining(deadline: Date): number {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Obtenir les locations uniques
  getUniqueLocations(): string[] {
    return [...new Set(this.offers.map(offer => offer.location))];
  }

  // Formater la date
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

 


   // Méthodes pour le modal
  openApplyModal() {
    this.isApplyModalOpen = true;
  }

  closeApplyModal() {
    this.isApplyModalOpen = false;
    this.cvFile = null;
    this.motivationLetterFile = null;
  }

   // Méthodes pour gérer les fichiers
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
  console.log("l'id du user est ",candidateId) // remplace par l'ID connecté
  const offerId = this.selectedOffer._id as string;
  console.log("l'id d'offre est ", offerId);

 this.candidatureService.applyOffer(offerId, candidateId, this.cvFile, this.motivationLetterFile)
    .subscribe({
      next: (res) => {
        console.log('Candidature réussie', res);
        alert(res.message);
        this.closeApplyModal();
      },
      error: (err) => {
        console.error('Erreur candidature', err);
        alert('Erreur lors de l’envoi de la candidature');
      }
    });
}

}