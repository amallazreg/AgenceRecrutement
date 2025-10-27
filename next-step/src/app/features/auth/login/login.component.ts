import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationOptions , LottieComponent} from 'ngx-lottie';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../../services/auth-service.service';
import { SidebarAcceuilComponent } from '../../../shared/sidebar-acceuil/sidebar-acceuil.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarAcceuilComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent {  
 constructor(private authService: AuthServiceService, private router: Router) {}

  showPassword: boolean = false;
  errorMessage: string = '';
  loginMode: 'user' | 'company' = 'user'; // Mode par défaut

  // Données du formulaire
  formData = {
    name: '',
    password: '',
    acceptTerms: false
  };

  // Méthode pour basculer entre user et company
  toggleLoginMode(mode: 'user' | 'company') {
    this.loginMode = mode;
    this.errorMessage = ''; // Réinitialiser les erreurs
  }

  // Méthode pour toggle mot de passe
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(form: NgForm, event: Event) {
    event.preventDefault();

    if (form.valid) {
      const credentials = {
        name: this.formData.name,
        password: this.formData.password
      };

      // Choisir la bonne méthode selon le mode
      const authObservable = this.loginMode === 'company' 
        ? this.authService.signinCompany(credentials)
        : this.authService.signinUser(credentials);

      authObservable.subscribe({
        next: (res) => {
          console.log(`Connexion ${this.loginMode} réussie ✅`, res);

          // Redirection selon le rôle
          if (res.role === 'admin') {
            this.router.navigate(['/adminDashboard']);
          } else if (res.role === 'company') {
            this.router.navigate(['/companyDashboard']);
          } else if (res.role === 'user') {
            this.router.navigate(['/userDashboard']);
          } else {
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          console.error('Erreur connexion ❌', err);
          this.errorMessage = err.error?.message || 'Erreur de connexion. Vérifiez vos identifiants.';
        }
      });
    } else {
      console.log('Formulaire invalide ❌');
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
    }
  }
}