import { Component, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminServiceService } from '../../services/admin-service.service';
interface Company { 
  _id: string; 
  name: string; 
  sector: string; 
  description: string; 
  email: string; 
  phoneNumber: string; 
  phonePrefix: string; 
  website: string; 
  fullAddress: string; 
  hrManage: string; 
  managerEmail: string; 
  status: 'active' | 'pending'; 
}
@Component({
  selector: 'app-form-company',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-company.component.html',
  styleUrl: './form-company.component.css'
})
export class FormCompanyComponent implements OnInit, OnChanges {
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();
  @Input() companyData: any = null;      // objet company ou null
  @Input() isViewMode: boolean = false;  // true => lecture seule

  companyForm!: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private adminService: AdminServiceService) {}

  ngOnInit() {
    this.companyForm = this.createCompanyForm();
    // si on a déjà companyData au démarrage, on la patchera via ngOnChanges également
    if (this.companyData) {
      this.patchForm(this.companyData);
    }
    this.setFormMode();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['companyData'] && !changes['companyData'].isFirstChange()) {
      const data = changes['companyData'].currentValue;
      if (data) {
        this.patchForm(data);
      } else {
        this.companyForm.reset();
      }
    }

    if (changes['isViewMode'] && !changes['isViewMode'].isFirstChange()) {
      this.setFormMode();
    }
  }

  createCompanyForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      sector: ['', [Validators.required]],
      companyDescription: [''],
      email: ['', [Validators.required, Validators.email]],
      phonePrefix: ['+33', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      website: [''],
      fullAddress: [''],
      hrManage: ['', [Validators.required]],
      managerEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // applique les valeurs reçues — découpe phone si nécessaire
  private patchForm(data: any) {
    const patch: any = { ...data };

    // Si backend a stocké phone comme '+33 612345678' ou comme deux champs, on essaie de gérer:
    if (data.phoneNumber && typeof data.phoneNumber === 'string') {
      // tente splitter si phonePrefix inline
      const trimmed = data.phoneNumber.trim();
      const match = trimmed.match(/^(\+\d+)[\s\-]?(.+)$/);
      if (match) {
        patch.phonePrefix = match[1];
        patch.phoneNumber = match[2];
      }
    }
    // si backend a separate phonePrefix and phoneNumber, patch utilisera ces champs directement

    // map fields names (si ton backend utilise companyDescription ou description, etc.)
    if (data.description && !data.companyDescription) {
      patch.companyDescription = data.description;
    }

    // patchValue sans affecter validators
    this.companyForm.patchValue({
      name: patch.name ?? '',
      sector: patch.sector ?? '',
      companyDescription: patch.companyDescription ?? '',
      email: patch.email ?? '',
      phonePrefix: patch.phonePrefix ?? '+33',
      phoneNumber: patch.phoneNumber ?? '',
      website: patch.website ?? '',
      fullAddress: patch.fullAddress ?? '',
      hrManage: patch.hrManage ?? '',
      managerEmail: patch.managerEmail ?? '',
      // on ne patche pas les mots de passe pour la vue
    });

    // optional: if showing view mode we don't want password values visible
    if (this.isViewMode) {
      this.companyForm.get('password')?.reset();
      this.companyForm.get('confirmPassword')?.reset();
    }
  }

  private setFormMode() {
    if (!this.companyForm) return;
    if (this.isViewMode) {
      this.companyForm.disable();
    } else {
      this.companyForm.enable();
      // si on veut masquer les validators password lors d'édition d'une company existante,
      // on pourrait conditionner; pour l'instant on garde validators pour création.
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {

     if (this.isViewMode) {
    this.companyForm.disable(); // ✅ désactive tous les champs
  }
    if (this.companyForm.valid) {
      // correspondance avec les champs backend
      const formValue = this.companyForm.value;

      const companyData = {
        name: formValue.name,
        sector: formValue.sector,
        companyDescription: formValue.companyDescription,
        fullAddress: formValue.fullAddress,
        phoneNumber: formValue.phonePrefix + formValue.phoneNumber,
        email: formValue.email,
        website: formValue.website,
        hrManage: formValue.hrManage,
        managerEmail: formValue.managerEmail,
        password: formValue.password,
        confirmPassword: formValue.confirmPassword
      };

      this.adminService.signupCompany(companyData).subscribe({
        next: (res) => {
              this.successMessage = 'Company created successfully ✅';
              this.errorMessage = '';
              this.formSubmit.emit(res);
              this.companyForm.reset();
             this.loadCompanies() ;

              // ✅ Cache le message après 3 secondes
              setTimeout(() => {
                this.successMessage = '';
                window.location.reload();
              }, 3000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'An error occurred ❌';
          this.successMessage = '';
          console.error('Signup error:', err);
        }
      });
    } else {
      this.companyForm.markAllAsTouched();
    }
  }

  companies: Company[] = []; 
  filteredCompanies: Company[] = [];
loadCompanies() { 
  this.adminService.getAllCompanies().subscribe({
     next: (res) => {
       this.companies = res;
      this.filteredCompanies = [...this.companies];  
      window.location.reload();
     }, error: (err) => {
       console.error('Erreur lors du chargement des sociétés:', err);
       this.errorMessage = 'Erreur lors du chargement des sociétés.'; 
    }
  }); }
  onCancel() {
    this.formCancel.emit();
  }
}
