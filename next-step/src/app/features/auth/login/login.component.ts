import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationOptions , LottieComponent} from 'ngx-lottie';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../../services/auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule , FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent {  

  constructor(private authService: AuthServiceService, private router: Router) {}

  showPassword: boolean = false;   // pour afficher/masquer le mot de passe
    errorMessage: string = '';


  // Données du formulaire
  formData = {
    name: '',
    password: '',
    remember: false
  };

  // Méthode pour toggle mot de passe
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Soumission du formulaire
onSubmit(form: NgForm, event: Event) {
  event.preventDefault(); // Empêche le reload
  if (form.valid) {
    this.authService.signin({
      name: this.formData.name,
      password: this.formData.password
    }).subscribe({
      next: (res) => {
        console.log('Connexion réussie ✅', res);
          if (res.role === 'admin') {
            this.router.navigate(['/adminDashboard']);
          } else if (res.role === 'user') {
            this.router.navigate(['/userDashboard']);
          }else if(res.role =='company'){
            this.router.navigate(['/companyDashboard']);
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