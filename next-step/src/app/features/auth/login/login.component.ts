import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationOptions , LottieComponent} from 'ngx-lottie';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule , FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent {  
  showPassword: boolean = false;   // pour afficher/masquer le mot de passe

  // Données du formulaire
  formData = {
    email: '',
    password: '',
    remember: false
  };

  // Méthode pour toggle mot de passe
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Soumission du formulaire
  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Formulaire valide ✅');
      console.log('Email:', this.formData.email);
      console.log('Mot de passe:', this.formData.password);
      console.log('Se souvenir de moi:', this.formData.remember);

      // 👉 Ici tu peux appeler ton service d’authentification
      // this.authService.login(this.formData).subscribe(...)

    } else {
      console.log('Formulaire invalide ❌');
    }
  }
}