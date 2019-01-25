import { Injectable } from '@angular/core';
import { EntityStore, EntityState, StoreConfig, ID, IDS } from '@datorama/akita';
import { CountryInterface } from './interfaces/country.interface';

export interface CountriesState extends EntityState<CountryInterface> { }

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'countries' })
export class CountriesStore extends EntityStore<CountriesState, CountryInterface> {
  constructor() {
    super();
  }
}
