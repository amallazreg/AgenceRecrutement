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

  userProfileStatus: 'complete' | 'incomplete' = 'incomplete';
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this.checkLogin();
    this.checkProfileStatus();
  }

  ngAfterViewInit(): void {
    if (this.isLoggedIn && this.userProfileStatus === 'incomplete') {
      setTimeout(() => {
        this.profileModal?.showModal();
      }, 300);
    }
  }

  // ✅ Vérifie si user est connecté (via token)
  checkLogin(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;  // true si token existe, sinon false
  }

  // ✅ Vérifie le statut du profil
  checkProfileStatus(): void {
    const status = localStorage.getItem('profileStatus');
    this.userProfileStatus = status === 'complete' ? 'complete' : 'incomplete';
  }

  // ✅ Quand le profil est complété
  onProfileCompleted(profileData: any): void {
    console.log('✅ Profil complété :', profileData);

    this.userProfileStatus = 'complete';
    localStorage.setItem('profileStatus', 'complete');
  }

  onModalClosed(): void {
    console.log('❌ Modal fermé');
  }
}