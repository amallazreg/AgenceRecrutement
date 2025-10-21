import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { UserDashboardComponent } from './dashboards/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './dashboards/admin-dashboard/admin-dashboard.component';
import { CompanyDashboardComponent } from './dashboards/company-dashboard/company-dashboard.component';
import { CompaniesComponent } from './companies/companies/companies.component';
import { CondidateComponent } from './companies/condidate/condidate.component';
import { AcceuilComponent } from './dashboards/acceuil/acceuil.component';

export const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/signup', component: SignupComponent },
  { path: 'userDashboard', component: UserDashboardComponent },
  {path : 'adminDashboard' , component:AdminDashboardComponent},
  {path : 'companyDashboard', component:CompanyDashboardComponent},
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'companies', component: CompaniesComponent },
  {path :'candidates',component : CondidateComponent},
  {path : 'acceuil', component : AcceuilComponent},
  { path: '**', redirectTo: 'auth/login' }, 


]
