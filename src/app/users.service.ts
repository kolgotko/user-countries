import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from './interfaces/user.interface';
import { UsersStore } from './users.store';
import { UsersQuery } from './users.query';
import {
  Observable, Observer, of, throwError, EMPTY
} from 'rxjs';
import {
  tap, switchMap, catchError, takeWhile, map
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly url = `${environment.apiUrl}/users`;

  constructor(
    private usersStore: UsersStore,
    private usersQuery: UsersQuery,
    private http: HttpClient,
  ) { }

  loadAllUsers(): Observable<any> {

    return Observable.create(observer => {

      if (this.usersQuery.isPristine) {
        observer.next();
      } else {
        observer.complete();
      }

    }).pipe(
      switchMap(_ => this.getAllUsers()),
      map(users => this.usersStore.set(users))
    );

  }

  addUser(user: UserInterface): Observable<any> {

    return this.createUser(user)
      .pipe(
        map(newUser => this.usersStore.add(newUser))
      );

  }

  removeUser(id: number): Observable<null> {

    return this.deleteUser(id)
      .pipe(
        tap(_ => this.usersStore.remove(id))
      );

  }

  getAllUsers(): Observable<UserInterface[]> {

    return this.http.get<UserInterface[]>(this.url);

  }

  getUserById(id: number): Observable<UserInterface> {

    return this.http.get<UserInterface>(`${this.url}/${id}`);

  }

  createUser(data: UserInterface): Observable<UserInterface> {

    return this.http.post<UserInterface>(this.url, data);

  }

  updateUser(user: UserInterface): Observable<any> {

    return this.http.put<UserInterface>(`${this.url}/${user.id}`, user)
      .pipe(
        map(newUser => this.usersStore.update(newUser.id, newUser))
      );

  }

  deleteUser(id: number): Observable<any> {

    return this.http.delete(`${this.url}/${id}`);

  }

}
