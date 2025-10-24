import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../../services/auth-service.service';
import { SidebarAcceuilComponent } from "../../../sidebar-acceuil/sidebar-acceuil.component";

@Component({
  selector: 'app-signup',
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterModule, SidebarAcceuilComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  
 showPassword: boolean = false;
  showConfirmPassword: boolean = false;
showAlertBox: boolean = false;  
alertMessage: string = '';  
alertType: 'success' | 'error' | 'warning' = 'success';



  constructor(private authService : AuthServiceService,private router: Router){}

  formData = {
    name: '',
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
      name: this.formData.name,
      email: this.formData.email,
      phone: this.formData.phone,
      password: this.formData.password,
      confirmPassword: this.formData.confirmPassword,
      role: 'user'
    };

    this.authService.register(user).subscribe({
      next: (res) => {
        console.log('✅ Inscription réussie !', res);
        this.showAlert('Compte créé avec succès 🎉', 'success');
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('❌ Erreur lors de l’inscription :', err);
        this.showAlert('Erreur lors de la création du compte ❌', 'error');
      }
    });
  } else {
    this.showAlert('Formulaire invalide ou mots de passe différents ⚠️', 'warning');
  }
}

// Méthode pour afficher l’alerte au milieu
showAlert(message: string, type: 'success' | 'error' | 'warning') {
  this.alertMessage = message;
  this.alertType = type;
  this.showAlertBox = true;

  setTimeout(() => {
    this.showAlertBox = false;
  }, 2500); // disparaît après 2.5s
}

}