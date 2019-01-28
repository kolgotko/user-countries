import { Injectable } from '@angular/core';
import { SearchResultsStore } from './search-results.store';
import { SearchResult } from './models/search-result.model';
import { SearchResultsQuery } from './search-results.query';

@Injectable({ providedIn: 'root' })
export class SearchService {

  constructor(
    private searchResultsStore: SearchResultsStore,
    private searchResultsQuery: SearchResultsQuery,
  ) { }

  setResults(results: SearchResult[]) {

    this.searchResultsStore.set(results);

  }

  clearResults() {

    this.searchResultsStore.set([]);
    this.searchResultsStore.setLoading(true);

  }

  clearDirty() {

    this.searchResultsStore.update(null, { dirty: false });

  }

  updateResult(result: SearchResult) {

    this.searchResultsStore.update(result.id, result);

  }

}
