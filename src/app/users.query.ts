import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { UsersState, UsersStore } from './users.store';
import { UserInterface } from './interfaces/user.interface';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersQuery extends QueryEntity<UsersState, UserInterface> {

  users$ = this.selectAll();

  constructor( protected store: UsersStore ) {
    super(store);
  }

  getUserByName(name: string): Observable<UserInterface> {

    return this.selectAll({
      filterBy: user => user.name === name
    }).pipe(
      switchMap(users => of(users[0]))
    );

  }
}
