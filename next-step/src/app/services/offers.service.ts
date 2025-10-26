import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Offer {
  _id?: string;
  companyId?: string;
  sector: string;
  title: string;
  description: string;
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

export interface OfferResponse {
  success: boolean;
  message: string;
  offer?: Offer;
  offers?: Offer[];
  totalOffers?: number;
  published?: number;
  archived?: number;
  draft?: number;
}

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private apiUrl = `http://localhost:3000/company`;

  constructor(private http: HttpClient) { }

  // 🟢 CRÉATION d'une offre
  createOffer(offerData: any): Observable<OfferResponse> {
    const token = this.getToken();
    const headers = this.getHeaders(token);

    return this.http.post<OfferResponse>(`${this.apiUrl}/createOffre`, offerData, { headers });
  }

  // 🔵 RÉCUPÉRATION des offres de l'entreprise connectée
  getOffersByCompany(): Observable<Offer[]> {
    const token = this.getToken();
    const headers = this.getHeaders(token);

    return this.http.get<Offer[]>(`${this.apiUrl}/getOffersByCompany`, { headers });
  }

  // 🔵 RÉCUPÉRATION de toutes les offres (publique)
  getAllOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.apiUrl}/getAllOffres`);
  }

  // 🔵 RÉCUPÉRATION d'une offre par ID
  getOfferById(id: string): Observable<Offer> {
    return this.http.get<Offer>(`${this.apiUrl}/getOffreById/${id}`);
  }

  // 🟡 MISE À JOUR d'une offre
  updateOffer(id: string, offerData: any): Observable<OfferResponse> {
    const token = this.getToken();
    const headers = this.getHeaders(token);

    return this.http.put<OfferResponse>(`${this.apiUrl}/updateOffre/${id}`, offerData, { headers });
  }

  // 🔴 SUPPRESSION d'une offre
  deleteOffer(id: string): Observable<{ message: string }> {
    const token = this.getToken();
    const headers = this.getHeaders(token);

    return this.http.delete<{ message: string }>(`${this.apiUrl}/deleteOffre/${id}`, { headers });
  }

  // 📊 STATISTIQUES des offres
  getOffersCount(): Observable<{
    totalOffers: number;
    published: number;
    archived: number;
    draft: number;
  }> {
    return this.http.get<{
      totalOffers: number;
      published: number;
      archived: number;
      draft: number;
    }>(`${this.apiUrl}/getOffreCount`);
  }

  // 🎯 MÉTHODES UTILITAIRES PRIVÉES
  private getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  private getHeaders(token: string | null): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // 🎯 MÉTHODES POUR LA GESTION DES STATUTS
  changeOfferStatus(offerId: string, status: 'Publié' | 'Brouillon' | 'Archivé'): Observable<OfferResponse> {
    return this.updateOffer(offerId, { status });
  }

  archiveOffer(offerId: string): Observable<OfferResponse> {
    return this.changeOfferStatus(offerId, 'Archivé');
  }

  publishOffer(offerId: string): Observable<OfferResponse> {
    return this.changeOfferStatus(offerId, 'Publié');
  }

  saveAsDraft(offerId: string): Observable<OfferResponse> {
    return this.changeOfferStatus(offerId, 'Brouillon');
  }

  // 🎯 MÉTHODE POUR INCRÉMENTER LES VUES
  incrementViews(offerId: string): Observable<Offer> {
    return this.http.get<Offer>(`${this.apiUrl}/getOffreById/${offerId}`);
  }

  // 🎯 MÉTHODE POUR FORMATER LES DONNÉES AVANT ENVOI
  formatOfferData(formData: any, selectedSector: string): any {
    const baseData = {
      sector: formData.sector,
      title: formData.title,
      description: formData.description,
      experienceLevel: formData.experienceLevel,
      contractType: formData.contractType,
      location: formData.location,
      salaryRange: formData.salaryRange,
      startOffreDate: formData.startOffreDate,
      endOffreDate: formData.endOffreDate,
      workingHours: formData.workingHours,
      remoteOption: formData.remoteOption,
      status: formData.status || 'Publié'
    };

    // Ajouter les champs spécifiques selon le secteur
    switch (selectedSector) {
      case 'Informatique':
        return {
          ...baseData,
          programmingLanguages: formData.programmingLanguages || [],
          frameworks: formData.frameworks || [],
          databaseKnowledge: formData.databaseKnowledge || [],
          tools: formData.tools || [],
          projectType: formData.projectType || '',
          methodology: formData.methodology || []
        };

      case 'Marketing':
        return {
          ...baseData,
          marketingChannels: formData.marketingChannels || [],
          campaignTools: formData.campaignTools || [],
          targetAudience: formData.targetAudience || [],
          kpiFocus: formData.kpiFocus || []
        };

      case 'Finance':
        return {
          ...baseData,
          financialTools: formData.financialTools || [],
          areaOfExpertise: formData.areaOfExpertise || [],
          certifications: formData.certifications || [],
          reportingFrequency: formData.reportingFrequency || []
        };

      case 'Santé':
        return {
          ...baseData,
          requiredDiploma: formData.requiredDiploma || [],
          medicalSpecialty: formData.medicalSpecialty || [],
          workSchedule: formData.workSchedule || [],
          licenseNumber: formData.licenseNumber || []
        };

      case 'Éducation':
        return {
          ...baseData,
          teachingLevel: formData.teachingLevel || [],
          subjectTaught: formData.subjectTaught || [],
          requiredDegree: formData.requiredDegree || [],
          classSize: formData.classSize || null
        };

      case 'Commerce':
        return {
          ...baseData,
          salesType: formData.salesType || [],
          productType: formData.productType || [],
          salesTarget: formData.salesTarget || [],
          customerManagementTools: formData.customerManagementTools || [],
          mobilityRequired: formData.mobilityRequired || false
        };

      case 'Industrie':
        return {
          ...baseData,
          machineOperation: formData.machineOperation || [],
          safetyCertifications: formData.safetyCertifications || [],
          shiftType: formData.shiftType || '',
          productionEnvironment: formData.productionEnvironment || '',
          qualityControl: formData.qualityControl || ''
        };

      default:
        return baseData;
    }
  }
}