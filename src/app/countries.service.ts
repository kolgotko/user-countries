import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CountryInterface } from './interfaces/country.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private readonly url = `${environment.apiUrl}/countries`;

  constructor(
    private http: HttpClient,
  ) { }

  getAllCountries(): Observable<CountryInterface[]> {

    return this.http.get<CountryInterface[]>(this.url);

  }

  getCountryById(id: number): Observable<CountryInterface> {

    return this.http.get<CountryInterface>(`${this.url}/${id}`);

  }

  createCountry(data: CountryInterface): Observable<any> {

    return this.http.post(this.url, data);

  }

  updateCountry(data: CountryInterface): Observable<any> {

    return this.http.put(`${this.url}/${data.id}`, data);

  }

  deleteCountry(id: number): Observable<any> {

    return this.http.delete(`${this.url}/${id}`);

  }
}
