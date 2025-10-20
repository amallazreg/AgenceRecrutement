import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  signupCompany(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/company/signupCompany`, data);
  }

  getCompanyCount(): Observable<any> {
     return this.http.get<any>(`${this.apiUrl}/admin/getCompanyCount`);
  }

  getAllCompanies(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/admin/getAllCompany`);
  }

 
  deleteAgency(id: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/admin/deleteCompany/${id}`);
  }

   getAllUsers(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/admin/getAllUser`);
  }

   getUserCount(): Observable<any> {
     return this.http.get<any>(`${this.apiUrl}/admin/getUserCount`);
  }






}
