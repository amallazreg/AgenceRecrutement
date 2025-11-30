import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offer } from './offers.service';

export interface RecommendationResponse {
  candidate: {
    specialty: string;
    skills: string;
  };
  recommendations: OfferWithScore[];
}

export interface OfferWithScore extends Offer {
  matchingScore: number;
}
@Injectable({
  providedIn: 'root'
})
export class MatchScoreService {
  private apiUrl = `http://localhost:3000/candidatureOfferRoute`; // Ajustez selon votre config

  constructor(private http: HttpClient) {}

  /**
   * Obtenir les offres recommandées pour un candidat
   */
  getRecommendedOffers(candidateId: string): Observable<RecommendationResponse> {
    return this.http.get<RecommendationResponse>(
      `${this.apiUrl}/recommend/${candidateId}`
    );
  }

  /**
   * Obtenir la couleur du badge selon le score
   */
  getMatchColor(score: number): string {
    // Score est entre 0 et 1, on le convertit en pourcentage
    const percentage = score * 100;
    
    if (percentage >= 80) return '#10b981'; // Vert - Excellent
    if (percentage >= 60) return '#3b82f6'; // Bleu - Très bon
    if (percentage >= 40) return '#f59e0b'; // Orange - Bon
    if (percentage >= 20) return '#f97316'; // Orange foncé - Moyen
    return '#6b7280'; // Gris - Faible
  }

  /**
   * Obtenir le label du match selon le score
   */
  getMatchLabel(score: number): string {
    const percentage = score * 100;
    
    if (percentage >= 80) return 'Excellent match';
    if (percentage >= 60) return 'Très bon match';
    if (percentage >= 40) return 'Bon match';
    if (percentage >= 20) return 'Match moyen';
    return 'Match faible';
  }

  /**
   * Obtenir l'icône emoji selon le score
   */
  getMatchEmoji(score: number): string {
    const percentage = score * 100;
    
    if (percentage >= 80) return '🔥';
    if (percentage >= 60) return '⭐';
    if (percentage >= 40) return '✨';
    if (percentage >= 20) return '💫';
    return '📌';
  }

  /**
   * Convertir le score (0-1) en pourcentage
   */
  scoreToPercentage(score: number): number {
    return Math.round(score * 100);
  }
}