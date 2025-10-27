import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../interface/auth-response';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {


  private apiUrl = 'http://localhost:3000'

  constructor(private http: HttpClient,) {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/signup`, userData);
  }
  // 🔹 Connexion user
  signinUser(credentials: { name: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/user/signin`, credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('userName', res.name);
          console.log('Connexion user réussie ✅');
        }
      })
    );
  }
  signinCompany(credentials: { name: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/company/signin`, credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          // ✅ Sauvegarde des infos dans le localStorage
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('sector', res.sector);
          localStorage.setItem('companyName', res.name);

          console.log('Connexion réussie ✅');
        }
      })
    );
  }

    // Méthode pour décoder le token sans bibliothèque externe
  private decodeToken(token: string): any {
    const payload = token.split('.')[1]; // Prendre la partie payload du token
    const decodedPayload = atob(payload); // Décoder en base64
    return JSON.parse(decodedPayload); // Retourner l'objet JSON
  }

  logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
}

}


