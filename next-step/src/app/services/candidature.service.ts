import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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


}
