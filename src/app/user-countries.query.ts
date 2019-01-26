import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { UserCountriesState, UserCountriesStore } from './user-countries.store';
import { UserCountryInterface } from './interfaces/user-coutry.interface';
import { UsersQuery } from './users.query';
import { CountriesQuery } from './countries.query';
import { Observable, combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserCountriesQuery extends QueryEntity<UserCountriesState, UserCountryInterface> {

  userCountries$ = this.selectAll();

  constructor(
    protected store: UserCountriesStore,
    private usersQuery: UsersQuery,
    private countriesQuery: CountriesQuery,
  ) {
    super(store);
  }

}
