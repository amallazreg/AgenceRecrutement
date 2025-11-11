import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile-service.service';

// Interfaces pour typer les données
interface Education {
  degree: string;
  institution: string;
  startYear: number | null;
  endYear: number | null;
}

interface Experience {
  company: string;
  position: string;
  startDate: string | null;
  endDate: string | null;
  description: string;
}

interface Language {
  name: string;
  level: string;
}

interface Step {
  title: string;
  icon: string;
}

@Component({
  selector: 'app-profile-completion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-completion.component.html',
  styleUrls: ['./profile-completion.component.css']
})
export class ProfileCompletionComponent implements OnInit {
  @Output() profileCompleted = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();

  isModalVisible = false;
  currentStep = 1;
  totalSteps = 5;

  steps: Step[] = [
    { title: 'Personal Info', icon: '👤' },
    { title: 'Specialty', icon: '💼' },
    { title: 'Education', icon: '🎓' },
    { title: 'Experience', icon: '💻' },
    { title: 'Languages & Links', icon: '🌐' }
  ];

  profileData = {
    dateOfBirth: '',
    gender: '',
    address: '',
    nationality: '',
    specialty: '',
    subSpecialties: [] as string[],
    skills: [] as string[],
    education: [
      { degree: '', institution: '', startYear: null, endYear: null }
    ] as Education[],
    experiences: [
      { company: '', position: '', startDate: null, endDate: null, description: '' }
    ] as Experience[],
    languages: [
      { name: '', level: '' }
    ] as Language[],
    linkedin: '',
    github: '',
    portfolio: ''
  };

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return !!this.profileData.dateOfBirth && 
               !!this.profileData.gender && 
               !!this.profileData.address && 
               !!this.profileData.nationality;
      
      case 2:
        return !!this.profileData.specialty && 
               this.profileData.skills.length > 0;
      
      case 3:
        return this.profileData.education.every(edu => 
          edu.degree && edu.institution && edu.startYear && edu.endYear
        );
      
      case 4:
        return this.profileData.experiences.every(exp => 
          exp.company && exp.position && exp.startDate && exp.endDate && exp.description
        );
      
      case 5:
        return this.profileData.languages.every(lang => 
          lang.name && lang.level
        );
      
      default:
        return false;
    }
  }

  isFormValid(): boolean {
    return this.steps.every((_, index) => this.isStepValid(index + 1));
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  isSubmitting = false;

  // Dictionnaire des sous-spécialités
  subSpecialtiesMap: { [key: string]: string[] } = {
    'Informatique': [
      'Développement Web',
      'Développement Mobile',
      'Data Science',
      'Cybersécurité',
      'Réseaux',
      'DevOps',
      'IA et Machine Learning'
    ],
    'Marketing': [
      'Marketing Digital',
      'SEO / SEA',
      'Communication',
      'Branding',
      'Études de Marché'
    ],
    'Finance': [
      'Comptabilité',
      'Audit',
      'Banque',
      'Contrôle de gestion',
      'Analyse financière'
    ],
    'Santé': [
      'Médecine',
      'Pharmacie',
      'Infirmier',
      'Biotechnologie',
      'Recherche médicale'
    ],
    'Éducation': [
      'Enseignement primaire',
      'Enseignement secondaire',
      'Formation professionnelle',
      'Pédagogie numérique'
    ],
    'Commerce': [
      'Vente',
      'Gestion commerciale',
      'E-commerce',
      'Logistique',
      'Import/Export'
    ],
    'Industrie': [
      'Production',
      'Maintenance',
      'Qualité',
      'Énergie',
      'Mécanique'
    ]
  };

  constructor(
    private router: Router,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      JSON.parse(userData);
    }
  }

  // --- Modal ---
  showModal(): void {
    this.isModalVisible = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.isModalVisible = false;
    document.body.style.overflow = 'auto';
    this.modalClosed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal();
    }
  }

  // --- Étapes ---
  get progressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  getStepTitle(): string {
    return this.steps[this.currentStep - 1]?.title || '';
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.scrollModalToTop();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.scrollModalToTop();
    }
  }

  skipStep(event: Event): void {
    event.preventDefault();
    this.nextStep();
  }

  scrollModalToTop(): void {
    const formContainer = document.querySelector('.modal-form-container');
    if (formContainer) {
      formContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // --- Sous-spécialités ---
  getSubSpecialties(): string[] {
    return this.subSpecialtiesMap[this.profileData.specialty] || [];
  }

  onSpecialtyChange(): void {
    this.profileData.subSpecialties = [];
  }

  onSubSpecialtyChange(event: any, subSpec: string): void {
    if (event.target.checked) {
      this.profileData.subSpecialties.push(subSpec);
    } else {
      this.profileData.subSpecialties = this.profileData.subSpecialties.filter(s => s !== subSpec);
    }
  }

  // --- Compétences ---
  addSkill(event: any): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const skill = input.value.trim();
    if (skill && !this.profileData.skills.includes(skill)) {
      this.profileData.skills.push(skill);
      input.value = '';
    }
  }

  removeSkill(index: number): void {
    this.profileData.skills.splice(index, 1);
  }

  // --- Éducation ---
  addEducation(): void {
    this.profileData.education.push({ degree: '', institution: '', startYear: null, endYear: null });
  }

  removeEducation(index: number): void {
    if (this.profileData.education.length > 1) {
      this.profileData.education.splice(index, 1);
    }
  }

  // --- Expériences ---
  addExperience(): void {
    this.profileData.experiences.push({ company: '', position: '', startDate: null, endDate: null, description: '' });
  }

  removeExperience(index: number): void {
    if (this.profileData.experiences.length > 1) {
      this.profileData.experiences.splice(index, 1);
    }
  }

  // --- Langues ---
  addLanguage(): void {
    this.profileData.languages.push({ name: '', level: '' });
  }

  removeLanguage(index: number): void {
    if (this.profileData.languages.length > 1) {
      this.profileData.languages.splice(index, 1);
    }
  }

  // --- Soumission du profil (CORRIGÉ POUR FORMDATA) ---
  onSubmit(): void {
    if (!this.isFormValid()) {
      alert('Please fill all required fields correctly.');
      return;
    }

    this.isSubmitting = true;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user._id || user.userId;

    if (!userId) {
      console.error('❌ Aucun ID utilisateur trouvé dans localStorage');
      alert('Erreur : utilisateur introuvable.');
      this.isSubmitting = false;
      return;
    }

    // 🔥 Préparation des données pour FormData (compatible avec Multer)
    const formattedEducation = this.profileData.education.map(edu => ({
      degree: edu.degree,
      institution: edu.institution,
      startYear: edu.startYear ? Number(edu.startYear) : null,
      endYear: edu.endYear ? Number(edu.endYear) : null
    }));

    const formattedExperiences = this.profileData.experiences.map(exp => ({
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate || null,
      endDate: exp.endDate || null,
      description: exp.description
    }));

    const profilePayload = {
      dateOfBirth: this.profileData.dateOfBirth || '',
      gender: this.profileData.gender,
      address: this.profileData.address,
      nationality: this.profileData.nationality,
      specialty: this.profileData.specialty,
      subSpecialties: this.profileData.subSpecialties,
      skills: this.profileData.skills,
      education: formattedEducation,
      experiences: formattedExperiences,
      languages: this.profileData.languages,
      linkedin: this.profileData.linkedin || '',
      github: this.profileData.github || '',
      portfolio: this.profileData.portfolio || ''
    };

    console.log('📤 Données envoyées:', profilePayload);

    this.profileService.updateProfile(userId, profilePayload).subscribe({
      next: (res) => {
        console.log('✅ Profil mis à jour avec succès', res);
        
        // Mise à jour du localStorage
        const updatedUser = { 
          ...user, 
          ...res.updatedUser, 
          profileStatus: res.profileStatus || 'Complet' 
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('profileStatus', res.profileStatus || 'Complet');
        
        this.profileCompleted.emit(res);
        this.isSubmitting = false;
        this.closeModal();
        alert('✅ Profil complété avec succès !');
      },
      error: (err) => {
        console.error('❌ Erreur backend :', err);
        
        let errorMessage = 'Erreur lors de la mise à jour du profil';
        if (err.error?.message) {
          errorMessage += ': ' + err.error.message;
        } else if (err.message) {
          errorMessage += ': ' + err.message;
        }
        
        alert(errorMessage);
        this.isSubmitting = false;
      }
    });
  }
}