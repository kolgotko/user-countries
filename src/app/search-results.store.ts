import { Injectable } from '@angular/core';
import { EntityStore, EntityState, StoreConfig, ID, IDS } from '@datorama/akita';
import { SearchResult } from './models/search-result.model';

export interface SearchResultsState extends EntityState<SearchResult> { }

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'search-results' })
export class SearchResultsStore extends EntityStore<SearchResultsState, SearchResult> {
  constructor() {
    super();
  }
}
