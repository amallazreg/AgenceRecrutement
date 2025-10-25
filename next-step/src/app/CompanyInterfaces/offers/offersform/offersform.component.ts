import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-offersform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './offersform.component.html',
  styleUrl: './offersform.component.css'
})
export class OffersformComponent implements OnInit {
  offerForm!: FormGroup;
  isEditMode = false;
  offerId?: string;
  selectedSector: string = '';

  // Arrays pour les champs de type tableau
  requiredSkills: string[] = [];
  
  // Informatique
  programmingLanguages: string[] = [];
  frameworks: string[] = [];
  databaseKnowledge: string[] = [];
  tools: string[] = [];
  methodology: string[] = [];

  // Marketing
  marketingChannels: string[] = [];
  campaignTools: string[] = [];
  targetAudience: string[] = [];
  kpiFocus: string[] = [];

  // Finance
  financialTools: string[] = [];
  areaOfExpertise: string[] = [];
  certifications: string[] = [];
  reportingFrequency: string[] = [];

  // Santé
  requiredDiploma: string[] = [];
  medicalSpecialty: string[] = [];
  workSchedule: string[] = [];
  licenseNumber: string[] = [];

  // Éducation
  teachingLevel: string[] = [];
  subjectTaught: string[] = [];
  requiredDegree: string[] = [];

  // Commerce
  salesType: string[] = [];
  productType: string[] = [];
  salesTarget: string[] = [];
  customerManagementTools: string[] = [];

  // Industrie
  machineOperation: string[] = [];
  safetyCertifications: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  initForm(): void {
    this.offerForm = this.fb.group({
      // Champs généraux
      sector: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      experienceLevel: ['Junior', Validators.required],
      contractType: ['CDI', Validators.required],
      location: [''],
      salaryRange: [''],
      startDate: [''],
      applicationDeadline: [''],
      workingHours: [''],
      remoteOption: ['Non', Validators.required],

      // Informatique
      projectType: [''],

      // Éducation
      classSize: [''],

      // Commerce
      mobilityRequired: [false],

      // Industrie
      shiftType: [''],
      productionEnvironment: [''],
      qualityControl: ['']
    });
  }

  checkEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.offerId = params['id'];
        this.loadOffer(params['id']);
      }
    });
  }

  loadOffer(id: string): void {
    // Charger l'offre depuis l'API
    // this.offerService.getOfferById(id).subscribe(offer => {
    //   this.populateForm(offer);
    // });
    console.log('Chargement de l\'offre:', id);
  }

  populateForm(offer: any): void {
    this.offerForm.patchValue(offer);
    this.selectedSector = offer.sector;
    
    // Remplir les tableaux
    if (offer.requiredSkills) this.requiredSkills = [...offer.requiredSkills];
    if (offer.programmingLanguages) this.programmingLanguages = [...offer.programmingLanguages];
    // ... etc pour tous les autres tableaux
  }

  onSectorChange(): void {
    this.selectedSector = this.offerForm.get('sector')?.value;
    // Réinitialiser les champs spécifiques si changement de secteur
  }

  // Méthodes pour gérer les compétences requises
  addSkill(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.requiredSkills.includes(value)) {
      this.requiredSkills.push(value);
      input.value = '';
    }
  }

  removeSkill(index: number): void {
    this.requiredSkills.splice(index, 1);
  }

  // Méthodes pour Informatique
  addProgrammingLanguage(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.programmingLanguages.includes(value)) {
      this.programmingLanguages.push(value);
      input.value = '';
    }
  }

  removeProgrammingLanguage(index: number): void {
    this.programmingLanguages.splice(index, 1);
  }

  addFramework(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.frameworks.includes(value)) {
      this.frameworks.push(value);
      input.value = '';
    }
  }

  removeFramework(index: number): void {
    this.frameworks.splice(index, 1);
  }

  addDatabase(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.databaseKnowledge.includes(value)) {
      this.databaseKnowledge.push(value);
      input.value = '';
    }
  }

  removeDatabase(index: number): void {
    this.databaseKnowledge.splice(index, 1);
  }

  addTool(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.tools.includes(value)) {
      this.tools.push(value);
      input.value = '';
    }
  }

  removeTool(index: number): void {
    this.tools.splice(index, 1);
  }

  addMethodology(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.methodology.includes(value)) {
      this.methodology.push(value);
      input.value = '';
    }
  }

  removeMethodology(index: number): void {
    this.methodology.splice(index, 1);
  }

  // Méthodes pour Marketing
  addMarketingChannel(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.marketingChannels.includes(value)) {
      this.marketingChannels.push(value);
      input.value = '';
    }
  }

  removeMarketingChannel(index: number): void {
    this.marketingChannels.splice(index, 1);
  }

  addCampaignTool(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.campaignTools.includes(value)) {
      this.campaignTools.push(value);
      input.value = '';
    }
  }

  removeCampaignTool(index: number): void {
    this.campaignTools.splice(index, 1);
  }

  addTargetAudience(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.targetAudience.includes(value)) {
      this.targetAudience.push(value);
      input.value = '';
    }
  }

  removeTargetAudience(index: number): void {
    this.targetAudience.splice(index, 1);
  }

  addKPI(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.kpiFocus.includes(value)) {
      this.kpiFocus.push(value);
      input.value = '';
    }
  }

  removeKPI(index: number): void {
    this.kpiFocus.splice(index, 1);
  }

  // Méthodes pour Finance
  addFinancialTool(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.financialTools.includes(value)) {
      this.financialTools.push(value);
      input.value = '';
    }
  }

  removeFinancialTool(index: number): void {
    this.financialTools.splice(index, 1);
  }

  addAreaOfExpertise(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.areaOfExpertise.includes(value)) {
      this.areaOfExpertise.push(value);
      input.value = '';
    }
  }

  removeAreaOfExpertise(index: number): void {
    this.areaOfExpertise.splice(index, 1);
  }

  addCertification(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.certifications.includes(value)) {
      this.certifications.push(value);
      input.value = '';
    }
  }

  removeCertification(index: number): void {
    this.certifications.splice(index, 1);
  }

  addReportingFrequency(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.reportingFrequency.includes(value)) {
      this.reportingFrequency.push(value);
      input.value = '';
    }
  }

  removeReportingFrequency(index: number): void {
    this.reportingFrequency.splice(index, 1);
  }

  // Méthodes pour Santé
  addRequiredDiploma(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.requiredDiploma.includes(value)) {
      this.requiredDiploma.push(value);
      input.value = '';
    }
  }

  removeRequiredDiploma(index: number): void {
    this.requiredDiploma.splice(index, 1);
  }

  addMedicalSpecialty(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.medicalSpecialty.includes(value)) {
      this.medicalSpecialty.push(value);
      input.value = '';
    }
  }

  removeMedicalSpecialty(index: number): void {
    this.medicalSpecialty.splice(index, 1);
  }

  addWorkSchedule(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.workSchedule.includes(value)) {
      this.workSchedule.push(value);
      input.value = '';
    }
  }

  removeWorkSchedule(index: number): void {
    this.workSchedule.splice(index, 1);
  }

  addLicenseNumber(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.licenseNumber.includes(value)) {
      this.licenseNumber.push(value);
      input.value = '';
    }
  }

  removeLicenseNumber(index: number): void {
    this.licenseNumber.splice(index, 1);
  }

  // Méthodes pour Éducation
  addTeachingLevel(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.teachingLevel.includes(value)) {
      this.teachingLevel.push(value);
      input.value = '';
    }
  }

  removeTeachingLevel(index: number): void {
    this.teachingLevel.splice(index, 1);
  }

  addSubjectTaught(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.subjectTaught.includes(value)) {
      this.subjectTaught.push(value);
      input.value = '';
    }
  }

  removeSubjectTaught(index: number): void {
    this.subjectTaught.splice(index, 1);
  }

  addRequiredDegree(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.requiredDegree.includes(value)) {
      this.requiredDegree.push(value);
      input.value = '';
    }
  }

  removeRequiredDegree(index: number): void {
    this.requiredDegree.splice(index, 1);
  }

  // Méthodes pour Commerce
  addSalesType(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.salesType.includes(value)) {
      this.salesType.push(value);
      input.value = '';
    }
  }

  removeSalesType(index: number): void {
    this.salesType.splice(index, 1);
  }

  addProductType(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.productType.includes(value)) {
      this.productType.push(value);
      input.value = '';
    }
  }

  removeProductType(index: number): void {
    this.productType.splice(index, 1);
  }

  addSalesTarget(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.salesTarget.includes(value)) {
      this.salesTarget.push(value);
      input.value = '';
    }
  }

  removeSalesTarget(index: number): void {
    this.salesTarget.splice(index, 1);
  }

  addCustomerManagementTool(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.customerManagementTools.includes(value)) {
      this.customerManagementTools.push(value);
      input.value = '';
    }
  }

  removeCustomerManagementTool(index: number): void {
    this.customerManagementTools.splice(index, 1);
  }

  // Méthodes pour Industrie
  addMachineOperation(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.machineOperation.includes(value)) {
      this.machineOperation.push(value);
      input.value = '';
    }
  }

  removeMachineOperation(index: number): void {
    this.machineOperation.splice(index, 1);
  }

  addSafetyCertification(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim();
    if (value && !this.safetyCertifications.includes(value)) {
      this.safetyCertifications.push(value);
      input.value = '';
    }
  }

  removeSafetyCertification(index: number): void {
    this.safetyCertifications.splice(index, 1);
  }

  // Méthodes utilitaires
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

  // Actions du formulaire
  saveDraft(): void {
    const offerData = this.prepareOfferData('Brouillon');
    console.log('Enregistrement brouillon:', offerData);
    
    // Appel API
    // this.offerService.createOffer(offerData).subscribe({
    //   next: (response) => {
    //     console.log('Brouillon enregistré', response);
    //     this.router.navigate(['/offers']);
    //   },
    //   error: (error) => console.error('Erreur:', error)
    // });

    // Simulation
    alert('Brouillon enregistré avec succès !');
    this.router.navigate(['/offers']);
  }

  publishOffer(): void {
    if (this.offerForm.valid) {
      const offerData = this.prepareOfferData('Publié');
      console.log('Publication de l\'offre:', offerData);
      
      // Appel API
      // if (this.isEditMode) {
      //   this.offerService.updateOffer(this.offerId!, offerData).subscribe({
      //     next: (response) => {
      //       console.log('Offre mise à jour', response);
      //       this.router.navigate(['/offers']);
      //     },
      //     error: (error) => console.error('Erreur:', error)
      //   });
      // } else {
      //   this.offerService.createOffer(offerData).subscribe({
      //     next: (response) => {
      //       console.log('Offre créée', response);
      //       this.router.navigate(['/offers']);
      //     },
      //     error: (error) => console.error('Erreur:', error)
      //   });
      // }

      // Simulation
      alert('Offre publiée avec succès !');
      this.router.navigate(['/offers']);
    } else {
      alert('Veuillez remplir tous les champs obligatoires');
      this.markFormGroupTouched(this.offerForm);
    }
  }

  prepareOfferData(status: string): any {
    const formValue = this.offerForm.value;
    
    const offerData: any = {
      // Champs généraux
      sector: formValue.sector,
      title: formValue.title,
      description: formValue.description,
      requiredSkills: this.requiredSkills,
      experienceLevel: formValue.experienceLevel,
      contractType: formValue.contractType,
      location: formValue.location,
      salaryRange: formValue.salaryRange,
      startDate: formValue.startDate,
      applicationDeadline: formValue.applicationDeadline,
      workingHours: formValue.workingHours,
      remoteOption: formValue.remoteOption,
      status: status
    };

    // Ajouter les champs spécifiques selon le secteur
    switch (formValue.sector) {
      case 'Informatique':
        offerData.programmingLanguages = this.programmingLanguages;
        offerData.frameworks = this.frameworks;
        offerData.databaseKnowledge = this.databaseKnowledge;
        offerData.tools = this.tools;
        offerData.projectType = formValue.projectType;
        offerData.methodology = this.methodology;
        break;

      case 'Marketing':
        offerData.marketingChannels = this.marketingChannels;
        offerData.campaignTools = this.campaignTools;
        offerData.targetAudience = this.targetAudience;
        offerData.kpiFocus = this.kpiFocus;
        break;

      case 'Finance':
        offerData.financialTools = this.financialTools;
        offerData.areaOfExpertise = this.areaOfExpertise;
        offerData.certifications = this.certifications;
        offerData.reportingFrequency = this.reportingFrequency;
        break;

      case 'Santé':
        offerData.requiredDiploma = this.requiredDiploma;
        offerData.medicalSpecialty = this.medicalSpecialty;
        offerData.workSchedule = this.workSchedule;
        offerData.licenseNumber = this.licenseNumber;
        break;

      case 'Éducation':
        offerData.teachingLevel = this.teachingLevel;
        offerData.subjectTaught = this.subjectTaught;
        offerData.requiredDegree = this.requiredDegree;
        offerData.classSize = formValue.classSize;
        break;

      case 'Commerce':
        offerData.salesType = this.salesType;
        offerData.productType = this.productType;
        offerData.salesTarget = this.salesTarget;
        offerData.customerManagementTools = this.customerManagementTools;
        offerData.mobilityRequired = formValue.mobilityRequired;
        break;

      case 'Industrie':
        offerData.machineOperation = this.machineOperation;
        offerData.safetyCertifications = this.safetyCertifications;
        offerData.shiftType = formValue.shiftType;
        offerData.productionEnvironment = formValue.productionEnvironment;
        offerData.qualityControl = formValue.qualityControl;
        break;
    }

    return offerData;
  }

  cancel(): void {
    if (confirm('Êtes-vous sûr de vouloir annuler ? Les modifications non enregistrées seront perdues.')) {
      this.goBack();
    }
  }

  goBack(): void {
    this.location.back();
  }

  // Marquer tous les champs comme touchés pour afficher les erreurs
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}