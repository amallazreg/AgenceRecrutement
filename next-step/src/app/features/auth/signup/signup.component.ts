import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true, 
  imports: [CommonModule, FormsModule ,RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
 showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  formData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  };

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(form: NgForm) {
    if (form.valid && this.formData.password === this.formData.confirmPassword) {
      console.log("✅ Signup réussi !");
      console.log(this.formData);
      // 👉 Ici tu peux appeler ton AuthService.register()
    } else {
      console.log("❌ Formulaire invalide ou mots de passe différents");
    }
  }
}