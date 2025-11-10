import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
   // ⚠️ IMPORTANT: Ces propriétés DOIVENT être présentes
  @Output() profileCompleted = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();
  
  // ⚠️ CETTE PROPRIÉTÉ EST ESSENTIELLE
  isModalVisible: boolean = false;
  
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
    'Informatique': ['Web Development', 'Mobile Development', 'Data Science', 'Cybersecurity', 'Networks', 'DevOps', 'AI & Machine Learning'],
    'Marketing': ['Digital Marketing', 'SEO / SEA', 'Communication', 'Branding', 'Market Research'],
    'Finance': ['Accounting', 'Audit', 'Banking', 'Management Control', 'Financial Analysis'],
    'Santé': ['Medicine', 'Pharmacy', 'Nursing', 'Biotechnology', 'Medical Research'],
    'Éducation': ['Primary Education', 'Secondary Education', 'Professional Training', 'Digital Pedagogy'],
    'Commerce': ['Sales', 'Business Management', 'E-commerce', 'Logistics', 'Import/Export'],
    'Industrie': ['Production', 'Maintenance', 'Quality', 'Energy', 'Mechanics']
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
    }
  }

  // ⚠️ MÉTHODES ESSENTIELLES - DOIVENT ÊTRE PRÉSENTES
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

  onSubmit(): void {
    console.log('Profile Data to submit:', this.profileData);
    
    const payload = {
      ...this.profileData,
      profileStatus: 'complete'
    };

    localStorage.setItem('profileStatus', 'complete');
    this.profileCompleted.emit(payload);
    this.closeModal();
    
    alert('Profil complété avec succès!');
  }
}

