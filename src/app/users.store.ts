import { Injectable } from '@angular/core';
import { EntityStore, EntityState, StoreConfig, ID, IDS } from '@datorama/akita';
import { UserInterface } from './interfaces/user.interface';

export interface UsersState extends EntityState<UserInterface> { }

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'users' })
export class UsersStore extends EntityStore<UsersState, UserInterface> {
  constructor() {
    super();
  }
}
