import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../../services/auth-service.service';

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

  constructor(private authService : AuthServiceService,private router: Router){}

  formData = {
    username: '',
    email: '',
    phone: '',
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
      const user = {
        username: this.formData.username,
        email: this.formData.email,
        phone: this.formData.phone,
        password: this.formData.password,
        confirmPassword: this.formData.confirmPassword, 
        role: 'user'
      };

      this.authService.register(user).subscribe({
        next: (res) => {
          console.log('✅ Inscription réussie !', res);
          alert('Compte créé avec succès 🎉');
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          console.error('❌ Erreur lors de l’inscription :', err);
          alert('Erreur lors de la création du compte.');
        }
      });
    } else {
      console.log("❌ Formulaire invalide ou mots de passe différents");
    }
  }
}