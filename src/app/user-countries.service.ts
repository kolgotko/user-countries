import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserCountriesQuery } from './user-countries.query';
import { UserCountriesStore } from './user-countries.store';
import { UserCountryInterface } from './interfaces/user-coutry.interface';

@Injectable({
  providedIn: 'root'
})
export class UserCountriesService {

  private readonly url = `${environment.apiUrl}/user-countries`;

  constructor(
    private http: HttpClient,
    private userCountriesStore: UserCountriesStore,
    private userCountriesQuery: UserCountriesQuery,
  ) { }

  loadAllUserCountries(): Observable<any> {

    return Observable.create(observer => {

      if (this.userCountriesQuery.isPristine) {
        observer.next();
      } else {
        observer.complete();
      }

    }).pipe(
      switchMap(_ => this.getAllUserCountries()),
      switchMap(userCountries => {
        this.userCountriesStore.set(userCountries);
        return of(null);
      })
    );

  }

  addUserCountry(data: UserCountryInterface): Observable<any> {

    return this.createUserCountry(data)
    .pipe(
      switchMap(newUserCountry => {
        this.userCountriesStore.add(newUserCountry);
        return of(null);
      })
    );

  }

  updateUserCountry(data: UserCountryInterface): Observable<any> {

    return this.http.put<UserCountryInterface>(`${this.url}/${data.id}`, data)
      .pipe(
        switchMap(newUserCountry => {
          this.userCountriesStore.update(newUserCountry.id, newUserCountry);
          return of(null);
        })
      );

  }

  getAllUserCountries(): Observable<UserCountryInterface[]> {

    return this.http.get<UserCountryInterface[]>(this.url);

  }

  createUserCountry(data: UserCountryInterface): Observable<UserCountryInterface> {

    return this.http.post<UserCountryInterface>(this.url, data);

  }

}
