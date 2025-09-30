import { Component } from '@angular/core';
import { LottieComponent } from 'ngx-lottie'; // 👈 importer le composant standalone Lottie
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {  

}