import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationOptions , LottieComponent} from 'ngx-lottie';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent {  
  showPassword: boolean = false;  // état pour afficher/masquer

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}