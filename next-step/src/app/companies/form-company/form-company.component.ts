import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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

  constructor(private fb: FormBuilder) {
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
      description: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      phonePrefix: ['+33'],
      website: [''],
      fullAddress: [''],
      hrManager: ['', [Validators.required]],
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
      this.formSubmit.emit(this.companyForm.value);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
