import { Injectable } from '@angular/core';
import { EntityStore, EntityState, StoreConfig, ID, IDS } from '@datorama/akita';
import { SearchResultInterface } from './interfaces/search-result.interface';

export interface SearchResultsState extends EntityState<SearchResultInterface> { }

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'search-results', idKey: 'userCountryId' })
export class SearchResultsStore extends EntityStore<SearchResultsState, SearchResultInterface> {
  constructor() {
    super();
  }
}
