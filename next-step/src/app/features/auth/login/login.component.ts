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

        // Sauvegarder le token et les infos utilisateur
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.username || res));
        localStorage.setItem('userRole', res.role);

        // ✅ VÉRIFIER SI LE PROFIL EST COMPLET (UNIQUEMENT POUR LES USERS)

          // ✅ VÉRIFIER LE PROFIL UNIQUEMENT POUR LES USERS
          if (res.role === 'user') {
            // ✅ Accéder directement à res.profileStatus (pas res.username.profileStatus)
            const profileStatus = res.profileStatus || 'Incomplet';
            
            console.log('Profile Status:', profileStatus);

            if (profileStatus === 'Incomplet') {
              console.log('🔄 Redirection vers profile-completion');
              this.router.navigate(['/acceuil']);
            } else {
              console.log('✅ Profil complet, redirection vers accueil');
              this.router.navigate(['/acceuil']);
            }
          } 
        // Redirection normale pour admin et company
        else if (res.role === 'admin') {
          this.router.navigate(['/adminDashboard']);
        } else if (res.role === 'company') {
          this.router.navigate(['/companyDashboard']);
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