import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../../../models/client.model';
export interface Adresse {
  rue?: string;
  ville?: string;
  codePostal?: string;
  pays?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private apiUrl = 'http://localhost:5000/api/clients';

  constructor(private http: HttpClient) {}

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  getClientById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  addClient(client: Omit<Client, 'id' | '_id' | 'dateCreation' | 'role' | 'isBlocked'> & { password?: string }): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  updateClient(id: string, client: Omit<Client, 'id' | '_id' | 'dateCreation' | 'password'>): Observable<Client> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Client>(url, client);
  }

  deleteClient(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

  blockClient(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/block`, {}); // Assurez-vous que this.apiUrl est correctement défini
  }

  unblockClient(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}/unblock`;
    return this.http.put(url, {});
  }

  resetClientPassword(id: string, newPassword: string): Observable<any> {
    const url = `${this.apiUrl}/${id}/reset-password`;
    return this.http.post(url, { newPassword });
  }
}

export type { Client };
