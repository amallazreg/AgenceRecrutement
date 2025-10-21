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

   signin(credentials: { name: string, password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/user/signin`, credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          // Enregistrer le token et les informations de l'utilisateur dans le localStorage
          localStorage.setItem('tokenuser', res.token);
          localStorage.setItem('userId', res.id); // Enregistrer l'ID de l'utilisateur (si renvoyé dans la réponse)
          localStorage.setItem('userInfo', JSON.stringify(res.user));
  
          // Si tu veux décoder le token pour extraire l'ID directement (sans bibliothèque externe)
          const decodedToken = this.decodeToken(res.token);
          localStorage.setItem('userId', decodedToken.id); // Sauvegarder l'ID depuis le token décodé
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


