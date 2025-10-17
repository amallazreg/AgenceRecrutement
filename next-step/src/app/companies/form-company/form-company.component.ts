import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminServiceService } from '../../services/admin-service.service';

@Component({
  selector: 'app-form-company',
  standalone: true , 
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-company.component.html',
  styleUrl: './form-company.component.css'
})
export class FormCompanyComponent {
 @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();
  @Input() companyData: any = null;

  companyForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private adminService :AdminServiceService ) {
    this.companyForm = this.createCompanyForm();
  }

  ngOnInit() {
    if (this.companyData) {
      this.companyForm.patchValue(this.companyData);
    }
  }

  

createCompanyForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      sector: ['', [Validators.required]],
      companyDescription: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      phonePrefix: ['+33'],
      website: [''],
      fullAddress: [''],
      hrManage: ['', [Validators.required]],
      managerEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value 
      ? null : { mismatch: true };
  }

  onSubmit() {
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

              // ✅ Cache le message après 3 secondes
              setTimeout(() => {
                this.successMessage = '';
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

  onCancel() {
    this.formCancel.emit();
  }
}
