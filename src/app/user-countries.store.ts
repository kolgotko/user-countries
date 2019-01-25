import { Injectable } from '@angular/core';
import { EntityStore, EntityState, StoreConfig, ID, IDS } from '@datorama/akita';
import { UserCountryInterface } from './interfaces/user-coutry.interface';

export interface UserCountriesState extends EntityState<UserCountryInterface> { }

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'user-countries' })
export class UserCountriesStore extends EntityStore<UserCountriesState, UserCountryInterface> {
  constructor() {
    super();
  }
}
