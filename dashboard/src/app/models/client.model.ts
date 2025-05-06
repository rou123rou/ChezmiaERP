// client.model.ts
export interface Adresse {
  rue?: string;
  ville?: string;
  codePostal?: string;
  pays?: string;
}

export interface Client {
  id?: string;
  _id?: string; // L'ID utilisé par MongoDB
  nom: string;
  prenom?: string;
  email: string;
  telephone?: string;
  adresse?: Adresse;
  dateCreation?: Date;
  // Champs pour la gestion de l'authentification et des rôles (optionnels pour l'instant)
  password?: string; // Pour la création de nouveaux utilisateurs
  role?: string;
  isBlocked?: boolean;
}