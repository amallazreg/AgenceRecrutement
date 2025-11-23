import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Company {
  _id: string;
  name: string;
  sector: string;
  email: string;
  companyDescription: string;
  fullAddress: string;
  phoneNumber: string;
  website: string;
  hrManage: string;
  managerEmail: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = `http://localhost:3000/company`;
  private apiUrl2 = `http://localhost:3000/admin/getCompanyById`

  constructor(private http: HttpClient) { }

  // Récupérer les infos de la company connectée
  getCurrentCompany(): Observable<Company> {
    const token = localStorage.getItem('token'); // ou votre méthode de stockage du token
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<Company>(`${this.apiUrl}/companyDashboard`, { headers });
  }

  // Optionnel: Mettre à jour le profil company
  updateCompanyProfile(companyData: any): Observable<Company> {
    const token = localStorage.getItem('token');
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<Company>(`${this.apiUrl}/profile`, companyData, { headers });
  }

  // Optionnel: Récupérer company par ID
  getCompanyById(companyId: string): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl2}/${companyId}`);
  }

  // Récupérer l'ID de la company connectée
getCurrentCompanyId(): Observable<string> {
  return new Observable(observer => {
    this.getCurrentCompany().subscribe({
      next: (company: Company) => {
        observer.next(company._id); // renvoie l'ID
        observer.complete();
      },
      error: (err) => observer.error(err)
    });
  });
}

}