import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';
import { OffersformComponent } from '../offersform/offersform.component';
interface Offer {
  _id: string;
  companyId: string;
  sector: string;
  title: string;
  description: string;
  requiredSkills: string[];
  experienceLevel: 'Junior' | 'Intermediate' | 'Senior';
  contractType: string;
  location: string;
  salaryRange: string;
  startDate?: Date;
  applicationDeadline?: Date;
  workingHours?: string;
  remoteOption: 'Oui' | 'Non' | 'Hybride';
  status: 'Publié' | 'Brouillon' | 'Archivé';
  views?: number;
  applicationsCount?: number;
  // Champs spécifiques selon le secteur
  programmingLanguages?: string[];
  frameworks?: string[];
  databaseKnowledge?: string[];
  tools?: string[];
  // ... autres champs spécifiques
}

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
  imports: [CommonModule, FormsModule ,SidebarComponent, OffersformComponent],
  templateUrl: './company-offers.component.html',
  styleUrls: ['./company-offers.component.css']
})
export class CompanyOffersComponent implements OnInit {
  // État de l'application
  activeTab: string = 'published';
  searchTerm: string = '';
  selectedSector: string = '';
  selectedStatus: string = 'Tous les statuts';
  showForm = false;
  // Données
  offers: Offer[] = [];
  filteredOffers: OfferDisplay[] = [];
  
  metrics: Metric[] = [
    {
      value: 12,
      label: 'Offres Actives',
      icon: 'work',
      class: 'primary',
      trendText: '+3 ce mois',
      trendIcon: 'trending_up',
      trendClass: 'up'
    },
    {
      value: 248,
      label: 'Candidatures Totales',
      icon: 'people',
      class: 'success',
      trendText: '+18%',
      trendIcon: 'trending_up',
      trendClass: 'up'
    },
    {
      value: 5,
      label: 'Brouillons',
      icon: 'schedule',
      class: 'warning',
      trendText: '-2',
      trendIcon: 'trending_down',
      trendClass: 'down'
    },
    {
      value: 8,
      label: 'Archivées',
      icon: 'archive',
      class: 'info',
      trendText: '+2',
      trendIcon: 'trending_up',
      trendClass: 'up'
    }
  ];

  tabs: Tab[] = [
    { id: 'published', label: 'Publiées', icon: 'check_circle', count: 12 },
    { id: 'draft', label: 'Brouillons', icon: 'edit', count: 5 },
    { id: 'archived', label: 'Archivées', icon: 'archive', count: 8 }
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

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    // Données de démonstration - À remplacer par un appel API
    this.offers = [
      {
        _id: '1',
        companyId: 'comp1',
        sector: 'Informatique',
        title: 'Développeur Full Stack Senior',
        description: 'Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe technique et participer au développement de nos applications web.',
        requiredSkills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Docker', 'AWS'],
        experienceLevel: 'Senior',
        contractType: 'CDI',
        location: 'Paris, France',
        salaryRange: '45K - 60K €',
        remoteOption: 'Hybride',
        status: 'Publié',
        views: 342,
        applicationsCount: 28,
        applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        programmingLanguages: ['JavaScript', 'TypeScript'],
        frameworks: ['React', 'Node.js', 'Express']
      },
      {
        _id: '2',
        companyId: 'comp1',
        sector: 'Marketing',
        title: 'Chef de Projet Marketing Digital',
        description: 'Rejoignez notre équipe marketing pour piloter des campagnes digitales innovantes et développer notre présence en ligne.',
        requiredSkills: ['SEO/SEM', 'Google Ads', 'Analytics'],
        experienceLevel: 'Intermediate',
        contractType: 'CDI',
        location: 'Lyon, France',
        salaryRange: '38K - 48K €',
        remoteOption: 'Non',
        status: 'Publié',
        views: 187,
        applicationsCount: 15,
        applicationDeadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)
      },
      {
        _id: '3',
        companyId: 'comp1',
        sector: 'Finance',
        title: 'Analyste Financier',
        description: 'Nous cherchons un analyste financier pour renforcer notre département finance et contribuer à nos analyses stratégiques.',
        requiredSkills: ['Excel', 'SAP', 'Reporting'],
        experienceLevel: 'Intermediate',
        contractType: 'CDI',
        location: 'Paris La Défense',
        salaryRange: '40K - 55K €',
        remoteOption: 'Hybride',
        status: 'Publié',
        views: 256,
        applicationsCount: 42,
        applicationDeadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000)
      },
      {
        _id: '4',
        companyId: 'comp1',
        sector: 'Santé',
        title: 'Infirmier(ère) en Service de Réanimation',
        description: 'Rejoignez notre équipe médicale dans un service de réanimation moderne et participez aux soins intensifs.',
        requiredSkills: ['Diplôme d\'État', 'Réanimation', 'Garde'],
        experienceLevel: 'Junior',
        contractType: 'CDI',
        location: 'Marseille',
        salaryRange: '30K - 38K €',
        remoteOption: 'Non',
        status: 'Publié',
        views: 124,
        applicationsCount: 9,
        applicationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      },
      {
        _id: '5',
        companyId: 'comp1',
        sector: 'Éducation',
        title: 'Professeur de Mathématiques - Lycée',
        description: 'Enseignez les mathématiques à des élèves de lycée dans un établissement dynamique et innovant.',
        requiredSkills: ['Mathématiques', 'Lycée', 'CAPES'],
        experienceLevel: 'Intermediate',
        contractType: 'CDI',
        location: 'Toulouse',
        salaryRange: '28K - 35K €',
        remoteOption: 'Non',
        status: 'Publié',
        views: 98,
        applicationsCount: 12,
        applicationDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      },
      {
        _id: '6',
        companyId: 'comp1',
        sector: 'Commerce',
        title: 'Commercial B2B - Secteur Technologique',
        description: 'Développez notre portefeuille clients B2B dans le secteur technologique avec autonomie et opportunités de croissance.',
        requiredSkills: ['B2B', 'Prospection', 'CRM'],
        experienceLevel: 'Senior',
        contractType: 'CDI',
        location: 'Bordeaux + déplacements',
        salaryRange: '35K - 50K € + var',
        remoteOption: 'Hybride',
        status: 'Publié',
        views: 215,
        applicationsCount: 19,
        applicationDeadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000)
      }
    ];

    this.filterOffers();
  }

  filterOffers(): void {
    let filtered = this.offers;

    // Filtre par statut (onglet actif)
    if (this.activeTab === 'published') {
      filtered = filtered.filter(offer => offer.status === 'Publié');
    } else if (this.activeTab === 'draft') {
      filtered = filtered.filter(offer => offer.status === 'Brouillon');
    } else if (this.activeTab === 'archived') {
      filtered = filtered.filter(offer => offer.status === 'Archivé');
    }

    // Filtre par secteur
    if (this.selectedSector) {
      filtered = filtered.filter(offer => offer.sector === this.selectedSector);
    }

    // Filtre par recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(offer => 
        offer.title.toLowerCase().includes(term) ||
        offer.description.toLowerCase().includes(term) ||
        offer.sector.toLowerCase().includes(term)
      );
    }

    // Transformation pour l'affichage
    this.filteredOffers = filtered.map(offer => this.prepareOfferDisplay(offer));
  }

  prepareOfferDisplay(offer: Offer): OfferDisplay {
    const maxSkills = 3;
    const displaySkills = offer.requiredSkills.slice(0, maxSkills);
    const remainingSkills = Math.max(0, offer.requiredSkills.length - maxSkills);

    return {
      ...offer,
      displaySkills,
      remainingSkills
    };
  }

  // Actions des onglets
  changeTab(tabId: string): void {
    this.activeTab = tabId;
    this.filterOffers();
  }

  // Actions de recherche et filtres
  onSearch(): void {
    this.filterOffers();
  }

  onSectorFilter(): void {
    this.filterOffers();
  }

  openStatusFilter(): void {
    // Ouvrir un menu déroulant ou un dialog pour filtrer par statut
    console.log('Ouvrir le filtre de statut');
  }

  // Actions sur les offres
  createOffer(): void {
    // Navigation vers la page de création d'offre
    console.log('Créer une nouvelle offre');
    // this.router.navigate(['/offers/create']);
  }

  editOffer(offer: Offer): void {
    console.log('Modifier l\'offre:', offer._id);
    // this.router.navigate(['/offers/edit', offer._id]);
  }

  viewCandidates(offer: Offer): void {
    console.log('Voir les candidats pour:', offer.title);
    // this.router.navigate(['/offers', offer._id, 'candidates']);
  }

  openMenu(offer: Offer): void {
    console.log('Ouvrir le menu pour:', offer.title);
    // Ouvrir un menu contextuel avec plus d'options
  }

  // Méthodes utilitaires
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

  getRemainingDays(deadline?: Date): string {
    if (!deadline) return 'Pas de deadline';
    
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'Expiré';
    if (days === 0) return 'Expire aujourd\'hui';
    if (days === 1) return '1 jour restant';
    return `${days} jours restants`;
  }

  isUrgent(deadline?: Date): boolean {
    if (!deadline) return false;
    
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    return days <= 3 && days >= 0;
  }
}