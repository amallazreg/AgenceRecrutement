/*export interface AuthResponse {
        success: boolean;
        message: string;
        token: string;
        role: string;
        email: string;
        username: string;
        sector:string;
        _id : string; 
        profileStatus : string;      
}*/
export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  role: 'user' | 'company' | 'admin';
  userId?: string;            // correspond à _id du backend pour l'utilisateur
  name?: string;              // nom de l'utilisateur ou de l'entreprise
  email?: string;             // email de l'utilisateur si applicable
  username?: string;          // si tu utilises ce champ pour login
  sector?: string;            // pour company
  profileStatus?: 'Complet' | 'Incomplet' | 'En attente'; // profil utilisateur
}

