import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';
import { OffersformComponent } from '../offersform/offersform.component';
import { MatDialog } from '@angular/material/dialog';
import { Offer, OfferService } from '../../../services/offers.service';
import { CandidatureService } from '../../../services/candidature.service';
import { Router } from '@angular/router';

interface Metric {
  value: number | string;
  label: string;
  icon: string;
  class: string;
  trendText: string;
  trendIcon: string;
  trendClass: string;
}

interface Tab {
  id: string;
  label: string;
  icon: string;
  count: number;
}

interface OfferDisplay extends Offer {
  displaySkills: string[];
  remainingSkills: number;
}

@Component({
  selector: 'app-company-offers',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, OffersformComponent],
  templateUrl: './company-offers.component.html',
  styleUrls: ['./company-offers.component.css']
})
export class CompanyOffersComponent implements OnInit {
  activeTab: string = 'published';
  searchTerm: string = '';
  selectedSector: string = '';
  selectedStatus: string = 'Tous les statuts';
  showForm = false;
  isLoading = true;
  
  offers: Offer[] = [];
  filteredOffers: OfferDisplay[] = [];
  
  metrics: Metric[] = [
    {
      value: 0,
      label: 'Offres Actives',
      icon: 'work',
      class: 'primary',
      trendText: '+0 ce mois',
      trendIcon: 'trending_up',
      trendClass: 'up'
    },
    {
      value: 0,
      label: 'Candidatures Totales',
      icon: 'people',
      class: 'success',
      trendText: '+0%',
      trendIcon: 'trending_up',
      trendClass: 'up'
    },
    {
      value: 0,
      label: 'Brouillons',
      icon: 'schedule',
      class: 'warning',
      trendText: '+0',
      trendIcon: 'trending_up',
      trendClass: 'up'
    },
    {
      value: 0,
      label: 'Archivées',
      icon: 'archive',
      class: 'info',
      trendText: '+0',
      trendIcon: 'trending_up',
      trendClass: 'up'
    }
  ];

  tabs: Tab[] = [
    { id: 'published', label: 'Publiées', icon: 'check_circle', count: 0 },
    { id: 'draft', label: 'Brouillons', icon: 'edit', count: 0 },
    { id: 'archived', label: 'Archivées', icon: 'archive', count: 0 }
  ];

  sectors: string[] = [
    'Informatique',
    'Marketing',
    'Finance',
    'Santé',
    'Éducation',
    'Commerce',
    'Industrie'
  ];

  constructor(
    private dialog: MatDialog,
    private offerService: OfferService,
    private candidatureService : CandidatureService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOffers();
  }

 loadOffers(): void {
  this.isLoading = true;
  
  this.offerService.getOffersByCompany().subscribe({
    next: (offers) => {
      this.offers = offers || [];

      // Pour chaque offre, récupérer le nombre de candidatures
      this.offers.forEach(offer => {
        this.candidatureService.getCandidatureCount(offer._id!).subscribe({
          next: (res) => {
            offer.applicationsCount = res.candidatureCount;
          },
          error: (err) => console.error(err)
        });
      });

      this.filterOffers();
      this.updateMetricsAndTabs();
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Erreur lors du chargement des offres:', error);
      this.isLoading = false;
    }
  });
}


  

  private updateMetricsAndTabs(): void {
    const publishedCount = this.offers.filter(o => o.status === 'Publié').length;
    const draftCount = this.offers.filter(o => o.status === 'Brouillon').length;
    const archivedCount = this.offers.filter(o => o.status === 'Archivé').length;
    const totalApplications = this.offers.reduce((sum, offer) => sum + (offer.applicationsCount || 0), 0);

    this.metrics = [
      {
        value: publishedCount,
        label: 'Offres Actives',
        icon: 'work',
        class: 'primary',
        trendText: '+3 ce mois',
        trendIcon: 'trending_up',
        trendClass: 'up'
      },
      {
        value: totalApplications,
        label: 'Candidatures Totales',
        icon: 'people',
        class: 'success',
        trendText: '+18%',
        trendIcon: 'trending_up',
        trendClass: 'up'
      },
      {
        value: draftCount,
        label: 'Brouillons',
        icon: 'schedule',
        class: 'warning',
        trendText: '-2',
        trendIcon: 'trending_down',
        trendClass: 'down'
      },
      {
        value: archivedCount,
        label: 'Archivées',
        icon: 'archive',
        class: 'info',
        trendText: '+2',
        trendIcon: 'trending_up',
        trendClass: 'up'
      }
    ];

    this.tabs = [
      { id: 'published', label: 'Publiées', icon: 'check_circle', count: publishedCount },
      { id: 'draft', label: 'Brouillons', icon: 'edit', count: draftCount },
      { id: 'archived', label: 'Archivées', icon: 'archive', count: archivedCount }
    ];
  }

  filterOffers(): void {
    let filtered = this.offers;

    if (this.activeTab === 'published') {
      filtered = filtered.filter(offer => offer.status === 'Publié');
    } else if (this.activeTab === 'draft') {
      filtered = filtered.filter(offer => offer.status === 'Brouillon');
    } else if (this.activeTab === 'archived') {
      filtered = filtered.filter(offer => offer.status === 'Archivé');
    }

    if (this.selectedSector) {
      filtered = filtered.filter(offer => offer.sector === this.selectedSector);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(offer => 
        offer.title.toLowerCase().includes(term) ||
        offer.description.toLowerCase().includes(term) ||
        offer.sector.toLowerCase().includes(term)
      );
    }

    this.filteredOffers = filtered.map(offer => this.prepareOfferDisplay(offer));
  }

  prepareOfferDisplay(offer: Offer): OfferDisplay {
    const requiredSkills = offer.requiredSkills || [];
    const maxSkills = 3;
    const displaySkills = requiredSkills.slice(0, maxSkills);
    const remainingSkills = Math.max(0, requiredSkills.length - maxSkills);

    return {
      ...offer,
      displaySkills,
      remainingSkills
    };
  }

  // Méthodes utilitaires
  getRemainingDays(endOffreDate: string): string {
    if (!endOffreDate) return 'Pas de deadline';
    
    const deadline = new Date(endOffreDate);
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'Expiré';
    if (days === 0) return 'Expire aujourd\'hui';
    if (days === 1) return '1 jour restant';
    return `${days} jours restants`;
  }

  isUrgent(endOffreDate: string): boolean {
    if (!endOffreDate) return false;
    
    const deadline = new Date(endOffreDate);
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    return days <= 3 && days >= 0;
  }

  // Autres méthodes
  changeTab(tabId: string): void {
    this.activeTab = tabId;
    this.filterOffers();
  }

  onSearch(): void {
    this.filterOffers();
  }

  onSectorFilter(): void {
    this.filterOffers();
  }

  openStatusFilter(): void {
    console.log('Ouvrir le filtre de statut');
  }

  editOffer(offer: OfferDisplay): void {
  }

viewCandidates(offer: OfferDisplay): void {
  // Naviguer vers la liste des candidats avec l'ID de l'offre
  this.router.navigate(['/company/candidates', offer._id], {
    queryParams: { title: offer.title }
  });
}

  openMenu(offer: OfferDisplay): void {
  }

  getSectorClass(sector: string): string {
    const sectorMap: { [key: string]: string } = {
      'Informatique': 'it-sector',
      'Marketing': 'marketing-sector',
      'Finance': 'finance-sector',
      'Santé': 'health-sector',
      'Éducation': 'education-sector',
      'Commerce': 'commerce-sector',
      'Industrie': 'industry-sector'
    };
    return sectorMap[sector] || 'it-sector';
  }

  getSectorIcon(sector: string): string {
    const iconMap: { [key: string]: string } = {
      'Informatique': 'computer',
      'Marketing': 'campaign',
      'Finance': 'account_balance',
      'Santé': 'local_hospital',
      'Éducation': 'school',
      'Commerce': 'store',
      'Industrie': 'precision_manufacturing'
    };
    return iconMap[sector] || 'work';
  }

  getExperienceClass(level: string): string {
    return level.toLowerCase();
  }

  getRemoteIcon(remoteOption: string): string {
    const iconMap: { [key: string]: string } = {
      'Oui': 'home',
      'Non': 'business',
      'Hybride': 'laptop_chromebook'
    };
    return iconMap[remoteOption] || 'laptop_chromebook';
  }

  showOfferForm = false;

  openCreateOfferPopup(): void {
    const dialogRef = this.dialog.open(OffersformComponent, {
      width: '90%',
      maxWidth: '1200px',
      height: '90vh',
      panelClass: 'custom-dialog-container',
      disableClose: true,
      data: { isEditMode: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Offre créée :', result);
        this.loadOffers();
      }
    });
  }

  closeForm() {
    this.showOfferForm = false;
  }

  getStatusClass(status: string = 'Publié'): string {
    const statusMap: { [key: string]: string } = {
      'Publié': 'status-published',
      'Brouillon': 'status-draft',
      'Archivé': 'status-archived'
    };
    return statusMap[status] || 'status-published';
  }
}