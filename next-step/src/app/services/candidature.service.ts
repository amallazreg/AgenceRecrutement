import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Offer {
  _id: string;
  title: string;
  company?: string;
  location: string;
  contractType: string;
  sector: string;
  companyId?: {
    name: string;
    _id: string;
  };
}

export interface Candidature {
  _id: string;
  candidateId: string;
  offerId: Offer;
  cv: string;
  motivationLetter: string;
  additionalDocuments: string[];
  status: 'En attente' | 'Accepté' | 'Refusé';
  submittedAt: string;
  __v: number;
}
@Injectable({
  providedIn: 'root'
})
export class CandidatureService {
   private apiUrl = `http://localhost:3000/candidature`;

  constructor(private http: HttpClient) {}

  applyOffer(offerId: string, candidateId: string, cv: File | null, motivationLetter: File | null): Observable<any> {
    const formData = new FormData();

    if (cv) formData.append('cv', cv);
    if (motivationLetter) formData.append('motivationLetter', motivationLetter);

    return this.http.post(`${this.apiUrl}/applyOffer/${offerId}/${candidateId}`, formData);
  }

  getCandidatureCount(offerId: string): Observable<{ offerId: string; candidatureCount: number }> {
  return this.http.get<{ offerId: string; candidatureCount: number }>(`${this.apiUrl}/getCountCandidatureForOffer/${offerId}`);
}

  // Récupérer les candidatures d'un candidat
  getMyCandidatures(candidateId: string): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.apiUrl}/getMyCandidature/${candidateId}`);
  }

  // Supprimer une candidature
  deleteCandidature(candidatureId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteCandidature/${candidatureId}`);
  }
  // Récupérer les candidats pour une offre
getCandidatesForOffer(offerId: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/getCandidatureForOffer/${offerId}`);
}

// Mettre à jour le statut d'une candidature
updateCandidatureStatus(candidatureId: string, status: 'Accepté' | 'Refusé'): Observable<any> {
  return this.http.put(`${this.apiUrl}/updateCandidatureStatus/${candidatureId}`, { status });
}
}
