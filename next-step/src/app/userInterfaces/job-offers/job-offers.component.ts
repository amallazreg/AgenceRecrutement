import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarAcceuilComponent } from '../../shared/sidebar-acceuil/sidebar-acceuil.component';

interface JobOffer {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string; // 'CDI', 'CDD', 'Stage', 'Freelance'
  salary?: string;
  description: string;
  requirements: string[];
  skills: string[];
  experience: string;
  postedDate: Date;
  deadline: Date;
  category: string;
  remote: boolean;
  logo?: string;
}

@Component({
  selector: 'app-job-offers',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarAcceuilComponent],
  templateUrl: './job-offers.component.html',
  styleUrls: ['./job-offers.component.css']
})
export class JobOffersComponent implements OnInit {
  // Données
  jobOffers: JobOffer[] = [];
  filteredOffers: JobOffer[] = [];
  selectedOffer: JobOffer | null = null;
  
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
    'Informatique',
    'Marketing',
    'Finance',
    'Santé',
    'Éducation',
    'Commerce',
    'Industrie'
  ];
  
  // Types de contrat
  contractTypes: string[] = ['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance'];
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadJobOffers();
  }

  // Charger les offres (simulé - à remplacer par un vrai appel API)
  loadJobOffers(): void {
    this.isLoading = true;
    
    // Simulation d'un appel API
    setTimeout(() => {
      this.jobOffers = this.getMockJobOffers();
      this.filteredOffers = [...this.jobOffers];
      this.isLoading = false;
    }, 800);
  }

  // Données mockées (à remplacer par votre API)
  getMockJobOffers(): JobOffer[] {
    return [
      {
        _id: '1',
        title: 'Développeur Full Stack Senior',
        company: 'TechCorp Tunisia',
        location: 'Tunis',
        type: 'CDI',
        salary: '3000 - 4500 TND',
        description: 'Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe dynamique. Vous travaillerez sur des projets innovants utilisant les dernières technologies.',
        requirements: [
          '5+ ans d\'expérience en développement web',
          'Maîtrise de React et Node.js',
          'Expérience avec MongoDB et PostgreSQL',
          'Bonnes compétences en communication'
        ],
        skills: ['React', 'Node.js', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS'],
        experience: '5+ ans',
        postedDate: new Date('2024-11-01'),
        deadline: new Date('2024-12-15'),
        category: 'Informatique',
        remote: true,
        logo: '💻'
      },
      {
        _id: '2',
        title: 'Chef de Projet Marketing Digital',
        company: 'Digital Solutions',
        location: 'Sousse',
        type: 'CDI',
        salary: '2500 - 3500 TND',
        description: 'Pilotez nos campagnes marketing digital et développez notre présence en ligne. Poste stratégique au sein d\'une entreprise en forte croissance.',
        requirements: [
          '3+ ans en marketing digital',
          'Maîtrise des outils SEO/SEA',
          'Expérience en gestion d\'équipe',
          'Créativité et sens de l\'analyse'
        ],
        skills: ['SEO', 'Google Ads', 'Analytics', 'Social Media', 'Content Marketing'],
        experience: '3-5 ans',
        postedDate: new Date('2024-11-05'),
        deadline: new Date('2024-12-20'),
        category: 'Marketing',
        remote: false,
        logo: '📢'
      },
      {
        _id: '3',
        title: 'Développeur Mobile Flutter',
        company: 'AppMakers',
        location: 'Sfax',
        type: 'CDD',
        salary: '2000 - 3000 TND',
        description: 'Rejoignez notre équipe mobile pour créer des applications innovantes. Environnement agile et technologies de pointe.',
        requirements: [
          '2+ ans d\'expérience Flutter',
          'Connaissance de Dart',
          'Expérience avec Firebase',
          'Portfolio d\'applications publiées'
        ],
        skills: ['Flutter', 'Dart', 'Firebase', 'REST API', 'Git'],
        experience: '2-3 ans',
        postedDate: new Date('2024-11-08'),
        deadline: new Date('2024-12-10'),
        category: 'Informatique',
        remote: true,
        logo: '📱'
      },
      {
        _id: '4',
        title: 'Data Analyst',
        company: 'FinTech Insights',
        location: 'Tunis',
        type: 'CDI',
        salary: '2800 - 4000 TND',
        description: 'Analysez les données financières et créez des insights stratégiques pour nos clients. Poste clé dans une startup FinTech en pleine expansion.',
        requirements: [
          'Master en statistiques ou équivalent',
          'Maîtrise de Python et SQL',
          'Expérience en visualisation de données',
          'Anglais courant'
        ],
        skills: ['Python', 'SQL', 'Power BI', 'Tableau', 'Machine Learning'],
        experience: '2-4 ans',
        postedDate: new Date('2024-11-10'),
        deadline: new Date('2024-12-25'),
        category: 'Finance',
        remote: true,
        logo: '📊'
      },
      {
        _id: '5',
        title: 'Stage Développeur Web',
        company: 'WebAgency Pro',
        location: 'Monastir',
        type: 'Stage',
        salary: '400 - 600 TND',
        description: 'Stage de fin d\'études pour développeur web passionné. Accompagnement personnalisé et projets réels.',
        requirements: [
          'Étudiant en dernière année',
          'Bases solides en HTML/CSS/JavaScript',
          'Motivation et envie d\'apprendre',
          'Disponible 6 mois'
        ],
        skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
        experience: 'Débutant',
        postedDate: new Date('2024-11-12'),
        deadline: new Date('2024-12-05'),
        category: 'Informatique',
        remote: false,
        logo: '🎓'
      },
      {
        _id: '6',
        title: 'UX/UI Designer',
        company: 'Creative Studio',
        location: 'Tunis',
        type: 'Freelance',
        salary: '50 - 80 TND/jour',
        description: 'Mission freelance pour refonte d\'une plateforme e-commerce. Collaboration avec une équipe produit expérimentée.',
        requirements: [
          'Portfolio professionnel requis',
          'Maîtrise de Figma',
          'Expérience en design système',
          'Sensibilité UX forte'
        ],
        skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Design System'],
        experience: '3+ ans',
        postedDate: new Date('2024-11-11'),
        deadline: new Date('2024-11-30'),
        category: 'Informatique',
        remote: true,
        logo: '🎨'
      }
    ];
  }

  // Recherche et filtrage
  applyFilters(): void {
    this.filteredOffers = this.jobOffers.filter(offer => {
      const matchesSearch = 
        offer.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        offer.company.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        offer.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        offer.skills.some(skill => skill.toLowerCase().includes(this.searchQuery.toLowerCase()));
      
      const matchesCategory = this.selectedCategory === 'all' || offer.category === this.selectedCategory;
      const matchesType = this.selectedType === 'all' || offer.type === this.selectedType;
      const matchesLocation = this.selectedLocation === 'all' || offer.location === this.selectedLocation;
      const matchesRemote = !this.showRemoteOnly || offer.remote;
      
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
    this.filteredOffers = [...this.jobOffers];
  }

  // Ouvrir les détails d'une offre
  openOfferDetails(offer: JobOffer): void {
    this.selectedOffer = offer;
    this.isDetailModalOpen = true;
    document.body.style.overflow = 'hidden';
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
    return [...new Set(this.jobOffers.map(offer => offer.location))];
  }

  // Formater la date
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}