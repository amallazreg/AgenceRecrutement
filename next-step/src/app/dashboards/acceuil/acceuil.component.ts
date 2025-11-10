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
  @ViewChild(ProfileCompletionComponent) profileModal!: ProfileCompletionComponent;
  
  userProfileStatus: string = 'incomplete';

  ngOnInit(): void {
    this.checkProfileStatus();
  }

  ngAfterViewInit(): void {
    if (this.userProfileStatus === 'incomplete') {
      setTimeout(() => {
        this.profileModal?.showModal();
      }, 500);
    }
  }

  checkProfileStatus(): void {
    const status = localStorage.getItem('profileStatus');
    this.userProfileStatus = status || 'incomplete';
  }

  onProfileCompleted(profileData: any): void {
    console.log('Profile completed:', profileData);
    this.userProfileStatus = 'complete';
    localStorage.setItem('profileStatus', 'complete');
  }

  onModalClosed(): void {
    console.log('Modal closed by user');
  }
}