import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Offer {
  _id?: string;
companyId: {
    _id: string;
    name: string;
  };  sector: string;
  title: string;
  description: string;
  requiredSkills: string[];
  experienceLevel: string;
  contractType: string;
  location: string;
  salaryRange: string;
  startOffreDate: string;
  endOffreDate: string;
  workingHours: string;
  remoteOption: string;
  status?: string;
  views?: number;
  applicationsCount?: number;
  createdAt?: string;
  updatedAt?: string;
  
  // Champs spécifiques - Informatique
  programmingLanguages?: string[];
  frameworks?: string[];
  databaseKnowledge?: string[];
  tools?: string[];
  projectType?: string;
  methodology?: string[];
  
  // Champs spécifiques - Marketing
  marketingChannels?: string[];
  campaignTools?: string[];
  targetAudience?: string[];
  kpiFocus?: string[];
  
  // Champs spécifiques - Finance
  financialTools?: string[];
  areaOfExpertise?: string[];
  certifications?: string[];
  reportingFrequency?: string[];
  
  // Champs spécifiques - Santé
  requiredDiploma?: string[];
  medicalSpecialty?: string[];
  workSchedule?: string[];
  licenseNumber?: string[];
  
  // Champs spécifiques - Éducation
  teachingLevel?: string[];
  subjectTaught?: string[];
  requiredDegree?: string[];
  classSize?: number;
  
  // Champs spécifiques - Commerce
  salesType?: string[];
  productType?: string[];
  salesTarget?: string[];
  customerManagementTools?: string[];
  mobilityRequired?: boolean;
  
  // Champs spécifiques - Industrie
  machineOperation?: string[];
  safetyCertifications?: string[];
  shiftType?: string;
  productionEnvironment?: string;
  qualityControl?: string;

  // Champs calculés (optionnels pour l'affichage)
  daysRemaining?: number;
  statusInfo?: string;
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
  getMyCandidatures(offreId: string): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.apiUrl}/getCountCandidatureForOffer/${offreId}`);
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
