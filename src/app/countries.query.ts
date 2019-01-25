import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CountriesState, CountriesStore } from './countries.store';
import { CountryInterface } from './interfaces/country.interface';

@Injectable({
  providedIn: 'root'
})
export class CountriesQuery extends QueryEntity<CountriesState, CountryInterface> {

  countries$ = this.selectAll();

  constructor( protected store: CountriesStore ) {
    super(store);
  }
}
