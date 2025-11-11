import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) {}

  // 🔥 Mise à jour du profil (compatible avec Multer backend)
  updateProfile(userId: string, profileData: any): Observable<any> {
    const formData = new FormData();
    
    // Ajout des champs simples
    if (profileData.dateOfBirth) formData.append('dateOfBirth', profileData.dateOfBirth);
    if (profileData.gender) formData.append('gender', profileData.gender);
    if (profileData.address) formData.append('address', profileData.address);
    if (profileData.nationality) formData.append('nationality', profileData.nationality);
    if (profileData.specialty) formData.append('specialty', profileData.specialty);
    if (profileData.linkedin) formData.append('linkedin', profileData.linkedin);
    if (profileData.github) formData.append('github', profileData.github);
    if (profileData.portfolio) formData.append('portfolio', profileData.portfolio);

    // 🔥 Les tableaux doivent être stringifiés pour Multer
    if (profileData.subSpecialties && profileData.subSpecialties.length > 0) {
      formData.append('subSpecialties', JSON.stringify(profileData.subSpecialties));
    }
    
    if (profileData.skills && profileData.skills.length > 0) {
      formData.append('skills', JSON.stringify(profileData.skills));
    }
    
    if (profileData.education && profileData.education.length > 0) {
      formData.append('education', JSON.stringify(profileData.education));
    }
    
    if (profileData.experiences && profileData.experiences.length > 0) {
      formData.append('experiences', JSON.stringify(profileData.experiences));
    }
    
    if (profileData.languages && profileData.languages.length > 0) {
      formData.append('languages', JSON.stringify(profileData.languages));
    }

    // ✅ Ajouter les fichiers (CV et lettre de motivation)
    if (profileData.cv instanceof File) {
      formData.append('cv', profileData.cv, profileData.cv.name);
      console.log('📎 CV ajouté:', profileData.cv.name);
    }
    
    if (profileData.motivationLetter instanceof File) {
      formData.append('motivationLetter', profileData.motivationLetter, profileData.motivationLetter.name);
      console.log('📎 Lettre de motivation ajoutée:', profileData.motivationLetter.name);
    }

    console.log('📦 FormData préparée pour envoi avec fichiers');

    // ⚠️ Ne PAS définir Content-Type manuellement, le navigateur le fait avec boundary
    return this.http.put(`${this.apiUrl}/update/${userId}`, formData);
  }
}