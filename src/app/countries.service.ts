import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CountryInterface } from './interfaces/country.interface';
import { CountriesQuery } from './countries.query';
import { CountriesStore } from './countries.store';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private readonly url = `${environment.apiUrl}/countries`;

  constructor(
    private http: HttpClient,
    private countriesQuery: CountriesQuery,
    private countriesStore: CountriesStore,
  ) { }

  loadAllCountries(): Observable<null> {

    return Observable.create(observer => {

      if (this.countriesQuery.isPristine) {
        observer.next();
      } else {
        observer.complete();
      }

    }).pipe(
      switchMap(_ => this.getAllCountries()),
      switchMap(countries => {
        this.countriesStore.set(countries);
        return of(null);
      })
    );

  }

  removeCountry(id: number): Observable<any> {

    return this.deleteCountry(id)
      .pipe(
        tap(_ => this.countriesStore.remove(id))
      );

  }

  addCountry(country: CountryInterface): Observable<null> {

    return this.createCountry(country)
      .pipe(
        switchMap(newCountry => {
          this.countriesStore.add(newCountry);
          return of(null);
        })
      );

  }

  getAllCountries(): Observable<CountryInterface[]> {

    return this.http.get<CountryInterface[]>(this.url);

  }

  getCountryById(id: number): Observable<CountryInterface> {

    return this.http.get<CountryInterface>(`${this.url}/${id}`);

  }

  createCountry(data: CountryInterface): Observable<CountryInterface> {

    return this.http.post<CountryInterface>(this.url, data);

  }

  updateCountry(country: CountryInterface): Observable<any> {

    return this.http.put<CountryInterface>(`${this.url}/${country.id}`, country)
      .pipe(
        switchMap(newCountry => {
          this.countriesStore.update(newCountry.id, newCountry);
          return of(null);
        })
      );

  }

  deleteCountry(id: number): Observable<any> {

    return this.http.delete(`${this.url}/${id}`);

  }
}
