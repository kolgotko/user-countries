import { Injectable } from '@angular/core';
import { SearchResultsStore } from './search-results.store';
import { SearchResultInterface } from './interfaces/search-result.interface';
import { SearchResultsQuery } from './search-results.query';

@Injectable({ providedIn: 'root' })
export class SearchService {

  constructor(
    private searchResultsStore: SearchResultsStore,
    private searchResultsQuery: SearchResultsQuery,
  ) { }

  setResults(results: SearchResultInterface[]) {

    this.searchResultsStore.set(results);

  }

  clearResults() {

    this.searchResultsStore.set([]);
    this.searchResultsStore.setLoading(true);

  }

}
