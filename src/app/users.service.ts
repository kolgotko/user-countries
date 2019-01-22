import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from './interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly url = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient,
  ) { }

  getAllUsers(): Observable<UserInterface[]> {

    return this.http.get<UserInterface[]>(this.url);

  }

  getUserById(id: number): Observable<UserInterface> {

    return this.http.get<UserInterface>(`${this.url}/${id}`);

  }

  createUser(data: UserInterface): Observable<any> {

    return this.http.post(this.url, data);

  }

  updateUser(data: UserInterface): Observable<any> {

    return this.http.put(`${this.url}/${data.id}`, data);

  }

  deleteUser(id: number): Observable<any> {

    return this.http.delete(`${this.url}/${id}`);

  }

}
