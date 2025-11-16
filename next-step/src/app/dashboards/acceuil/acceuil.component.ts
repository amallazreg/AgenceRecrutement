import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SidebarAcceuilComponent } from '../../shared/sidebar-acceuil/sidebar-acceuil.component';
import { ProfileCompletionComponent } from '../../userInterfaces/profile-completion/profile-completion.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-acceuil',
  imports: [CommonModule, SidebarAcceuilComponent, ProfileCompletionComponent],
  templateUrl: './acceuil.component.html',
  styleUrl: './acceuil.component.css'
})
export class AcceuilComponent implements OnInit, AfterViewInit {
   @ViewChild(ProfileCompletionComponent)
  profileModal!: ProfileCompletionComponent;

  // ✅ Profil status : 'complete' ou 'incomplete'
  profileStatus: 'complete' | 'incomplete' = 'incomplete';
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this.checkLogin();
    this.checkProfileStatus();
  }

  ngAfterViewInit(): void {
    // 🔹 Si utilisateur connecté et profil incomplet, afficher le modal
    if (this.isLoggedIn && this.profileStatus === 'incomplete') {
      setTimeout(() => {
        this.profileModal?.showModal();
      }, 300);
    }
  }

  // ✅ Vérifie si user est connecté (via token)
  checkLogin(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;  // true si token existe
  }

  // ✅ Vérifie le statut du profil depuis le localStorage
  checkProfileStatus(): void {
    const status = localStorage.getItem('profileStatus');
    this.profileStatus = status === 'Complet' || status === 'complete' ? 'complete' : 'incomplete';
  }

  // ✅ Quand le profil est complété via le modal
  onProfileCompleted(profileData: any): void {
    console.log('✅ Profil complété :', profileData);
    this.profileStatus = 'complete';
    localStorage.setItem('profileStatus', 'Complet');
  }

  onModalClosed(): void {
    console.log('❌ Modal fermé');
  }
}