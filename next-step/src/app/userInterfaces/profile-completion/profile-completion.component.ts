import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Education {
  degree: string;
  institution: string;
  startYear: number | null;
  endYear: number | null;
}

interface Experience {
  company: string;
  position: string;
  startDate: Date | null;
  endDate: Date | null;
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
  styleUrl: './profile-completion.component.css'
})
export class ProfileCompletionComponent implements OnInit {
  currentStep: number = 1;
  totalSteps: number = 5;
  
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

  subSpecialtiesMap: { [key: string]: string[] } = {
    'Informatique': [
      'Web Development', 
      'Mobile Development', 
      'Data Science', 
      'Cybersecurity', 
      'Networks', 
      'DevOps', 
      'AI & Machine Learning'
    ],
    'Marketing': [
      'Digital Marketing', 
      'SEO / SEA', 
      'Communication', 
      'Branding', 
      'Market Research'
    ],
    'Finance': [
      'Accounting', 
      'Audit', 
      'Banking', 
      'Management Control', 
      'Financial Analysis'
    ],
    'Santé': [
      'Medicine', 
      'Pharmacy', 
      'Nursing', 
      'Biotechnology', 
      'Medical Research'
    ],
    'Éducation': [
      'Primary Education', 
      'Secondary Education', 
      'Professional Training', 
      'Digital Pedagogy'
    ],
    'Commerce': [
      'Sales', 
      'Business Management', 
      'E-commerce', 
      'Logistics', 
      'Import/Export'
    ],
    'Industrie': [
      'Production', 
      'Maintenance', 
      'Quality', 
      'Energy', 
      'Mechanics'
    ]
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Récupérer les informations de base de l'utilisateur depuis le localStorage ou un service
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      // Pré-remplir les champs si disponibles
      // this.profileData.name = user.name;
      // etc...
    }
  }

  get progressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  getStepTitle(): string {
    return this.steps[this.currentStep - 1]?.title || '';
  }

  getSubSpecialties(): string[] {
    return this.subSpecialtiesMap[this.profileData.specialty] || [];
  }

  onSpecialtyChange(): void {
    // Reset sub-specialties when main specialty changes
    this.profileData.subSpecialties = [];
  }

  onSubSpecialtyChange(event: any, subSpec: string): void {
    if (event.target.checked) {
      if (!this.profileData.subSpecialties.includes(subSpec)) {
        this.profileData.subSpecialties.push(subSpec);
      }
    } else {
      const index = this.profileData.subSpecialties.indexOf(subSpec);
      if (index > -1) {
        this.profileData.subSpecialties.splice(index, 1);
      }
    }
  }

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

  addEducation(): void {
    this.profileData.education.push({
      degree: '',
      institution: '',
      startYear: null,
      endYear: null
    });
  }

  removeEducation(index: number): void {
    if (this.profileData.education.length > 1) {
      this.profileData.education.splice(index, 1);
    }
  }

  addExperience(): void {
    this.profileData.experiences.push({
      company: '',
      position: '',
      startDate: null,
      endDate: null,
      description: ''
    });
  }

  removeExperience(index: number): void {
    if (this.profileData.experiences.length > 1) {
      this.profileData.experiences.splice(index, 1);
    }
  }

  addLanguage(): void {
    this.profileData.languages.push({
      name: '',
      level: ''
    });
  }

  removeLanguage(index: number): void {
    if (this.profileData.languages.length > 1) {
      this.profileData.languages.splice(index, 1);
    }
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.scrollToTop();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.scrollToTop();
    }
  }

  skipStep(event: Event): void {
    event.preventDefault();
    this.nextStep();
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  validateCurrentStep(): boolean {
    // Validation basique selon l'étape
    switch (this.currentStep) {
      case 1:
        return !!(this.profileData.dateOfBirth && 
                  this.profileData.gender && 
                  this.profileData.address && 
                  this.profileData.nationality);
      case 2:
        return !!(this.profileData.specialty && 
                  this.profileData.subSpecialties.length > 0);
      case 3:
        return this.profileData.education.some(edu => 
          edu.degree && edu.institution && edu.startYear && edu.endYear
        );
      default:
        return true;
    }
  }

  onSubmit(): void {
    console.log('Profile Data to submit:', this.profileData);
    
    // Préparer les données pour l'API
    const payload = {
      ...this.profileData,
      profileStatus: 'Complet'
    };

    // TODO: Appeler votre service API
    // this.profileService.completeProfile(payload).subscribe({
    //   next: (response) => {
    //     console.log('Profile completed successfully', response);
    //     localStorage.setItem('profileStatus', 'Complet');
    //     this.router.navigate(['/dashboard']);
    //   },
    //   error: (error) => {
    //     console.error('Error completing profile', error);
    //     alert('An error occurred while saving your profile. Please try again.');
    //   }
    // });

    // Pour l'instant, simulation
    alert('Profile completed successfully! Redirecting to dashboard...');
    localStorage.setItem('profileStatus', 'Complet');
    
    // Redirection vers le dashboard
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 1500);
  }

  // Méthode helper pour debug
  logProfileData(): void {
    console.log('Current Profile Data:', this.profileData);
  }
}